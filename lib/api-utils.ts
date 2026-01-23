/**
 * Shared API Utilities
 * @module lib/api-utils
 *
 * Centralized utilities for API routes.
 * Follow DRY principle - import from here instead of duplicating.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from './supabase';
import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { HTTP_STATUS } from './api/responses';

/**
 * Standard API response shape
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

/**
 * Create a successful JSON response
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Create an error JSON response
 */
export function apiError(
  error: string,
  status = 500,
  details?: unknown,
): NextResponse<ApiResponse> {
  const response: ApiResponse = { success: false, error };
  if (details !== undefined) {
    response.details = details;
  }
  return NextResponse.json(response, { status });
}

/**
 * HTTP Status codes as constants
 */
// NOTE: HTTP status codes are sourced from lib/api/responses (SSOT)

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Not found',
  INTERNAL_ERROR: 'Internal server error',
  VALIDATION_FAILED: 'Validation failed',
  SUPABASE_NOT_CONFIGURED: 'Supabase not configured',
} as const;

/**
 * Verify user from JWT token in Authorization header
 * Extracts Bearer token and validates against Supabase
 *
 * @param request - Next.js request object
 * @returns User object if valid, null otherwise
 */
export async function verifyUser(request: NextRequest): Promise<User | null> {
  // Preferred: cookie-based via auth-helpers
  try {
    const routeClient = createRouteHandlerClient({ cookies });
    const { data, error } = await routeClient.auth.getUser();
    if (!error && data.user) return data.user;
  } catch {}

  // Fallback: Bearer token header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const supabase = getServiceClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data.user) return data.user;
  }
  return null;
}

/**
 * Wrapper for API route handlers with automatic error handling
 * Catches errors and returns appropriate responses
 */
export function withErrorHandling<T>(handler: (request: NextRequest) => Promise<NextResponse<T>>) {
  return async (request: NextRequest): Promise<NextResponse<T | ApiResponse>> => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API Error:', error);
      return apiError(ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_ERROR);
    }
  };
}

/**
 * Require authentication wrapper
 * Returns 401 if user is not authenticated
 */
export async function requireAuth(
  request: NextRequest,
): Promise<{ user: User } | NextResponse<ApiResponse>> {
  const user = await verifyUser(request);
  if (!user) {
    return apiError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  return { user };
}
