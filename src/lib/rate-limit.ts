import { LRUCache } from 'lru-cache';

export interface RateLimitConfig {
  interval: number;
  uniqueTokenPerInterval: number;
  limit: number;
}

export function rateLimit(config: RateLimitConfig) {
  const cache = new Map<string, { count: number; timestamp: number }>();
  const interval = config.interval || 60000;
  const limit = config.limit || 5;

  return {
    check: (token: string | null) => {
      const now = Date.now();
      const tokenKey = token || 'anonymous';
      const record = cache.get(tokenKey);

      if (!record || now - record.timestamp >= interval) {
        cache.set(tokenKey, { count: 1, timestamp: now });
        return { isRateLimited: false, remaining: limit - 1 };
      }

      const newCount = record.count + 1;
      cache.set(tokenKey, { count: newCount, timestamp: record.timestamp });
      const isRateLimited = newCount > limit;

      return { 
        isRateLimited, 
        remaining: Math.max(0, limit - newCount) 
      };
    },
    reset: () => {
      cache.clear();
    },
  };
}
