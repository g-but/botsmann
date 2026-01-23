import { EnhancedTransaction } from '../TransactionWithTraceability';

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

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

export const getTransparencyColor = (score: number) => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const getStatusColor = (status: string) => {
  if (status === 'Completed' || status === 'active' || status === 'achieved')
    return 'bg-green-100 text-green-800';
  if (status === 'Pending' || status === 'proposed' || status === 'on-track')
    return 'bg-yellow-100 text-yellow-800';
  if (status === 'at-risk') return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const getKpiStatusColor = (status: string) => {
  if (status === 'achieved') return 'bg-green-500';
  if (status === 'on-track') return 'bg-blue-500';
  if (status === 'at-risk') return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getTrendColor = (trend: string) => {
  if (trend === 'up') return 'text-green-600';
  if (trend === 'down') return 'text-red-600';
  return 'text-gray-500';
};
