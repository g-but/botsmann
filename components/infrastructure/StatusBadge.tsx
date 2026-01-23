'use client';

import { type FC } from 'react';
import { type ConnectionStatus } from '@/lib/infrastructure';

interface StatusBadgeProps {
  status: ConnectionStatus;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const statusConfig: Record<
  ConnectionStatus,
  { color: string; bgColor: string; label: string; icon?: string }
> = {
  connected: {
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    label: 'Connected',
  },
  'not-configured': {
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    label: 'Not Configured',
  },
  validating: {
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    label: 'Validating...',
  },
  error: {
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    label: 'Error',
  },
};

/**
 * Status badge component for displaying connection state
 * Used in provider cards, settings, and infrastructure page
 */
export const StatusBadge: FC<StatusBadgeProps> = ({ status, size = 'md', showLabel = true }) => {
  const config = statusConfig[status];
  const isValidating = status === 'validating';

  const sizeClasses = {
    sm: {
      container: 'px-2 py-0.5 text-xs',
      dot: 'w-1.5 h-1.5',
    },
    md: {
      container: 'px-2.5 py-1 text-sm',
      dot: 'w-2 h-2',
    },
  };

  const s = sizeClasses[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.bgColor} ${config.color} ${s.container}`}
    >
      <span
        className={`${s.dot} rounded-full ${
          status === 'connected'
            ? 'bg-green-500'
            : status === 'not-configured'
              ? 'bg-gray-400'
              : status === 'validating'
                ? 'bg-amber-500'
                : 'bg-red-500'
        } ${isValidating ? 'animate-pulse' : ''}`}
      />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

// Dot-only variant for compact displays
export const StatusDot: FC<{ status: ConnectionStatus }> = ({ status }) => {
  const dotColors: Record<ConnectionStatus, string> = {
    connected: 'bg-green-500',
    'not-configured': 'bg-gray-300',
    validating: 'bg-amber-500 animate-pulse',
    error: 'bg-red-500',
  };

  const labels: Record<ConnectionStatus, string> = {
    connected: 'Connected',
    'not-configured': 'Not configured',
    validating: 'Validating',
    error: 'Connection error',
  };

  return <span className={`w-2 h-2 rounded-full ${dotColors[status]}`} title={labels[status]} />;
};
