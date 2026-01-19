/**
 * Rate Limiting Middleware
 *
 * Provides rate limiting for API routes to prevent abuse.
 *
 * NOTE: This uses in-memory storage which works for development but has
 * limitations in serverless environments (each function instance has its own memory).
 *
 * For production, consider using:
 * - Upstash Redis (@upstash/ratelimit) for distributed rate limiting
 * - Vercel KV for edge-compatible storage
 * - Your database with a rate_limits table
 *
 * @example
 * ```ts
 * // In an API route
 * import { rateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit';
 *
 * export async function POST(req: NextRequest) {
 *   const rateLimitResult = await rateLimit(req, RATE_LIMIT_CONFIGS.auth);
 *   if (rateLimitResult) return rateLimitResult; // Rate limited
 *
 *   // Continue with route logic...
 * }
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in seconds */
  windowSizeSeconds: number;
  /** Identifier for this rate limit (for logging) */
  name: string;
}

/**
 * Rate limit entry stored in memory
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory store for rate limits
 * Key: identifier (IP + route), Value: rate limit entry
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries periodically (every 60 seconds)
 */
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60000; // 1 minute

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  rateLimitStore.forEach((entry, key) => {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
}

/**
 * Pre-configured rate limit settings for different use cases
 */
export const RATE_LIMIT_CONFIGS = {
  /** Auth routes: 5 requests per minute (strict for security) */
  auth: {
    maxRequests: 5,
    windowSizeSeconds: 60,
    name: 'auth',
  },
  /** Password reset: 3 requests per 5 minutes (very strict) */
  passwordReset: {
    maxRequests: 3,
    windowSizeSeconds: 300,
    name: 'password-reset',
  },
  /** Email resend: 2 requests per 2 minutes */
  emailResend: {
    maxRequests: 2,
    windowSizeSeconds: 120,
    name: 'email-resend',
  },
  /** API routes: 60 requests per minute */
  api: {
    maxRequests: 60,
    windowSizeSeconds: 60,
    name: 'api',
  },
  /** Strict API: 10 requests per minute (for expensive operations) */
  apiStrict: {
    maxRequests: 10,
    windowSizeSeconds: 60,
    name: 'api-strict',
  },
} as const;

/**
 * Get client identifier from request
 * Uses IP address and route for unique identification
 */
function getClientIdentifier(req: NextRequest, configName: string): string {
  // Try to get real IP from various headers (for proxied requests)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip'); // Cloudflare

  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0]?.trim() || 'unknown';

  // Include the config name to have separate limits per route type
  return `${ip}:${configName}`;
}

/**
 * Rate limit response headers
 */
function getRateLimitHeaders(
  remaining: number,
  limit: number,
  resetTime: number,
): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
    'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
  };
}

/**
 * Check rate limit and return response if limited
 *
 * @param req - Next.js request
 * @param config - Rate limit configuration
 * @returns NextResponse if rate limited, null if allowed
 */
export async function rateLimit(
  req: NextRequest,
  config: RateLimitConfig,
): Promise<NextResponse | null> {
  // Cleanup expired entries periodically
  cleanupExpiredEntries();

  const identifier = getClientIdentifier(req, config.name);
  const now = Date.now();
  const windowMs = config.windowSizeSeconds * 1000;

  // Get or create rate limit entry
  let entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, entry);

    // Not rate limited
    return null;
  }

  // Increment count
  entry.count++;

  // Check if rate limited
  if (entry.count > config.maxRequests) {
    const headers = getRateLimitHeaders(0, config.maxRequests, entry.resetTime);

    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests',
        code: 'RATE_LIMITED',
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      },
      {
        status: 429,
        headers,
      },
    );
  }

  // Not rate limited, but close to limit
  return null;
}

/**
 * Create a rate limiter with custom configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (req: NextRequest) => rateLimit(req, config);
}

/**
 * Higher-order function to wrap an API handler with rate limiting
 *
 * @example
 * ```ts
 * export const POST = withRateLimit(
 *   RATE_LIMIT_CONFIGS.auth,
 *   async (req) => {
 *     // Handler logic
 *     return NextResponse.json({ success: true });
 *   }
 * );
 * ```
 */
export function withRateLimit<T>(
  config: RateLimitConfig,
  handler: (req: NextRequest) => Promise<NextResponse<T>>,
) {
  return async (req: NextRequest): Promise<NextResponse<T> | NextResponse> => {
    const rateLimitResult = await rateLimit(req, config);
    if (rateLimitResult) {
      return rateLimitResult;
    }
    return handler(req);
  };
}
