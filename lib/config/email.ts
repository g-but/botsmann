/**
 * Email Configuration
 *
 * Centralized configuration for all email-related settings.
 * Uses environment variables with sensible defaults for development.
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Get required environment variable or throw in production
 */
const getRequiredEnv = (key: string, devDefault: string): string => {
  const value = process.env[key];
  if (value) return value;

  if (isDevelopment) {
    return devDefault;
  }

  throw new Error(`Missing required environment variable: ${key}`);
};

/**
 * AWS SES Configuration
 */
export const AWS_CONFIG = {
  region: process.env.NEXT_AWS_REGION || 'eu-central-1', // Frankfurt for Swiss compliance
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || '',
  },
} as const;

/**
 * Email Addresses
 */
export const EMAIL_ADDRESSES = {
  /** Email address used as the sender for outgoing emails */
  from: getRequiredEnv('FROM_EMAIL', 'noreply@botsmann.com'),

  /** Email address for admin notifications */
  admin: getRequiredEnv('ADMIN_EMAIL', 'admin@botsmann.com'),

  /** Email address for customer support */
  support: getRequiredEnv('SUPPORT_EMAIL', 'support@botsmann.com'),
} as const;

/**
 * Email Subjects
 */
export const EMAIL_SUBJECTS = {
  welcome: 'Welcome to Botsmann!',
  newCustomer: 'New Customer Registration',
  waitlistConfirmation: 'You\'re on the Waitlist!',
  consultationConfirmation: 'Consultation Booking Confirmed',
} as const;

/**
 * Email URLs
 */
export const EMAIL_URLS = {
  dashboard: process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    : 'https://botsmann.com/dashboard',
  unsubscribe: process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe`
    : 'https://botsmann.com/unsubscribe',
} as const;

export type EmailConfig = {
  aws: typeof AWS_CONFIG;
  addresses: typeof EMAIL_ADDRESSES;
  subjects: typeof EMAIL_SUBJECTS;
  urls: typeof EMAIL_URLS;
};

export const emailConfig: EmailConfig = {
  aws: AWS_CONFIG,
  addresses: EMAIL_ADDRESSES,
  subjects: EMAIL_SUBJECTS,
  urls: EMAIL_URLS,
};
