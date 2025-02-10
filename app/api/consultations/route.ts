import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Consultation } from '@/src/lib/models/consultation';
import { rateLimit } from '@/src/lib/rate-limit';
import { CustomerSchema } from '@/src/lib/schemas/customer';
import { createErrorResponse } from '@/src/lib/schemas/errors';
import { ZodError } from 'zod';

const limiter = rateLimit({
  limit: 5, // 5 requests per interval
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
  try {
    const { isRateLimited } = await limiter.check('CONSULTATION_FORM');
    if (isRateLimited) {
      throw Object.assign(new Error('Rate limit exceeded'), { code: 'RATE_LIMIT' });
    }
    
    const body = await req.json();
    const validatedData = CustomerSchema.parse(body);
    await connectDB();
    
    const consultation = await Consultation.create(validatedData);
    
    return NextResponse.json({ success: true, id: consultation._id });
  } catch (error: any) {
    console.error('Consultation submission error:', error);

    if (error.code === 'RATE_LIMIT') {
      return NextResponse.json(
        createErrorResponse(
          'Rate limit exceeded. Please try again later.',
          'RATE_LIMIT'
        ),
        { status: 429 }
      );
    }
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        createErrorResponse(
          'Validation failed',
          'VALIDATION_ERROR',
          error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        ),
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      createErrorResponse(
        'Failed to submit consultation',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }
}     