import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// Validation schema
const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  expertise: z.string().min(1, 'Please select an area of expertise'),
  message: z.string().min(1, 'Message is required'),
});

interface ContactEntry {
  id: string;
  name: string;
  email: string;
  expertise: string;
  message: string;
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const result = ContactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: result.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    const { name, email, expertise, message } = result.data;

    // Create contact entry
    const contactEntry: ContactEntry = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      expertise,
      message,
      timestamp: new Date().toISOString(),
    };

    // Store to local JSON file
    // NOTE: This works for local development only.
    // For production, connect to Supabase or another database.
    const dataDir = path.join(process.cwd(), 'data');
    const contactsFilePath = path.join(dataDir, 'contacts.json');

    let contacts: ContactEntry[] = [];

    try {
      // Ensure data directory exists
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Read existing file if it exists
      if (fs.existsSync(contactsFilePath)) {
        const fileContent = fs.readFileSync(contactsFilePath, 'utf8');
        contacts = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading contacts file:', error);
      contacts = [];
    }

    // Add new entry
    contacts.push(contactEntry);

    // Write back to file
    try {
      fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf8');
    } catch {
      // On Vercel/serverless, file write will fail - that's expected
      // Contact is still logged in memory for this request
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! We\'ll be in touch soon.',
        id: contactEntry.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact submission:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process submission. Please try again.'
      },
      { status: 500 }
    );
  }
}
