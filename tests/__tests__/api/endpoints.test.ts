import { NextRequest } from 'next/server';
import handler from '@/netlify/functions/api/[[path]]';
import { connectDB } from '@/src/lib/mongodb';
import { Consultation } from '@/src/lib/models/consultation';

describe('API Endpoints', () => {
  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await Consultation.deleteMany({});
  });

  describe('Health Check', () => {
    it('returns healthy status', async () => {
      const req = new NextRequest('http://localhost/api/health', {
        method: 'GET'
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
      const req = new NextRequest('http://localhost/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY!
        },
        body: JSON.stringify(validData)
      });

      const response = await handler(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.id).toBeDefined();
    });

    it('validates API key', async () => {
      const req = new NextRequest('http://localhost/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'invalid-key'
        },
        body: JSON.stringify(validData)
      });

      const response = await handler(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid API key');
    });

    it('validates required fields', async () => {
      const req = new NextRequest('http://localhost/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY!
        },
        body: JSON.stringify({})
      });

      const response = await handler(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('enforces rate limiting', async () => {
      const requests = Array(6).fill(null).map(() => 
        handler(new NextRequest('http://localhost/api/consultations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.API_KEY!
          },
          body: JSON.stringify(validData)
        }))
      );

      const responses = await Promise.all(requests);
      const lastResponse = responses[responses.length - 1];
      const data = await lastResponse.json();

      expect(lastResponse.status).toBe(429);
      expect(data.error).toContain('Rate limit exceeded');
    });
  });

  describe('404 Handling', () => {
    it('returns 404 for unknown endpoints', async () => {
      const req = new NextRequest('http://localhost/api/unknown', {
        method: 'GET'
      });

      const response = await handler(req);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Not Found');
    });
  });
});
