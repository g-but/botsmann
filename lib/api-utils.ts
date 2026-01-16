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
  details?: unknown
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
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

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
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const supabase = getServiceClient();

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Wrapper for API route handlers with automatic error handling
 * Catches errors and returns appropriate responses
 */
export function withErrorHandling<T>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>
) {
  return async (request: NextRequest): Promise<NextResponse<T | ApiResponse>> => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API Error:', error);
      return apiError(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_ERROR
      );
    }
  };
}

/**
 * Require authentication wrapper
 * Returns 401 if user is not authenticated
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ user: User } | NextResponse<ApiResponse>> {
  const user = await verifyUser(request);
  if (!user) {
    return apiError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
  }
  return { user };
}
