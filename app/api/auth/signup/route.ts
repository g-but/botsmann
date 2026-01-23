/**
 * Sign Up API Route
 *
 * POST /api/auth/signup
 * Rate limited: 5 requests per minute
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase-server';
import { z } from 'zod';
import { rateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit';

const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: NextRequest) {
  // Rate limiting
  const rateLimitResult = await rateLimit(req, RATE_LIMIT_CONFIGS.auth);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();

    // Validate input
    const result = SignUpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.errors[0].message,
          code: 'VALIDATION_ERROR',
        },
        { status: 400 },
      );
    }

    const { email, password } = result.data;

    // Get the origin for the redirect URL
    const origin = req.headers.get('origin') || req.nextUrl.origin;

    // Sign up with Supabase
    const supabase = createRouteHandlerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?type=signup`,
      },
    });

    if (error) {
      // Check for specific errors
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          {
            success: false,
            error: 'An account with this email already exists',
            code: 'EMAIL_EXISTS',
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: 'AUTH_ERROR',
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Please check your email to verify your account',
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
          }
        : null,
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during sign up',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 },
    );
  }
}
