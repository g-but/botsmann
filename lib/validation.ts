/**
 * Shared validation utilities
 * @module lib/validation
 *
 * Centralized validation functions for use across the application.
 * Follow DRY principle - import from here instead of duplicating.
 */

/**
 * Email validation regex pattern
 * Validates basic email format: local@domain.tld
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address format
 * @param email The email address to validate
 * @returns Boolean indicating if the email is valid
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid-email') // false
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validates a text input is not empty (after trimming whitespace)
 * @param text The text to validate
 * @returns Boolean indicating if the text is not empty
 */
export const isNotEmpty = (text: string): boolean => {
  return text.trim().length > 0;
};

/**
 * Validates a string meets minimum length requirement
 * @param text The text to validate
 * @param minLength Minimum length required
 * @returns Boolean indicating if the text meets the minimum length
 */
export const hasMinLength = (text: string, minLength: number): boolean => {
  return text.trim().length >= minLength;
};

/**
 * Validates a string does not exceed maximum length
 * @param text The text to validate
 * @param maxLength Maximum length allowed
 * @returns Boolean indicating if the text is within the max length
 */
export const hasMaxLength = (text: string, maxLength: number): boolean => {
  return text.length <= maxLength;
};

/**
 * Format error message for display
 * @param error Error message or object
 * @returns Formatted error message string
 */
export const formatErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};
