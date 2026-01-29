/**
 * Auth CTA Configuration - SSOT
 * @module lib/config/auth-cta
 *
 * Single source of truth for auth-related call-to-action content.
 * Used in chat interfaces to encourage guest users to register.
 */

import type { Route } from 'next';
import { ROUTES } from '@/lib/routes';

/**
 * CTA configuration for different auth states
 */
export interface AuthCTAContent {
  headline: string;
  benefits: string[];
  primaryAction: {
    label: string;
    href: Route;
  };
  secondaryAction?: {
    label: string;
    href: Route;
  };
}

export const AUTH_CTA_CONFIG: Record<'guest' | 'authenticated', AuthCTAContent> = {
  guest: {
    headline: 'Get personalized answers',
    benefits: [
      'Save conversation history',
      'Add your context for better responses',
      'Access all AI professionals',
      'Upload documents for analysis',
    ],
    primaryAction: {
      label: 'Create Free Account',
      href: ROUTES.AUTH.SIGNUP as Route,
    },
    secondaryAction: {
      label: 'Sign In',
      href: ROUTES.AUTH.SIGNIN as Route,
    },
  },
  authenticated: {
    headline: 'Enhance your experience',
    benefits: [
      'Add context to your profile',
      'Upload documents for deeper insights',
      'Switch AI models anytime',
    ],
    primaryAction: {
      label: 'Add Context',
      href: '/dashboard/profile' as Route,
    },
  },
} as const;

/**
 * Get CTA content based on auth state
 */
export function getAuthCTAContent(isAuthenticated: boolean): AuthCTAContent {
  return isAuthenticated ? AUTH_CTA_CONFIG.authenticated : AUTH_CTA_CONFIG.guest;
}

/**
 * LocalStorage key for dismissing the CTA
 */
export const AUTH_CTA_DISMISSED_KEY = 'botsmann:auth-cta-dismissed';
