/**
 * Route Constants & Utilities
 *
 * SSOT for route paths and route-related helper functions.
 * Import from here instead of hardcoding path strings.
 */

import type { Route } from 'next';

/**
 * Application route paths (SSOT)
 */
export const ROUTES = {
  HOME: '/',
  BOTS: '/bots',
  BLOG: '/blog',
  CONTACT: '/contact',
  DOCUMENTS: '/documents',
  PROJECTS: '/projects',
  SETTINGS: '/settings',
  SOLUTIONS: '/solutions',
  PROFESSIONALS: '/bots',
  MY_DATA: '/settings',
  ENTERPRISE: '/solutions',
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CALLBACK: '/auth/callback',
    VERIFY_EMAIL: '/auth/verify-email',
  },
} as const;

/**
 * Route patterns for matching
 */
export const ROUTE_PATTERNS = {
  /** Matches bot detail pages like /bots/legal-expert, /bots/research-assistant */
  BOT_DETAIL: /^\/bots\/[\w-]+$/,
} as const;

/**
 * Check if a pathname is a bot detail page
 * Bot detail pages are immersive experiences that hide the main header
 *
 * @param pathname - Current route pathname
 * @returns true if on a bot detail page (e.g., /bots/legal-expert)
 */
export const isBotDetailPage = (pathname: string | null): boolean => {
  if (!pathname) return false;
  return ROUTE_PATTERNS.BOT_DETAIL.test(pathname);
};

/**
 * Generate a bot detail page path
 *
 * @param slug - Bot slug identifier
 * @returns Full path to bot detail page (typed for Next.js Link)
 */
export const getBotPath = (slug: string): Route => {
  return `${ROUTES.BOTS}/${slug}` as Route;
};
