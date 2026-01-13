// Governance utility functions

// Re-export formatCurrency from shared lib for backwards compatibility
export { formatCurrency } from '@/lib/format';

/**
 * Get the appropriate Tailwind classes for a transparency score badge
 */
export const getTransparencyScoreClasses = (score: number): string => {
  if (score >= 90) return 'bg-green-100 text-green-800';
  if (score >= 70) return 'bg-blue-100 text-blue-800';
  if (score >= 50) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

/**
 * Get the appropriate Tailwind classes for a transparency score progress bar
 */
export const getTransparencyBarClasses = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

/**
 * Get status badge classes based on status type
 */
export const getStatusBadgeClasses = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Paid': 'bg-green-100 text-green-800',
    'Active': 'bg-green-100 text-green-800',
    'Completed': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Late': 'bg-red-100 text-red-800',
    'Flagged': 'bg-red-100 text-red-800',
    'Disputed': 'bg-gray-100 text-gray-800',
    'Expired': 'bg-gray-100 text-gray-800',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get difference indicator classes (positive/negative/neutral)
 */
export const getDifferenceClasses = (difference: number): string => {
  if (difference > 0) return 'text-green-600';
  if (difference < 0) return 'text-red-600';
  return 'text-gray-600';
};

/**
 * Get allocation total indicator classes
 */
export const getAllocationClasses = (total: number): string => {
  if (total > 100) return 'text-red-600';
  if (total < 100) return 'text-yellow-600';
  return 'text-green-600';
};

/**
 * Get allocation bar background classes
 */
export const getAllocationBarClasses = (total: number): string => {
  if (total > 100) return 'bg-red-500';
  if (total < 100) return 'bg-yellow-500';
  return 'bg-green-500';
};
