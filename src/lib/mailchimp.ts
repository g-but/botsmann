import mailchimp from '@mailchimp/mailchimp_marketing';

interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string;
  listId: string;
}

interface Campaign {
  id: string;
  [key: string]: any;
}

export class MailchimpService {
  private client: typeof mailchimp;
  private listId: string;

  constructor(config: MailchimpConfig) {
    this.client = mailchimp;
    this.client.setConfig({
      apiKey: config.apiKey,
      server: config.serverPrefix,
    });
    this.listId = config.listId;
  }

  async addSubscriber(email: string, name: string) {
    try {
      // Add member to list
      const member = await this.client.lists.addListMember(this.listId, {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: name.split(' ')[0],
          LNAME: name.split(' ').slice(1).join(' ') || '',
        },
      });

      // Send welcome email
      await this.sendWelcomeEmail(email, name);

      return member;
    } catch (error) {
      console.error('Failed to add subscriber to Mailchimp:', error);
      throw error;
    }
  }

  private async sendWelcomeEmail(email: string, name: string) {
    try {
      // Create campaign for welcome email
      const campaign = await this.client.campaigns.create({
        type: 'regular',
        recipients: {
          list_id: this.listId,
          segment_opts: {
            match: 'all',
            conditions: [{
              condition_type: 'EmailAddress',
              op: 'is',
              field: 'EMAIL',
              value: email
            }]
          }
        },
        settings: {
          subject_line: 'Welcome to Botsmann!',
          from_name: 'Botsmann Team',
          reply_to: process.env.EMAIL_TO || '',
          title: `Welcome Email for ${email}`,
        }
      }) as Campaign;

      // Set campaign content
      await this.client.campaigns.setContent(campaign.id, {
        html: `
          <h1>Welcome to Botsmann, ${name.split(' ')[0]}!</h1>
          <p>Thank you for your interest in our AI solutions. We're excited to help you transform your business with our specialized bots.</p>
          <p>Our team will review your consultation request and get back to you shortly.</p>
          <p>In the meantime, feel free to explore our bot catalog:</p>
          <ul>
            <li>Customer Service Bot - Automate support with AI</li>
            <li>Legal Assistant Bot - Streamline legal document processing</li>
          </ul>
          <p>Best regards,<br>The Botsmann Team</p>
        `
      });

      // Send the campaign
      await this.client.campaigns.send(campaign.id);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw error to prevent blocking subscriber addition
    }
  }
}
