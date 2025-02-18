import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/src/lib/mongodb';
import { rateLimit } from '@/src/lib/rate-limit';
import { CustomerSchema } from '@/src/lib/schemas/customer';
import { validateApiKey } from '@/src/lib/middleware/auth';
import { EmailService } from '@/src/lib/email/service';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

const limiter = rateLimit({
  limit: process.env.NODE_ENV === 'test' ? 3 : 5,
  interval: process.env.NODE_ENV === 'test' ? 1000 : 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const emailService = new EmailService();

const allowedOrigins = ['https://www.botsmann.com', 'https://botsmann.com', 'http://localhost:3000'];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Accept',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Accept',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };
  
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      // Validate API key
      const authResponse = await validateApiKey(req);
      if (authResponse) {
        return res.status(401).json(authResponse);
      }

      // Check rate limit
      const rateLimitKey = 'CONSULTATION_FORM';
      const { isRateLimited } = await limiter.check(rateLimitKey);
      if (isRateLimited) {
        return res.status(429).json({
          success: false,
          message: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT',
          timestamp: new Date().toISOString()
        });
      }

      // Validate request body
      const validatedData = CustomerSchema.parse(req.body);

      // Connect to DB (skipped in test environment)
      if (process.env.NODE_ENV !== 'test') {
        try {
          await connectDB();
        } catch (error) {
          console.error('Failed to connect to database:', error);
          return res.status(503).json({
            success: false,
            message: 'Database connection error',
            code: 'DB_ERROR',
            timestamp: new Date().toISOString()
          });
        }
      }

      // Create consultation model
      const ConsultationModel = mongoose.models.Consultation || mongoose.model('Consultation', new mongoose.Schema({
        name: String,
        email: String,
        message: String,
        preferences: {
          newsletter: Boolean,
          productUpdates: Boolean
        }
      }));
      
      const consultation = await ConsultationModel.create(validatedData);

      // Send emails asynchronously
      try {
        await Promise.all([
          emailService.sendWelcomeEmail(validatedData),
          emailService.sendAdminNotification(validatedData)
        ]);
      } catch (emailError) {
        console.error('Failed to send emails:', emailError);
      }

      return res.status(200).json({
        success: true,
        message: 'Form submitted successfully',
        id: consultation._id,
        code: 'SUCCESS',
        timestamp: new Date().toISOString()
      });
    } catch (error: unknown) {
      console.error('API Error:', error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors,
          timestamp: new Date().toISOString()
        });
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
      return res.status(500).json({
        success: false,
        message: errorMessage,
        code: 'ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
    code: 'METHOD_NOT_ALLOWED',
    timestamp: new Date().toISOString()
  });
}
