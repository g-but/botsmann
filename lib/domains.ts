/**
 * Domain Definitions - SINGLE SOURCE OF TRUTH
 *
 * All domain-related constants and types are defined here.
 * Other files import from this module - never duplicate these values.
 *
 * @module lib/domains
 */

/**
 * All valid domains in the system.
 * Add new domains here - this is the ONLY place they should be defined.
 */
export const DOMAINS = [
  'legal',
  'health',
  'research',
  'language',
  'creative',
  'business',
  'general',
] as const;

/**
 * Domain type derived from DOMAINS array.
 * Use this type for type-safe domain handling.
 */
export type Domain = (typeof DOMAINS)[number];

/**
 * Domain metadata for UI and business logic.
 */
export interface DomainInfo {
  slug: Domain;
  name: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Complete domain information.
 * Used for UI rendering and domain selection.
 */
export const DOMAIN_INFO: Record<Domain, DomainInfo> = {
  legal: {
    slug: 'legal',
    name: 'Legal',
    description: 'Legal documents, contracts, and compliance',
    icon: '⚖️',
    color: 'blue',
  },
  health: {
    slug: 'health',
    name: 'Health',
    description: 'Medical records, health information, and wellness',
    icon: '⚕️',
    color: 'green',
  },
  research: {
    slug: 'research',
    name: 'Research',
    description: 'Academic papers, studies, and analysis',
    icon: '🧠',
    color: 'purple',
  },
  language: {
    slug: 'language',
    name: 'Language',
    description: 'Language learning and translation',
    icon: '🗣️',
    color: 'orange',
  },
  creative: {
    slug: 'creative',
    name: 'Creative',
    description: 'Art, design, and creative projects',
    icon: '🎨',
    color: 'pink',
  },
  business: {
    slug: 'business',
    name: 'Business',
    description: 'Business strategy, planning, and operations',
    icon: '📊',
    color: 'indigo',
  },
  general: {
    slug: 'general',
    name: 'General',
    description: 'General purpose documents and information',
    icon: '📄',
    color: 'gray',
  },
};

/**
 * Check if a string is a valid domain.
 */
export function isValidDomain(value: string): value is Domain {
  return DOMAINS.includes(value as Domain);
}

/**
 * Validate an array of domains, filtering out invalid ones.
 * Returns only valid domains.
 */
export function validateDomains(values: string[]): Domain[] {
  return values.filter(isValidDomain);
}

/**
 * Get domain info by slug.
 * Returns undefined if domain doesn't exist.
 */
export function getDomainInfo(slug: string): DomainInfo | undefined {
  if (isValidDomain(slug)) {
    return DOMAIN_INFO[slug];
  }
  return undefined;
}

/**
 * Map professional slugs to their primary domains.
 * Used for automatic domain detection based on conversation context.
 */
export const PROFESSIONAL_DOMAINS: Record<string, Domain[]> = {
  legal: ['legal', 'business'],
  health: ['health'],
  research: ['research'],
  language: ['language'],
  creative: ['creative'],
  business: ['business'],
};

/**
 * Get domains associated with a professional.
 */
export function getDomainsForProfessional(professionalSlug: string): Domain[] {
  return PROFESSIONAL_DOMAINS[professionalSlug] || ['general'];
}
