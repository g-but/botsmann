import type { NextRequest } from 'next/server';
import { Consultation } from '@/src/lib/models/consultation';
import { rateLimit } from '@/src/lib/rate-limit';
import { CustomerSchema } from '@/src/lib/schemas/customer';
import { createErrorResponse } from '@/src/lib/schemas/errors';
import { validateApiKey } from '@/src/lib/middleware/auth';
import { monitorRequest } from '@/src/lib/middleware/monitoring';
import { ZodError } from 'zod';
import { connectDB } from '@/src/lib/mongodb';

const limiter = rateLimit({
  limit: process.env.NODE_ENV === 'test' ? 3 : 5, // Lower limit in test environment
  interval: process.env.NODE_ENV === 'test' ? 1000 : 60 * 1000, // Shorter interval in test
  uniqueTokenPerInterval: 500,
});

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
    console.log('Request Body:', body);
    const validatedData = CustomerSchema.parse(body);
    console.log('Validated Data:', validatedData);
    
    // In test environment, skip DB connection
    if (process.env.NODE_ENV !== 'test') {
      await connectDB();
    }
    
    const consultation = await Consultation.create(validatedData);
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
      console.log('Validation Error Details:', {
        body: body,
        errors: error.errors
      });
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