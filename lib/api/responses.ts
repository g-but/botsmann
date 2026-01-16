/**
 * Centralized API Response Utilities
 * @module lib/api/responses
 *
 * SSOT for API response patterns across all routes.
 * Consolidates response creation, error handling, and Zod validation.
 */

import { NextResponse } from 'next/server';
import { ZodError, type ZodSchema } from 'zod';

/**
 * Standard API response shape
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: ErrorCode;
  details?: ValidationError[];
}

/**
 * Error codes for categorizing API errors
 */
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'DUPLICATE_SLUG'
  | 'RATE_LIMIT'
  | 'DATABASE_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_ERROR';

/**
 * Validation error detail
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * HTTP Status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMIT: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

/**
 * Create a successful JSON response
 */
export function jsonSuccess<T>(
  data: T,
  message?: string,
  status: HttpStatusCode = HTTP_STATUS.OK
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = { success: true, data };
  if (message) response.message = message;
  return NextResponse.json(response, { status });
}

/**
 * Create a success response with just a message (no data)
 */
export function jsonMessage(
  message: string,
  status = HTTP_STATUS.OK
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: true, message }, { status });
}

/**
 * Create an error JSON response
 */
export function jsonError(
  error: string,
  code: ErrorCode = 'INTERNAL_ERROR',
  status: HttpStatusCode = HTTP_STATUS.INTERNAL_ERROR,
  details?: ValidationError[]
): NextResponse<ApiResponse> {
  const response: ApiResponse = { success: false, error, code };
  if (details?.length) response.details = details;
  return NextResponse.json(response, { status });
}

/**
 * Create a validation error response
 */
export function jsonValidationError(
  message: string,
  details: ValidationError[]
): NextResponse<ApiResponse> {
  return jsonError(message, 'VALIDATION_ERROR', HTTP_STATUS.BAD_REQUEST, details);
}

/**
 * Create a rate limit error response
 */
export function jsonRateLimitError(
  message = 'Rate limit exceeded. Please try again later.'
): NextResponse<ApiResponse> {
  return jsonError(message, 'RATE_LIMIT', HTTP_STATUS.RATE_LIMIT);
}

/**
 * Create an unauthorized error response
 */
export function jsonUnauthorized(
  message = 'Unauthorized'
): NextResponse<ApiResponse> {
  return jsonError(message, 'UNAUTHORIZED', HTTP_STATUS.UNAUTHORIZED);
}

/**
 * Create a not found error response
 */
export function jsonNotFound(
  message = 'Not found'
): NextResponse<ApiResponse> {
  return jsonError(message, 'NOT_FOUND', HTTP_STATUS.NOT_FOUND);
}

/**
 * Create a service unavailable error response
 */
export function jsonServiceUnavailable(
  message = 'Service temporarily unavailable'
): NextResponse<ApiResponse> {
  return jsonError(message, 'SERVICE_UNAVAILABLE', HTTP_STATUS.SERVICE_UNAVAILABLE);
}

/**
 * Convert ZodError to ValidationError array
 */
export function formatZodErrors(error: ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

/**
 * Validate request body with Zod schema
 * Returns validated data or throws formatted validation error
 */
export async function validateBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<{ data: T } | { error: NextResponse<ApiResponse> }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        error: jsonValidationError('Validation failed', formatZodErrors(result.error)),
      };
    }

    return { data: result.data };
  } catch {
    return {
      error: jsonError('Invalid JSON body', 'VALIDATION_ERROR', HTTP_STATUS.BAD_REQUEST),
    };
  }
}

/**
 * Type guard to check if validation result has error
 */
export function hasValidationError<T>(
  result: { data: T } | { error: NextResponse<ApiResponse> }
): result is { error: NextResponse<ApiResponse> } {
  return 'error' in result;
}

/**
 * Handle caught errors and return appropriate response
 */
export function handleError(error: unknown, fallbackMessage: string): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return jsonValidationError('Validation failed', formatZodErrors(error));
  }

  const errorWithCode = error as { code?: string };
  if (errorWithCode.code === 'RATE_LIMIT') {
    return jsonRateLimitError();
  }

  return jsonError(fallbackMessage, 'INTERNAL_ERROR', HTTP_STATUS.INTERNAL_ERROR);
}
