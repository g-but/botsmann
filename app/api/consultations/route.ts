import { NextResponse } from 'next/server';
import { rateLimit } from '@/src/lib/rate-limit';
import { CustomerSchema } from '@/src/lib/schemas/customer';
import { createErrorResponse } from '@/src/lib/schemas/errors';
import { EmailService } from '@/src/lib/email/service';
import { ZodError } from 'zod';

const limiter = rateLimit({
  limit: process.env.NODE_ENV === 'test' ? 3 : 5,
  interval: process.env.NODE_ENV === 'test' ? 1000 : 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const emailService = new EmailService();

export async function POST(req: Request) {
  try {
    // Check rate limit
    const rateLimitKey = 'CONSULTATION_FORM';
    const { isRateLimited } = await limiter.check(rateLimitKey);
    if (isRateLimited) {
      return NextResponse.json(
        createErrorResponse('Rate limit exceeded', 'RATE_LIMIT'),
        { status: 429 }
      );
    }
    
    const body = await req.json();
    const validatedData = CustomerSchema.parse(body);

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
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Consultation submission error:', error);
    
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
      createErrorResponse('Failed to submit consultation', 'INTERNAL_ERROR'),
      { status: 500 }
    );
  }
}                                