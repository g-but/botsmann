import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// MongoDB Schema
const ConsultationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Get or create model
const Consultation = mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);

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

    // Email notification will be implemented in the next step
    // For now, just log the consultation
    console.log('New consultation created:', consultation);

    return NextResponse.json({ success: true, data: consultation });
  } catch (error) {
    console.error('Consultation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 