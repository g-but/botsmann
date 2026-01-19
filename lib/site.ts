/**
 * Site Configuration
 *
 * SSOT for site metadata used in layout, meta tags, and throughout the app.
 */

export const site = {
  name: 'Botsmann',
  tagline: 'Your Data. Your AI. Your Control.',
  description:
    'Private AI that works with your data. Upload documents, ask questions, get answers with citations. Pre-built assistants for legal, medical, research, and more.',
  url: 'https://botsmann.com',
  author: 'Botsmann AI',
  social: {
    github: 'https://github.com/g-but',
    twitter: 'https://twitter.com/AithelionV',
  },
} as const;

export type SiteConfig = typeof site;
