/**
 * API Utilities Module
 * @module lib/api
 *
 * Centralized exports for API-related utilities.
 */

export {
  // Response creators
  jsonSuccess,
  jsonMessage,
  jsonError,
  jsonValidationError,
  jsonRateLimitError,
  jsonUnauthorized,
  jsonNotFound,
  jsonServiceUnavailable,
  // Validation helpers
  validateBody,
  hasValidationError,
  formatZodErrors,
  handleError,
  // Constants
  HTTP_STATUS,
  // Types
  type ApiResponse,
  type ErrorCode,
  type ValidationError,
} from './responses';
