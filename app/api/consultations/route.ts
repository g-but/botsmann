import type { NextRequest } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Consultation } from '@/src/lib/models/consultation';
import { rateLimit } from '@/src/lib/rate-limit';
import { CustomerSchema } from '@/src/lib/schemas/customer';
import { validateApiKey } from '@/src/lib/middleware/auth';
import { EmailService } from '@/src/lib/email/service';
import { ZodError } from 'zod';
import { NextResponse } from 'next/server';

const limiter = rateLimit({
  limit: process.env.NODE_ENV === 'test' ? 3 : 5,
  interval: process.env.NODE_ENV === 'test' ? 1000 : 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const emailService = new EmailService();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Accept',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Expose-Headers': 'Content-Type'
};

// Helper function to create consistent response format
const createApiResponse = (data: any, status: number = 200) => {
  return new Response(JSON.stringify({
    ...data,
    timestamp: new Date().toISOString()
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  });
}

export const POST = async (req: NextRequest) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders
    });
  }

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
      return createApiResponse({
        success: false,
        message: 'Rate limit exceeded. Please try again later.',
        code: 'RATE_LIMIT'
      }, 429);
    }

    const body = await req.json();
    const validatedData = CustomerSchema.parse(body);

    // Connect to DB (skipped in test environment)
    if (process.env.NODE_ENV !== 'test') {
      try {
        await connectDB();
      } catch (error) {
        console.error('Failed to connect to database:', error);
        return createApiResponse({
          success: false,
          message: 'Database connection error',
          code: 'DB_ERROR'
        }, 503);
      }
    }

    const consultation = await Consultation.create(validatedData);

    // Send emails asynchronously
    try {
      await Promise.all([
        emailService.sendWelcomeEmail(validatedData),
        emailService.sendAdminNotification(validatedData),
      ]);
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
    }

    return createApiResponse({
      success: true,
      message: 'Form submitted successfully',
      id: consultation._id,
      code: 'SUCCESS'
    });
  } catch (error: unknown) {
    console.error('API Error:', error);
    
    if (error instanceof ZodError) {
      return createApiResponse({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors
      }, 400);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return createApiResponse({
      success: false,
      message: errorMessage,
      code: 'ERROR'
    }, 500);
  }
}                                                                                        