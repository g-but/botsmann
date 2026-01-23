/**
 * Error handling utilities
 * Provides type-safe error message extraction
 */

/**
 * Type guard to check if a value is an Error instance
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error
}

/**
 * Type guard to check if a value has a message property
 */
export function hasMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message: unknown }).message === 'string'
  )
}

/**
 * Type guard to check if a value has a code property
 */
export function hasCode(value: unknown): value is { code: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof (value as { code: unknown }).code === 'string'
  )
}

/**
 * Safely extracts an error message from an unknown error value
 * @param error - The caught error (unknown type)
 * @param fallback - Fallback message if extraction fails
 * @returns A string error message
 */
export function getErrorMessage(error: unknown, fallback = 'An unknown error occurred'): string {
  if (typeof error === 'string') {
    return error
  }
  if (isError(error)) {
    return error.message
  }
  if (hasMessage(error)) {
    return error.message
  }
  return fallback
}

/**
 * Safely extracts an error code from an unknown error value
 * @param error - The caught error (unknown type)
 * @returns The error code or undefined
 */
export function getErrorCode(error: unknown): string | undefined {
  if (hasCode(error)) {
    return error.code
  }
  return undefined
}
