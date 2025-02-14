import { ReactNode } from 'react';

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface Bot {
  id: string;
  title: string;
  description: string;
  overview: string;
  features: Feature[];
  details: string;
  path: string;
}

export interface Step {
  title: string;
  description: string;
  image?: string;
}

export interface BotPageProps {
  title: string;
  overview: string;
  features: Feature[];
  howItWorks: Step[];
  demo?: ReactNode;
}
