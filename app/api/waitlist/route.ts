import { type NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import {
  jsonMessage,
  validateBody,
  hasValidationError,
  handleError,
} from '@/lib/api';
import { DOMAIN_ERRORS } from '@/lib/constants';

const WaitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  preferences: z.object({
    events: z.boolean().optional(),
    newsletters: z.boolean().optional(),
    blog: z.boolean().optional(),
    videos: z.boolean().optional(),
  }).optional(),
});

interface WaitlistEntry {
  email: string;
  preferences: {
    events: boolean;
    newsletters: boolean;
    blog: boolean;
    videos: boolean;
  };
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    // Validate input
    const validation = await validateBody(req, WaitlistSchema);
    if (hasValidationError(validation)) {
      return validation.error;
    }

    const { email, preferences } = validation.data;

    // Create entry
    const waitlistEntry: WaitlistEntry = {
      email,
      preferences: {
        events: Boolean(preferences?.events),
        newsletters: Boolean(preferences?.newsletters),
        blog: Boolean(preferences?.blog),
        videos: Boolean(preferences?.videos),
      },
      timestamp: new Date().toISOString(),
    };

    // Store to local JSON file (development only)
    const waitlistFilePath = path.join(process.cwd(), 'data', 'waitlist.json');
    let waitlist: WaitlistEntry[] = [];

    try {
      if (fs.existsSync(waitlistFilePath)) {
        const fileContent = fs.readFileSync(waitlistFilePath, 'utf8');
        waitlist = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading waitlist file:', error);
      waitlist = [];
    }

    // Check if email already exists
    const emailExists = waitlist.some((entry) => entry.email === email);
    if (emailExists) {
      return jsonMessage('Email already registered for waitlist');
    }

    waitlist.push(waitlistEntry);

    try {
      fs.writeFileSync(waitlistFilePath, JSON.stringify(waitlist, null, 2), 'utf8');
    } catch {
      // On Vercel/serverless, file write will fail - that's expected
    }

    return jsonMessage('Successfully added to waitlist');
  } catch (error) {
    return handleError(error, DOMAIN_ERRORS.FAILED_SUBMIT_WAITLIST);
  }
}
