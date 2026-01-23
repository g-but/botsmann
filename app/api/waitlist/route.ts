import { type NextRequest } from 'next/server';
import { z } from 'zod';
import {
  jsonMessage,
  validateBody,
  hasValidationError,
  handleError,
} from '@/lib/api';
import { DOMAIN_ERRORS } from '@/lib/constants';
import { WaitlistModel } from '@/lib/models/waitlist';

const WaitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  preferences: z.object({
    events: z.boolean().optional(),
    newsletters: z.boolean().optional(),
    blog: z.boolean().optional(),
    videos: z.boolean().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Validate input
    const validation = await validateBody(req, WaitlistSchema);
    if (hasValidationError(validation)) {
      return validation.error;
    }

    const { email, preferences } = validation.data;

    // Check if email already exists
    const existing = await WaitlistModel.findByEmail(email);
    if (existing) {
      return jsonMessage('Email already registered for waitlist');
    }

    // Create entry in Supabase
    await WaitlistModel.create({
      email,
      preferences: {
        events: Boolean(preferences?.events),
        newsletters: Boolean(preferences?.newsletters),
        blog: Boolean(preferences?.blog),
        videos: Boolean(preferences?.videos),
      },
    });

    return jsonMessage('Successfully added to waitlist');
  } catch (error) {
    return handleError(error, DOMAIN_ERRORS.FAILED_SUBMIT_WAITLIST);
  }
}
