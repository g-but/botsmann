import type { NextRequest } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { rateLimit } from '@/src/lib/rate-limit';
import { CustomerSchema } from '@/src/lib/schemas/customer';
import { validateApiKey } from '@/src/lib/middleware/auth';
import { EmailService } from '@/src/lib/email/service';
import { ZodError } from 'zod';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const limiter = rateLimit({
  limit: process.env.NODE_ENV === 'test' ? 3 : 5,
  interval: process.env.NODE_ENV === 'test' ? 1000 : 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const emailService = new EmailService();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const allowedOrigins = ['https://www.botsmann.com', 'https://botsmann.com', 'http://localhost:3000'];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Accept',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Expose-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  // Add CORS headers to all responses
  const headers = {
    ...corsHeaders,
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Accept',
    'Access-Control-Allow-Credentials': 'true'
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers
    });
  }

  console.log('Received POST request:', request.method);
  console.log('Request headers:', Object.fromEntries(request.headers));

  try {
    // Validate API key first
    const authResponse = await validateApiKey(request);
    if (authResponse) {
      return authResponse;
    }

    // Check rate limit
    const rateLimitKey = 'CONSULTATION_FORM';
    const { isRateLimited } = await limiter.check(rateLimitKey);
    if (isRateLimited) {
      return NextResponse.json({
        success: false,
        message: 'Rate limit exceeded. Please try again later.',
        code: 'RATE_LIMIT',
        timestamp: new Date().toISOString()
      }, {
        status: 429,
        headers: corsHeaders
      });
    }

    const body = await request.json();
    const validatedData = CustomerSchema.parse(body);

    // Connect to DB (skipped in test environment)
    if (process.env.NODE_ENV !== 'test') {
      try {
        await connectDB();
      } catch (error) {
        console.error('Failed to connect to database:', error);
        return NextResponse.json({
          success: false,
          message: 'Database connection error',
          code: 'DB_ERROR',
          timestamp: new Date().toISOString()
        }, {
          status: 503,
          headers: corsHeaders
        });
      }
    }

    const ConsultationModel = mongoose.models.Consultation || mongoose.model('Consultation', new mongoose.Schema({
      name: String,
      email: String,
      message: String,
      preferences: {
        newsletter: Boolean,
        productUpdates: Boolean
      }
    }));
    
    const consultation = await ConsultationModel.create(validatedData);

    // Send emails asynchronously
    try {
      await Promise.all([
        emailService.sendWelcomeEmail(validatedData),
        emailService.sendAdminNotification(validatedData),
      ]);
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      id: consultation._id,
      code: 'SUCCESS',
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: corsHeaders
    });
  } catch (error: unknown) {
    console.error('API Error:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors,
        timestamp: new Date().toISOString()
      }, {
        status: 400,
        headers: corsHeaders
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({
      success: false,
      message: errorMessage,
      code: 'ERROR',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: corsHeaders
    });
  }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                