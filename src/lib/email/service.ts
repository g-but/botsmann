import { SESClient, SendEmailCommand, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';
import type { Customer } from '@/src/lib/schemas/customer';
import { EmailError } from '@/src/lib/models/emailError';

export class EmailService {
  private ses: SESClient;
  private fromEmail: string;
  private adminEmail: string;
  private useAwsSes: boolean;

  constructor() {
    this.ses = new SESClient({
      region: process.env.NEXT_AWS_REGION || 'eu-central-1',
      credentials: {
        accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || ''
      }
    });
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@botsmann.com';
    this.adminEmail = process.env.ADMIN_EMAIL || 'butaeff@gmail.com';
    this.useAwsSes = process.env.USE_AWS_SES === 'true';
  }

  private async logError(error: any, templateName: string, recipient: string, templateData: any) {
    try {
      await EmailError.create({
        error,
        templateName,
        recipient,
        templateData,
        timestamp: new Date()
      });
    } catch (logError) {
      console.error('Failed to log email error:', logError);
    }
  }

  private async sendLegacyEmail(params: any, type: 'welcome' | 'admin'): Promise<void> {
    try {
      const result = await this.ses.send(new SendEmailCommand(params));
      console.info(`Successfully sent ${type} email using legacy system. MessageId: ${result.MessageId}`);
    } catch (error: any) {
      await this.logError(error, type, params.Destination.ToAddresses[0], params.Message.Body.Text.Data);
      throw new Error(`Failed to send ${type} email: ${error.message}`);
    }
  }

  private async sendTemplatedEmail(templateName: string, recipient: string, templateData: any): Promise<void> {
    if (!this.useAwsSes) {
      const legacyParams = {
        Source: this.fromEmail,
        Destination: { ToAddresses: [recipient] },
        Message: {
          Subject: { Data: 'Welcome to Botsmann!' },
          Body: {
            Text: {
              Data: `Hello ${templateData.name},\n\nThank you for your interest in Botsmann! We've received your message and will get back to you soon.\n\nBest regards,\nThe Botsmann Team`
            }
          }
        }
      };
      return this.sendLegacyEmail(legacyParams, 'welcome');
    }

    try {
      const params = {
        Source: this.fromEmail,
        Destination: { ToAddresses: [recipient] },
        Template: templateName,
        TemplateData: JSON.stringify(templateData)
      };
      const result = await this.ses.send(new SendTemplatedEmailCommand(params));
      console.info(`Successfully sent templated email. MessageId: ${result.MessageId}`);
    } catch (error: any) {
      await this.logError(error, templateName, recipient, templateData);
      console.error(`Template email failed, falling back to legacy system:`, error);
      return this.sendLegacyEmail({
        Source: this.fromEmail,
        Destination: { ToAddresses: [recipient] },
        Message: {
          Subject: { Data: 'Welcome to Botsmann!' },
          Body: {
            Text: {
              Data: `Hello ${templateData.name},\n\nThank you for your interest in Botsmann! We've received your message and will get back to you soon.\n\nBest regards,\nThe Botsmann Team`
            }
          }
        }
      }, 'welcome');
    }
  }

  async sendWelcomeEmail(customer: Customer): Promise<void> {
    await this.sendTemplatedEmail('WelcomeTemplate', customer.email, {
      name: customer.name
    });
  }

  async sendAdminNotification(customer: Customer): Promise<void> {
    const params = {
      Source: this.fromEmail,
      Destination: {
        ToAddresses: [this.adminEmail]
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

    await this.sendLegacyEmail(params, 'admin');
  }
}
