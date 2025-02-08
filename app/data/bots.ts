export interface Bot {
  slug: string;
  title: string;
  description: string;
  overview: string;
  features: string[];
  details: string;
}

const bots: Bot[] = [
  {
    slug: 'lawyer-bot',
    title: 'Legal Assistant Bot',
    description: 'AI-powered legal assistant for document review and analysis',
    overview: 'Our Legal Assistant Bot helps streamline document review processes and provides quick legal insights.',
    features: [
      'Document analysis and review',
      'Legal research assistance',
      'Contract clause identification',
      'Risk assessment',
      'Compliance checking'
    ],
    details: 'Powered by advanced natural language processing, our Legal Assistant Bot helps legal professionals work more efficiently.'
  },
  {
    slug: 'customer-service-bot',
    title: 'Customer Service Bot',
    description: '24/7 customer support automation solution',
    overview: 'Provide round-the-clock customer support with our intelligent Customer Service Bot.',
    features: [
      'Multi-language support',
      'Ticket management',
      'FAQ automation',
      'Sentiment analysis',
      'Seamless handoff'
    ],
    details: 'Enhance your customer support operations with AI-powered automation that understands and responds to customer needs effectively.'
  }
] as const;

export default bots;
