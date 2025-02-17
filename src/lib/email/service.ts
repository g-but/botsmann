import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { Customer } from '@/src/lib/schemas/customer';

export class EmailService {
  private ses: SESClient;
  private fromEmail: string;
  private adminEmail: string;

  constructor() {
    this.ses = new SESClient({
      region: process.env.NEXT_AWS_REGION || 'eu-central-1', // Frankfurt region for Swiss compliance
      credentials: {
        accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || ''
      }
    });
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@botsmann.com';
    this.adminEmail = process.env.ADMIN_EMAIL || 'butaeff@gmail.com';
  }

  private async sendEmail(params: any, type: 'welcome' | 'admin'): Promise<void> {
    try {
      const result = await this.ses.send(new SendEmailCommand(params));
      console.info(`Successfully sent ${type} email. MessageId: ${result.MessageId}`);
    } catch (error: any) {
      if (error.name === 'MessageRejected') {
        console.error(`${type} email rejected:`, error.message);
        throw new Error(`Failed to send ${type} email: ${error.message}`);
      } else if (error.name === 'ConfigurationSetDoesNotExist') {
        console.error(`AWS SES configuration error for ${type} email:`, error.message);
        throw new Error('Email service misconfigured');
      } else {
        console.error(`Unknown error sending ${type} email:`, error);
        throw new Error('Failed to send email');
      }
    }
  }

  async sendWelcomeEmail(customer: Customer): Promise<void> {
    const params = {
      Source: this.fromEmail || 'butaeff@gmail.com',
      Destination: {
        ToAddresses: [customer.email]
      },
      Message: {
        Subject: {
          Data: 'Welcome to Botsmann!'
        },
        Body: {
          Text: {
            Data: `Hello ${customer.name},\n\nThank you for your interest in Botsmann! We've received your message and will get back to you soon.\n\nBest regards,\nThe Botsmann Team`
          }
        }
      }
    };

    await this.sendEmail(params, 'welcome');
  }

  async sendAdminNotification(customer: Customer): Promise<void> {
    const params = {
      Source: this.fromEmail || 'butaeff@gmail.com',
      Destination: {
        ToAddresses: [this.adminEmail || 'butaeff@gmail.com']
      },
      Message: {
        Subject: {
          Data: 'New Customer Registration'
        },
        Body: {
          Text: {
            Data: `New customer registration:\n\nName: ${customer.name}\nEmail: ${customer.email}\nMessage: ${customer.message}\n\nPreferences:\n- Newsletter: ${customer.preferences.newsletter ? 'Yes' : 'No'}\n- Product Updates: ${customer.preferences.productUpdates ? 'Yes' : 'No'}`
          }
        }
      }
    };

    await this.sendEmail(params, 'admin');
  }
}
