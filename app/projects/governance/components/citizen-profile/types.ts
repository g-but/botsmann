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

export type TabType = 'overview' | 'tax' | 'benefits' | 'advisory';
