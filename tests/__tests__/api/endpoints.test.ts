import { NextRequest } from 'next/server';
import handler from '@/netlify/functions/api/[[path]]';
import { mockConsultation } from '../../mocks/mongodb';

const createRequest = (options: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
}): NextRequest => {
  const url = new URL(`http://localhost${options.url}`);
  const init = {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  } as const;
  
  if (options.body) {
    return new NextRequest(url, {
      ...init,
      body: JSON.stringify(options.body)
    });
  }
  
  return new NextRequest(url, init);
};

describe('API Endpoints', () => {
  beforeAll(() => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    it('returns healthy status', async () => {
      const req = createRequest({
        method: 'GET',
        url: '/api/health'
      });

      const response = await handler(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toBeDefined();
    });
  });

  describe('Consultation Submission', () => {
    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    };

    it('handles valid submission', async () => {
      const req = createRequest({
        method: 'POST',
        url: '/api/consultations',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY!
        },
        body: validData
      });

      const response = await handler(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.id).toBeDefined();
    });

    it('validates API key', async () => {
      const req = createRequest({
        method: 'POST',
        url: '/api/consultations',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'invalid-key'
        },
        body: validData
      });

      const response = await handler(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid API key');
    });

    it('validates required fields', async () => {
      const req = createRequest({
        method: 'POST',
        url: '/api/consultations',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY!
        },
        body: {}
      });

      const response = await handler(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('enforces rate limiting', async () => {
      const makeRequest = () => handler(createRequest({
        method: 'POST',
        url: '/api/consultations',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY!
        },
        body: validData
      }));

      // Reset rate limiter state
      jest.isolateModules(() => {
        jest.resetModules();
        const rateLimiter = require('@/src/lib/rate-limit');
        rateLimiter.rateLimit({
          limit: 3,
          interval: 1000,
          uniqueTokenPerInterval: 500
        });
      });

      // Send first 3 requests (should succeed)
      for (let i = 0; i < 3; i++) {
        const response = await makeRequest();
        expect(response.status).toBe(200);
      }

      // Send 4th request (should be rate limited)
      const lastResponse = await makeRequest();
      const data = await lastResponse.json();

      expect(lastResponse.status).toBe(429);
      expect(data.error).toContain('Rate limit exceeded');
    });
  });

  describe('404 Handling', () => {
    it('returns 404 for unknown endpoints', async () => {
      const req = createRequest({
        method: 'GET',
        url: '/api/unknown'
      });

      const response = await handler(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Not Found');
    });
  });
});
