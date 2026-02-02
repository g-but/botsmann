import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Professionals | Botsmann',
  description:
    'Meet your AI advisors: legal, health, research, language, creative, and business professionals. Get expert guidance 24/7.',
};

export default function ProfessionalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
