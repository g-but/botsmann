import type { NextRequest } from 'next/server';

// Extract a best-effort client IP for rate limiting and logging
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  try {
    const url = new URL(req.url);
    return url.hostname || 'unknown';
  } catch {
    return 'unknown';
  }
}
