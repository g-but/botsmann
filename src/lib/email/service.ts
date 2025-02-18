import { SESClient, SendEmailCommand, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';
import type { Customer } from '@/src/lib/schemas/customer';
import { EmailError } from '@/src/lib/models/emailError';
import { FEATURES } from '@/src/lib/config/features';

export class EmailService {
  private ses: SESClient;
  private fromEmail: string;
  private adminEmail: string;

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
    if (!FEATURES.AWS_SES_TEMPLATES) {
      const legacyParams = {
        Source: this.fromEmail,
        Destination: { ToAddresses: [recipient] },
        Message: {
          Subject: { Data: 'Welcome to Botsmann! | Willkommen bei Botsmann!' },
          Body: {
            Text: {
              Data: `Hello ${templateData.name},\n\nThank you for reaching out to Botsmann! We're excited to have you on board.\n\nBotsmann is all about AI-powered solutions that simplify your life and business. Whether you need an intelligent assistant, automation tools, or cutting-edge robotics, we're here to help.\n\nDiscover what's possible at botsmann.com.\n\nWe'll get back to you soon, but in the meantime, feel free to explore!\n\nBest,\nThe Botsmann Team\n\n---\n\nHallo ${templateData.name},\n\nDanke für dein Interesse an Botsmann! Es freut uns, dich an Bord zu haben.\n\nBei Botsmann dreht sich alles um KI-gestützte Lösungen, die dein Leben und dein Geschäft einfacher machen. Ob intelligenter Assistent, Automatisierung oder modernste Robotik – wir sind für dich da.\n\nEntdecke, was möglich ist auf botsmann.com.\n\nWir melden uns bald bei dir – bis dahin, viel Spass beim Erkunden!\n\nBeste Grüsse,\nDas Botsmann Team`
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
          Subject: { Data: 'Welcome to Botsmann! | Willkommen bei Botsmann!' },
          Body: {
            Text: {
              Data: `Hello ${templateData.name},\n\nThank you for reaching out to Botsmann! We're excited to have you on board.\n\nBotsmann is all about AI-powered solutions that simplify your life and business. Whether you need an intelligent assistant, automation tools, or cutting-edge robotics, we're here to help.\n\nDiscover what's possible at botsmann.com.\n\nWe'll get back to you soon, but in the meantime, feel free to explore!\n\nBest,\nThe Botsmann Team\n\n---\n\nHallo ${templateData.name},\n\nDanke für dein Interesse an Botsmann! Es freut uns, dich an Bord zu haben.\n\nBei Botsmann dreht sich alles um KI-gestützte Lösungen, die dein Leben und dein Geschäft einfacher machen. Ob intelligenter Assistent, Automatisierung oder modernste Robotik – wir sind für dich da.\n\nEntdecke, was möglich ist auf botsmann.com.\n\nWir melden uns bald bei dir – bis dahin, viel Spass beim Erkunden!\n\nBeste Grüsse,\nDas Botsmann Team`
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
