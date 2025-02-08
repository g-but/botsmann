import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { NextRequest } from 'next/server';
import { POST } from '../../../app/api/consultations/route';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  Schema: jest.fn().mockReturnValue({
    pre: jest.fn().mockReturnThis(),
  }),
  model: jest.fn(),
  models: {
    Consultation: null,
  },
  disconnect: jest.fn(),
}));

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));

describe('Form Submission Flow', () => {
  const mockConsultation = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test consultation message',
    createdAt: new Date(),
  };

  const mockTransporter = {
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
    (mongoose.model as jest.Mock).mockReturnValueOnce({
      create: jest.fn().mockResolvedValue(mockConsultation),
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('successfully processes form submission and sends email', async () => {
    const request = new NextRequest('http://localhost:3000/api/consultations', {
      method: 'POST',
      body: JSON.stringify({
        name: mockConsultation.name,
        email: mockConsultation.email,
        message: mockConsultation.message,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    // Verify successful response
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockConsultation);

    // Verify MongoDB connection and creation
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(mongoose.model).toHaveBeenCalled();

    // Verify email sending
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    expect(mockTransporter.sendMail).toHaveBeenCalled();
  });

  it('handles database connection failure gracefully', async () => {
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

    const request = new NextRequest('http://localhost:3000/api/consultations', {
      method: 'POST',
      body: JSON.stringify({
        name: mockConsultation.name,
        email: mockConsultation.email,
        message: mockConsultation.message,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
    expect(mockTransporter.sendMail).not.toHaveBeenCalled();
  });

  it('handles email sending failure gracefully', async () => {
    mockTransporter.sendMail.mockRejectedValueOnce(new Error('Email sending failed'));

    const request = new NextRequest('http://localhost:3000/api/consultations', {
      method: 'POST',
      body: JSON.stringify({
        name: mockConsultation.name,
        email: mockConsultation.email,
        message: mockConsultation.message,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    // Should still save to database but indicate email failure
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.emailSent).toBe(false);
  });
});
