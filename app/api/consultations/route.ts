import type { NextRequest } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';
import { CustomerSchema } from '@/lib/schemas/customer';
import { createErrorResponse } from '@/lib/schemas/errors';
import { validateApiKey } from '@/lib/middleware/auth';
import { monitorRequest } from '@/lib/middleware/monitoring';
import { EmailService } from '@/lib/email/service';
import { ZodError } from 'zod';

const limiter = rateLimit({
  limit: process.env.NODE_ENV === 'test' ? 3 : 5,
  interval: process.env.NODE_ENV === 'test' ? 1000 : 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const emailService = new EmailService();

async function handler(req: NextRequest) {
  try {
    // Validate API key first
    const authResponse = await validateApiKey(req);
    if (authResponse) {
      return authResponse;
    }

    // Check rate limit
    const rateLimitKey = 'CONSULTATION_FORM';
    const { isRateLimited } = await limiter.check(rateLimitKey);
    if (isRateLimited) {
      throw Object.assign(new Error('Rate limit exceeded'), { code: 'RATE_LIMIT' });
    }

    const body = await req.json();
    const validatedData = CustomerSchema.parse(body);

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.error('Supabase not configured');
      return new Response(
        JSON.stringify(createErrorResponse(
          'Database not configured',
          'INTERNAL_ERROR'
        )),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Insert consultation into Supabase
    const { data: consultation, error: dbError } = await supabase
      .from('consultations')
      .insert({
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
        status: 'new'
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return new Response(
        JSON.stringify(createErrorResponse(
          'Database error',
          'INTERNAL_ERROR'
        )),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Send emails asynchronously
    try {
      await Promise.all([
        emailService.sendWelcomeEmail(validatedData),
        emailService.sendAdminNotification(validatedData),
      ]);
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
      // Don't return error response, continue with success
    }

    return new Response(
      JSON.stringify({ success: true, id: consultation.id }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: unknown) {
    console.error('Consultation submission error:', error);

    const errorWithCode = error as { code?: string };
    if (errorWithCode.code === 'RATE_LIMIT') {
      return new Response(
        JSON.stringify(createErrorResponse(
          'Rate limit exceeded. Please try again later.',
          'RATE_LIMIT'
        )),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify(createErrorResponse(
          'Validation failed',
          'VALIDATION_ERROR',
          error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        )),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify(createErrorResponse(
        'Failed to submit consultation',
        'INTERNAL_ERROR'
      )),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export const POST = (req: NextRequest) => monitorRequest(req, handler);
