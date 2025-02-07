import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Consultation } from '@/models/Consultation';
import { transporter } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const consultation = new Consultation({ name, email, message });
    await consultation.save();

    // Send customer email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thanks for contacting Botsmann',
      html: `
        <h1>Thank you for reaching out!</h1>
        <p>Hello ${name},</p>
        <p>We've received your message and will get back to you shortly.</p>
        <p>Best regards,<br>Botsmann Team</p>
      `
    });

    // Send admin email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: 'New Botsmann Consultation Request',
      html: `
        <h2>New consultation request received:</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    return NextResponse.json(
      { success: true, message: 'Email submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
