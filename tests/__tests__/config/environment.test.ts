import { loadEnvConfig } from '@next/env';
import mongoose from 'mongoose';
import { sendEmail } from '../../../src/lib/email';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('MongoDB Configuration', () => {
    it('has valid MongoDB URI', () => {
      expect(process.env.MONGODB_URI).toBeDefined();
      expect(process.env.MONGODB_URI).toMatch(/^mongodb(\+srv)?:\/\//);
    });

    it('can connect to MongoDB with provided URI', async () => {
      const connectSpy = jest.spyOn(mongoose, 'connect');
      try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        expect(connectSpy).toHaveBeenCalledWith(process.env.MONGODB_URI);
      } catch (error) {
        fail('MongoDB connection failed: ' + error);
      } finally {
        await mongoose.disconnect();
      }
    });

    it('fails gracefully when MongoDB URI is missing', async () => {
      delete process.env.MONGODB_URI;
      await expect(
        mongoose.connect('')
      ).rejects.toThrow();
    });
  });

  describe('Email Configuration', () => {
    it('has valid email credentials', () => {
      expect(process.env.EMAIL_USER).toBeDefined();
      expect(process.env.EMAIL_PASS).toBeDefined();
      expect(process.env.EMAIL_USER).toMatch(/@gmail\.com$/);
    });

    it('fails gracefully when email credentials are missing', async () => {
      delete process.env.EMAIL_USER;
      delete process.env.EMAIL_PASS;

      await expect(
        sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          text: 'Test message',
        })
      ).rejects.toThrow('Email credentials not configured');
    });
  });

  describe('Next.js Configuration', () => {
    it('loads environment variables correctly', async () => {
      const { loadedEnvFiles } = await loadEnvConfig(process.cwd());
      expect(loadedEnvFiles).toHaveLength(1); // Expecting .env file to be loaded
    });

    it('has required environment variables for production', () => {
      const requiredVars = [
        'MONGODB_URI',
        'EMAIL_USER',
        'EMAIL_PASS',
      ];

      requiredVars.forEach(varName => {
        expect(process.env[varName]).toBeDefined();
        expect(process.env[varName]).not.toBe('');
      });
    });
  });
});
