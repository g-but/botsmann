/**
 * Knowledge Center type definitions
 * Types for guides, tutorials, and infrastructure comparison content
 */

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type GuideCategory =
  | 'getting-started'
  | 'building-bots'
  | 'infrastructure'
  | 'integration'
  | 'security'
  | 'deployment';

/**
 * Guide metadata from frontmatter
 */
export interface GuideMetadata {
  slug: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  readTime: string;
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  prerequisites?: string[];
  icon?: string;
  category: GuideCategory;
  published: boolean;
}

/**
 * Full guide with content and metadata separated
 */
export interface Guide {
  metadata: GuideMetadata;
  content: string;
  tableOfContents: TableOfContentsItem[];
}

/**
 * Table of contents item for guide navigation
 */
export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}

/**
 * Pricing information for comparison options
 */
export interface PricingInfo {
  type: 'free' | 'paid' | 'freemium';
  startingPrice?: string;
  pricingModel?: string;
  estimatedMonthlyCost?: {
    hobby: string;
    startup: string;
    enterprise: string;
  };
}

/**
 * Comparison option for infrastructure guides
 */
export interface ComparisonOption {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  pricing?: PricingInfo;
  setupComplexity: 'Easy' | 'Medium' | 'Hard';
  documentation?: string;
}

/**
 * Infrastructure comparison guide
 */
export interface ComparisonGuide extends GuideMetadata {
  comparisonType: 'hosting' | 'models' | 'pricing' | 'tools';
  options: ComparisonOption[];
  recommendation?: string;
}

/**
 * Filter options for guide listings
 */
export interface GuideFilters {
  difficulty?: DifficultyLevel;
  category?: GuideCategory;
  tags?: string[];
  search?: string;
}

/**
 * Difficulty level styling
 */
export const difficultyConfig: Record<
  DifficultyLevel,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    label: string;
  }
> = {
  Beginner: {
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Beginner',
  },
  Intermediate: {
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    label: 'Intermediate',
  },
  Advanced: {
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Advanced',
  },
};

/**
 * Category configuration
 */
export const categoryConfig: Record<
  GuideCategory,
  {
    label: string;
    icon: string;
    description: string;
  }
> = {
  'getting-started': {
    label: 'Getting Started',
    icon: '🚀',
    description: 'First steps with AI and chatbots',
  },
  'building-bots': {
    label: 'Building Bots',
    icon: '🤖',
    description: 'Create and customize AI assistants',
  },
  infrastructure: {
    label: 'Infrastructure',
    icon: '🏗️',
    description: 'Hosting, deployment, and architecture',
  },
  integration: {
    label: 'Integration',
    icon: '🔗',
    description: 'Connect with Slack, Teams, and more',
  },
  security: {
    label: 'Security',
    icon: '🔒',
    description: 'Best practices for secure AI systems',
  },
  deployment: {
    label: 'Deployment',
    icon: '📦',
    description: 'Ship to production',
  },
};
