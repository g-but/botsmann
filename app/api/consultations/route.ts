import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { sendEmail } from '../../../src/lib/email';
import { MailchimpService } from '../../../src/lib/mailchimp';

// MongoDB Schema
const ConsultationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Get or create model
const Consultation = mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);

// Initialize Mailchimp service
const mailchimpService = new MailchimpService({
  apiKey: process.env.MAILCHIMP_API_KEY || '',
  serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || '',
  listId: process.env.MAILCHIMP_LIST_ID || ''
});

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    await mongoose.connect(process.env.MONGODB_URI);

    // Parse request body
    const body = await req.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create consultation
    const consultation = await Consultation.create({ name, email, message });

    // Add subscriber to Mailchimp
    try {
      await mailchimpService.addSubscriber(email, name);
    } catch (mailchimpError) {
      console.error('Failed to add subscriber to Mailchimp:', mailchimpError);
      // Continue execution even if Mailchimp fails
    }

    // Send email notification to admin
    try {
      await sendEmail({
        to: process.env.EMAIL_TO || 'butaeff@gmail.com',
        subject: 'New Consultation Request',
        text: `
Name: ${name}
Email: ${email}
Message: ${message}
        `.trim()
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue execution even if email fails
    }

    return NextResponse.json({ success: true, data: consultation });
  } catch (error) {
    console.error('Consultation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}     