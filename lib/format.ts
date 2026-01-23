/**
 * Shared formatting utilities
 * @module lib/format
 *
 * Centralized formatting functions for use across the application.
 * Follow DRY principle - import from here instead of duplicating.
 */

/**
 * Format a number as currency (defaults to CHF for Swiss context)
 * @param amount The number to format
 * @param options Optional formatting options
 * @returns Formatted currency string
 * @example
 * formatCurrency(1234567) // "CHF 1'234'567"
 * formatCurrency(1234567, { compact: true }) // "CHF 1.2M"
 * formatCurrency(1234567, { currency: 'USD' }) // "$1,234,567"
 */
export const formatCurrency = (
  amount: number,
  options?: { compact?: boolean; decimals?: number; currency?: string },
): string => {
  const { compact = false, decimals = 0, currency = 'CHF' } = options ?? {};
  const locale = currency === 'CHF' ? 'de-CH' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: decimals,
    ...(compact && { notation: 'compact' }),
  }).format(amount);
};

/**
 * Format a number with locale-specific separators
 * @param value The number to format
 * @param options Optional formatting options
 * @returns Formatted number string
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234567, { compact: true }) // "1.2M"
 */
export const formatNumber = (
  value: number,
  options?: { compact?: boolean; decimals?: number },
): string => {
  const { compact = false, decimals = 0 } = options ?? {};

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    ...(compact && { notation: 'compact' }),
  }).format(value);
};

/**
 * Format a date string for display
 * @param date Date string, timestamp, or Date object
 * @param options Formatting options
 * @returns Formatted date string
 * @example
 * formatDate('2024-01-15') // "January 15, 2024"
 * formatDate('2024-01-15', { style: 'short' }) // "1/15/24"
 */
export const formatDate = (
  date: string | number | Date,
  options?: {
    style?: 'full' | 'long' | 'medium' | 'short';
    includeTime?: boolean;
  },
): string => {
  const { style = 'long', includeTime = false } = options ?? {};

  const dateObj = date instanceof Date ? date : new Date(date);

  const dateOptions: Intl.DateTimeFormatOptions = {
    dateStyle: style,
    ...(includeTime && { timeStyle: 'short' }),
  };

  return dateObj.toLocaleDateString('en-US', dateOptions);
};

/**
 * Format a date to ISO string (for timestamps)
 * @param date Optional date (defaults to now)
 * @returns ISO date string
 */
export const toISOString = (date?: Date): string => {
  return (date ?? new Date()).toISOString();
};

/**
 * Format a percentage value
 * @param value The decimal value (0.5 = 50%)
 * @param options Optional formatting options
 * @returns Formatted percentage string
 * @example
 * formatPercent(0.856) // "86%"
 * formatPercent(0.856, { decimals: 1 }) // "85.6%"
 */
export const formatPercent = (value: number, options?: { decimals?: number }): string => {
  const { decimals = 0 } = options ?? {};

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: decimals,
  }).format(value);
};
