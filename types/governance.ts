// Governance-related type definitions
// Extracted from CitizenProfile.tsx and AgencyProfile.tsx for SSOT

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
  participationScore: number; // 0-100 based on voting, feedback, etc.
}

export interface AdvisoryDistribution {
  agencyId: string;
  agencyName: string;
  currentPercentage: number;
  advisoryPercentage: number;
  difference: number;
}

// Agency-related types
export interface BudgetItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  vendor?: string;
  status: 'Completed' | 'Pending' | 'Flagged';
}

export interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface AgencyData {
  id: string;
  name: string;
  description: string;
  budget: number;
  budgetBreakdown: BudgetItem[];
  transactions: Transaction[];
  performanceMetrics: PerformanceMetric[];
  transparencyScore: number;
  headCount: number;
  yearEstablished: number;
  website?: string;
  contactEmail?: string;
}

// Tab types for profile components
export type CitizenProfileTab = 'overview' | 'tax' | 'benefits' | 'advisory';
export type AgencyProfileTab = 'overview' | 'budget' | 'transactions' | 'performance';
