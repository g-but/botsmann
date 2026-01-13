import {
  isValidEmail,
  isNotEmpty,
  hasMinLength,
  hasMaxLength,
  formatErrorMessage,
  EMAIL_REGEX,
} from '@/lib/validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('returns true for valid email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
      expect(isValidEmail('name+tag@email.org')).toBe(true);
    });

    it('returns false for invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
      expect(isValidEmail('spaces in@email.com')).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('returns true for non-empty strings', () => {
      expect(isNotEmpty('hello')).toBe(true);
      expect(isNotEmpty('  text  ')).toBe(true);
      expect(isNotEmpty('a')).toBe(true);
    });

    it('returns false for empty or whitespace-only strings', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
      expect(isNotEmpty('\t\n')).toBe(false);
    });
  });

  describe('hasMinLength', () => {
    it('returns true when string meets minimum length', () => {
      expect(hasMinLength('hello', 5)).toBe(true);
      expect(hasMinLength('hello world', 5)).toBe(true);
      expect(hasMinLength('  hi  ', 2)).toBe(true);
    });

    it('returns false when string is too short', () => {
      expect(hasMinLength('hi', 5)).toBe(false);
      expect(hasMinLength('', 1)).toBe(false);
      expect(hasMinLength('   ', 1)).toBe(false);
    });
  });

  describe('hasMaxLength', () => {
    it('returns true when string is within max length', () => {
      expect(hasMaxLength('hello', 10)).toBe(true);
      expect(hasMaxLength('hello', 5)).toBe(true);
      expect(hasMaxLength('', 5)).toBe(true);
    });

    it('returns false when string exceeds max length', () => {
      expect(hasMaxLength('hello world', 5)).toBe(false);
      expect(hasMaxLength('toolong', 3)).toBe(false);
    });
  });

  describe('formatErrorMessage', () => {
    it('returns string errors as-is', () => {
      expect(formatErrorMessage('Something went wrong')).toBe('Something went wrong');
    });

    it('extracts message from Error objects', () => {
      const error = new Error('Test error message');
      expect(formatErrorMessage(error)).toBe('Test error message');
    });

    it('returns default message for unknown error types', () => {
      expect(formatErrorMessage(null)).toBe('An unknown error occurred');
      expect(formatErrorMessage(undefined)).toBe('An unknown error occurred');
      expect(formatErrorMessage(123)).toBe('An unknown error occurred');
      expect(formatErrorMessage({})).toBe('An unknown error occurred');
    });
  });

  describe('EMAIL_REGEX', () => {
    it('exports a valid regex pattern', () => {
      expect(EMAIL_REGEX).toBeInstanceOf(RegExp);
      expect(EMAIL_REGEX.test('test@example.com')).toBe(true);
    });
  });
});
