/**
 * Governance Utilities - SSOT
 * @module app/projects/governance/utils
 *
 * Single source of truth for governance formatting and helper functions.
 */

// =============================================================================
// FORMATTING
// =============================================================================

/**
 * Format a number as USD currency
 */
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

// =============================================================================
// STATUS COLORS
// =============================================================================

/**
 * Get badge color classes for status text
 */
export const getStatusBadgeColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();

  // Success states
  if (['completed', 'active', 'achieved', 'paid'].includes(normalizedStatus)) {
    return 'bg-green-100 text-green-800';
  }

  // In-progress states
  if (['in progress', 'in-progress'].includes(normalizedStatus)) {
    return 'bg-blue-100 text-blue-800';
  }

  // Warning states
  if (['pending', 'proposed', 'on-track', 'at-risk'].includes(normalizedStatus)) {
    return 'bg-yellow-100 text-yellow-800';
  }

  // Error states
  return 'bg-red-100 text-red-800';
};

/**
 * Get solid background color class for KPI status
 */
export const getKpiStatusColor = (status: string): string => {
  switch (status) {
    case 'achieved':
      return 'bg-green-500';
    case 'on-track':
      return 'bg-blue-500';
    case 'at-risk':
      return 'bg-yellow-500';
    default:
      return 'bg-red-500';
  }
};

// =============================================================================
// TRANSPARENCY COLORS
// =============================================================================

/**
 * Get badge color classes for transparency score
 */
export const getTransparencyBadgeColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

/**
 * Get solid background color class for transparency progress bar
 */
export const getTransparencyBarColor = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

// =============================================================================
// TREND COLORS
// =============================================================================

/**
 * Get text color class for trend indicator
 */
export const getTrendColor = (trend: 'up' | 'down' | 'neutral' | string): string => {
  if (trend === 'up') return 'text-green-600';
  if (trend === 'down') return 'text-red-600';
  return 'text-gray-500';
};
