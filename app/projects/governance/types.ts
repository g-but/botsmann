/**
 * Governance Types - SSOT
 * @module app/projects/governance/types
 *
 * Single source of truth for all governance-related types.
 */

// =============================================================================
// TRANSACTION TYPES
// =============================================================================

export interface EnhancedTransaction {
  id: string;
  date: string;
  department: string;
  departmentId: string;
  recipient: string;
  description: string;
  amount: number;
  status: string;
  metrics: {
    costPerUnit: string;
    timeline: string;
    qualityScore: number;
    contractCompliance: number;
  };
  transparencyScore: number;
  socialData: {
    publicComments: number;
    likes: number;
    concerns: number;
    shares: number;
  };
  enablingLaws: Array<{
    id: string;
    name: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  timeline: Array<{
    date: string;
    event: string;
    description: string;
  }>;
}

export type TransactionTab = 'details' | 'laws' | 'documents' | 'timeline';

// =============================================================================
// AGENCY TYPES
// =============================================================================

export interface AgencyTeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  imageUrl?: string;
  bio: string;
  yearsOfService: number;
  salary: number;
  transparency: number;
  responsibilities: string[];
  contact: {
    email?: string;
    phone?: string;
    office?: string;
  };
}

export interface AgencyRegulation {
  id: string;
  title: string;
  description: string;
  dateEnacted: string;
  lastUpdated: string;
  status: 'active' | 'proposed' | 'revoked';
  purpose: string;
  kpis: Array<{
    metric: string;
    target: string;
    current: string;
    status: 'achieved' | 'on-track' | 'at-risk' | 'failed';
  }>;
  enablingLawId: string;
  enablingLawName: string;
}

export interface AgencyData {
  id: string;
  name: string;
  description: string;
  transparencyScore: number;
  establishment: string;
  budget: {
    total: number;
    allocated: number;
    spent: number;
    fiscalYear: string;
  };
  metrics: Array<{
    name: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
  }>;
  transactions: EnhancedTransaction[];
  regulations: AgencyRegulation[];
  team: AgencyTeamMember[];
  citizenImpact: {
    servicesProvided: number;
    citizensServed: number;
    satisfactionScore: number;
    avgResponseTime: string;
  };
}

export type AgencyTab = 'overview' | 'transactions' | 'regulations' | 'team';

// =============================================================================
// CITIZEN TYPES
// =============================================================================

export interface TaxPayment {
  id: string;
  year: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Late' | 'Disputed';
  type: 'Income' | 'Property' | 'Sales' | 'Other';
  reference: string;
}

export interface CitizenContribution {
  agencyId: string;
  agencyName: string;
  amount: number;
  percentage: number;
  transparencyScore: number;
  contributionHistory: Array<{
    year: string;
    amount: number;
  }>;
}

export interface CitizenBenefit {
  id: string;
  name: string;
  description: string;
  amount: number;
  frequency: 'One-time' | 'Monthly' | 'Quarterly' | 'Annual';
  provider: string;
  providerId: string;
  dateReceived: string;
  status: 'Active' | 'Pending' | 'Expired';
}

export interface CitizenData {
  id: string;
  name: string;
  address: string;
  district: string;
  registeredSince: string;
  avatarUrl?: string;
  taxHistory: TaxPayment[];
  contributions: CitizenContribution[];
  benefits: CitizenBenefit[];
  representativeId?: string;
  representativeName?: string;
  totalTaxContribution: number;
  votingDistricts: {
    local: string;
    state: string;
    federal: string;
  };
  participationScore: number;
}

export interface AdvisoryDistribution {
  agencyId: string;
  agencyName: string;
  currentPercentage: number;
  advisoryPercentage: number;
  difference: number;
}

export type CitizenTab = 'overview' | 'tax' | 'benefits' | 'advisory';
