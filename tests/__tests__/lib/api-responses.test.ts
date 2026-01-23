import {
  jsonSuccess,
  jsonError,
  jsonUnauthorized,
  jsonNotFound,
  jsonValidationError,
  formatZodErrors,
  HTTP_STATUS,
} from '@/lib/api';
import { z } from 'zod';

describe('API Response Helpers', () => {
  describe('HTTP_STATUS', () => {
    it('has correct status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.CONFLICT).toBe(409);
      expect(HTTP_STATUS.RATE_LIMIT).toBe(429);
      expect(HTTP_STATUS.INTERNAL_ERROR).toBe(500);
      expect(HTTP_STATUS.SERVICE_UNAVAILABLE).toBe(503);
    });
  });

  describe('jsonSuccess', () => {
    it('returns success response with data', async () => {
      const response = jsonSuccess({ user: 'test' });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user).toBe('test');
    });

    it('returns success response with message', async () => {
      const response = jsonSuccess({ id: 1 }, 'Created successfully');
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.message).toBe('Created successfully');
      expect(data.id).toBe(1);
    });

    it('returns success response with custom status', async () => {
      const response = jsonSuccess({ id: 1 }, undefined, HTTP_STATUS.CREATED);

      expect(response.status).toBe(201);
    });
  });

  describe('jsonError', () => {
    it('returns error response', async () => {
      const response = jsonError('Something went wrong', 'TEST_ERROR', 400);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Something went wrong');
      expect(data.code).toBe('TEST_ERROR');
    });

    it('uses default status 500', async () => {
      const response = jsonError('Server error', 'INTERNAL_ERROR');

      expect(response.status).toBe(500);
    });
  });

  describe('jsonUnauthorized', () => {
    it('returns 401 unauthorized response', async () => {
      const response = jsonUnauthorized();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.code).toBe('UNAUTHORIZED');
    });

    it('accepts custom message', async () => {
      const response = jsonUnauthorized('Session expired');
      const data = await response.json();

      expect(data.error).toBe('Session expired');
    });
  });

  describe('jsonNotFound', () => {
    it('returns 404 not found response', async () => {
      const response = jsonNotFound('Resource not found');
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Resource not found');
      expect(data.code).toBe('NOT_FOUND');
    });
  });

  describe('jsonValidationError', () => {
    it('returns 400 validation error response', async () => {
      const response = jsonValidationError('Invalid input', { field: 'email' });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid input');
      expect(data.code).toBe('VALIDATION_ERROR');
      expect(data.details).toEqual({ field: 'email' });
    });
  });

  describe('formatZodErrors', () => {
    it('formats Zod validation errors', () => {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
      });

      const result = schema.safeParse({
        email: 'invalid',
        password: '123',
      });

      if (!result.success) {
        const formatted = formatZodErrors(result.error);

        expect(formatted).toHaveProperty('email');
        expect(formatted).toHaveProperty('password');
      }
    });

    it('handles nested errors', () => {
      const schema = z.object({
        user: z.object({
          email: z.string().email(),
        }),
      });

      const result = schema.safeParse({
        user: { email: 'invalid' },
      });

      if (!result.success) {
        const formatted = formatZodErrors(result.error);
        expect(formatted).toBeDefined();
      }
    });
  });
});
