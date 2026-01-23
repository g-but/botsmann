/**
 * Document Status Badge Component
 *
 * SSOT for document status badge rendering.
 * Uses centralized status config from lib/constants.ts
 */

import { DOCUMENT_STATUS_CONFIG, type DocumentStatusType } from '@/lib/constants';

interface DocumentStatusBadgeProps {
  status: DocumentStatusType;
  className?: string;
}

export function DocumentStatusBadge({ status, className = '' }: DocumentStatusBadgeProps) {
  const config = DOCUMENT_STATUS_CONFIG[status];

  if (!config) return null;

  return (
    <span
      className={`px-2 py-1 text-xs ${config.bgColor} ${config.color} rounded-full ${className}`}
    >
      {config.label}
    </span>
  );
}
