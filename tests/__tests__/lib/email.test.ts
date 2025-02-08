import { sendEmail } from '../../../src/lib/email';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));

describe('Email Service', () => {
  const mockTransporter = {
    sendMail: jest.fn(),
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
  });

  it('creates transporter with correct config', async () => {
    await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test message',
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  });

  it('sends email with correct parameters', async () => {
    const emailParams = {
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test message',
    };

    await sendEmail(emailParams);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: emailParams.to,
      subject: emailParams.subject,
      text: emailParams.text,
    });
  });

  it('throws error when email sending fails', async () => {
    const error = new Error('Failed to send email');
    mockTransporter.sendMail.mockRejectedValueOnce(error);

    await expect(sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test message',
    })).rejects.toThrow('Failed to send email');
  });

  it('throws error when email credentials are missing', async () => {
    const originalEmailUser = process.env.EMAIL_USER;
    const originalEmailPass = process.env.EMAIL_PASS;
    
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;

    await expect(sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test message',
    })).rejects.toThrow('Email credentials not configured');

    // Restore environment variables
    process.env.EMAIL_USER = originalEmailUser;
    process.env.EMAIL_PASS = originalEmailPass;
  });
});
