import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { Customer } from '@/lib/schemas/customer';
import { AWS_CONFIG, EMAIL_ADDRESSES, EMAIL_SUBJECTS } from '@/lib/config/email';

export class EmailServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'EmailServiceError';
  }
}

export class EmailService {
  private ses: SESClient;
  private fromEmail: string;
  private adminEmail: string;

  constructor() {
    this.ses = new SESClient({
      region: AWS_CONFIG.region,
      credentials: AWS_CONFIG.credentials,
    });
    this.fromEmail = EMAIL_ADDRESSES.from;
    this.adminEmail = EMAIL_ADDRESSES.admin;
  }

  async sendWelcomeEmail(customer: Customer): Promise<void> {
    const params = {
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [customer.email],
      },
      Message: {
        Subject: {
          Data: EMAIL_SUBJECTS.welcome,
        },
        Body: {
          Text: {
            Data: `Hello ${customer.name},\n\nThank you for your interest in Botsmann! We've received your message and will get back to you soon.\n\nBest regards,\nThe Botsmann Team`,
          },
        },
      },
    };

    try {
      await this.ses.send(new SendEmailCommand(params));
    } catch (error) {
      throw new EmailServiceError('Failed to send welcome email', error);
    }
  }

  async sendAdminNotification(customer: Customer): Promise<void> {
    const params = {
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [this.adminEmail],
      },
      Message: {
        Subject: {
          Data: EMAIL_SUBJECTS.newCustomer,
        },
        Body: {
          Text: {
            Data: `New customer registration:\n\nName: ${customer.name}\nEmail: ${customer.email}\nMessage: ${customer.message}\n\nPreferences:\n- Newsletter: ${customer.preferences.newsletter ? 'Yes' : 'No'}\n- Product Updates: ${customer.preferences.productUpdates ? 'Yes' : 'No'}`,
          },
        },
      },
    };

    try {
      await this.ses.send(new SendEmailCommand(params));
    } catch (error) {
      throw new EmailServiceError('Failed to send admin notification', error);
    }
  }
}
