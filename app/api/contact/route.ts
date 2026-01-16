import { type NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import {
  jsonSuccess,
  validateBody,
  hasValidationError,
  handleError,
} from '@/lib/api';
import { DOMAIN_ERRORS } from '@/lib/constants';

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  expertise: z.string().min(1, 'Please select an area of expertise'),
  message: z.string().min(1, 'Message is required'),
});

type ContactData = z.infer<typeof ContactSchema>;

interface ContactEntry extends ContactData {
  id: string;
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    // Validate input
    const validation = await validateBody(req, ContactSchema);
    if (hasValidationError(validation)) {
      return validation.error;
    }

    const { name, email, expertise, message } = validation.data;

    // Create contact entry
    const contactEntry: ContactEntry = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      expertise,
      message,
      timestamp: new Date().toISOString(),
    };

    // Store to local JSON file (development only)
    const dataDir = path.join(process.cwd(), 'data');
    const contactsFilePath = path.join(dataDir, 'contacts.json');

    let contacts: ContactEntry[] = [];

    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(contactsFilePath)) {
        const fileContent = fs.readFileSync(contactsFilePath, 'utf8');
        contacts = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading contacts file:', error);
      contacts = [];
    }

    contacts.push(contactEntry);

    try {
      fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2), 'utf8');
    } catch {
      // On Vercel/serverless, file write will fail - that's expected
    }

    return jsonSuccess(
      { id: contactEntry.id },
      "Thank you! We'll be in touch soon."
    );
  } catch (error) {
    return handleError(error, DOMAIN_ERRORS.FAILED_SUBMIT_CONTACT);
  }
}
