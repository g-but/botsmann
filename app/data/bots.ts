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
    description: 'Intelligent customer support automation',
    overview: 'Our Customer Service Bot provides 24/7 support and handles common customer inquiries.',
    features: [
      'Natural language understanding',
      'Multi-language support',
      'Ticket creation and routing',
      'FAQ automation',
      'Sentiment analysis'
    ],
    details: 'Built with state-of-the-art AI models to provide human-like customer interactions.'
  }
];

export default bots;
