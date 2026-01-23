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

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

export const getStatusColor = (status: string) => {
  if (status === 'Completed') return 'bg-green-100 text-green-800';
  if (status === 'In Progress') return 'bg-blue-100 text-blue-800';
  if (status === 'Pending') return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const getTransparencyColor = (score: number) => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};
