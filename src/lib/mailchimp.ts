import mailchimp from '@mailchimp/mailchimp_marketing';

interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string;
  listId: string;
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
      const response = await this.client.lists.addListMember(this.listId, {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: name.split(' ')[0],
          LNAME: name.split(' ').slice(1).join(' ') || '',
        },
      });
      return response;
    } catch (error) {
      console.error('Failed to add subscriber to Mailchimp:', error);
      throw error;
    }
  }
}
