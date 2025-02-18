import type { NextRequest } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Consultation } from '@/src/lib/models/consultation';
import { rateLimit } from '@/src/lib/rate-limit';
import { CustomerSchema } from '@/src/lib/schemas/customer';
import { createErrorResponse } from '@/src/lib/schemas/errors';
import { validateApiKey } from '@/src/lib/middleware/auth';
import { monitorRequest } from '@/src/lib/middleware/monitoring';
import { EmailService } from '@/src/lib/email/service';
import { ZodError } from 'zod';
import { NextResponse } from 'next/server';

const limiter = rateLimit({
  limit: process.env.NODE_ENV === 'test' ? 3 : 5,
  interval: process.env.NODE_ENV === 'test' ? 1000 : 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const emailService = new EmailService();

async function handler(req: NextRequest) {
  let body;
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
    
    body = await req.json();
    const validatedData = CustomerSchema.parse(body);
    
    // Connect to DB (skipped in test environment)
    if (process.env.NODE_ENV !== 'test') {
      try {
        await connectDB();
      } catch (error) {
        console.error('Failed to connect to database:', error);
        return new Response(
          JSON.stringify(createErrorResponse(
            'Database connection error',
            'INTERNAL_ERROR'
          )),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
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
      // Don't return error response, continue with success
    }
    
    return new Response(
      JSON.stringify({ success: true, id: consultation._id }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Consultation submission error:', error);

    if (error.code === 'RATE_LIMIT') {
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Accept',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Expose-Headers': 'Content-Type'
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  });
}

export async function POST(req: NextRequest) {
  try {
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    const response = await monitorRequest(req, handler);
    
    // Ensure we have a valid JSON response
    let responseBody: string = '';
    try {
      // If response.body is a ReadableStream, we need to read it
      if (response.body instanceof ReadableStream) {
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) chunks.push(value);
        }
        const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
        let offset = 0;
        for (const chunk of chunks) {
          concatenated.set(chunk, offset);
          offset += chunk.length;
        }
        responseBody = new TextDecoder().decode(concatenated);
      } else if (typeof response.body === 'string') {
        responseBody = response.body;
      } else {
        responseBody = JSON.stringify({
          success: response.ok,
          message: response.ok ? 'Form submitted successfully' : 'Failed to submit form'
        });
      }
      
      // Ensure it's valid JSON by parsing and stringifying
      responseBody = JSON.stringify(JSON.parse(responseBody));
    } catch (error) {
      console.error('Error processing response:', error);
      responseBody = JSON.stringify({
        success: false,
        message: 'Failed to process form submission'
      });
    }

    const headers = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    headers.set('Content-Type', 'application/json');
    
    return new Response(responseBody, {
      status: response.status,
      headers
    });
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            