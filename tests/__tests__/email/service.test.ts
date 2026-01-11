import { EmailService } from '@/lib/email/service';
import { CustomerSchema } from '@/lib/schemas/customer';

// Mock the AWS SDK
jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({ MessageId: 'test-message-id' })
  })),
  SendEmailCommand: jest.fn().mockImplementation((params) => params)
}));

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    // Set test environment variables
    process.env.NEXT_AWS_ACCESS_KEY_ID = 'test_access_key';
    process.env.NEXT_AWS_SECRET_ACCESS_KEY = 'test_secret_key';
    process.env.NEXT_AWS_REGION = 'eu-central-1';
    process.env.FROM_EMAIL = 'test@example.com';
    process.env.ADMIN_EMAIL = 'admin@example.com';

    emailService = new EmailService();
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.NEXT_AWS_ACCESS_KEY_ID;
    delete process.env.NEXT_AWS_SECRET_ACCESS_KEY;
    delete process.env.NEXT_AWS_REGION;
    delete process.env.FROM_EMAIL;
    delete process.env.ADMIN_EMAIL;
  });

  it('sends welcome email', async () => {
    const customer = CustomerSchema.parse({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      preferences: {
        newsletter: true,
        productUpdates: true
      }
    });

    await expect(emailService.sendWelcomeEmail(customer)).resolves.not.toThrow();
  });

  it('sends admin notification', async () => {
    const customer = CustomerSchema.parse({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      preferences: {
        newsletter: true,
        productUpdates: false
      }
    });

    await expect(emailService.sendAdminNotification(customer)).resolves.not.toThrow();
  });

  it('handles invalid customer data', async () => {
    await expect(
      CustomerSchema.parseAsync({
        name: '',
        email: 'invalid-email',
        message: ''
      })
    ).rejects.toThrow();
  });
});
