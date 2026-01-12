'use client';

import type { DifficultyLevel } from '@/types/knowledge';
import { difficultyConfig } from '@/types/knowledge';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Badge component displaying difficulty level with appropriate styling
 */
export function DifficultyBadge({ level, size = 'md' }: DifficultyBadgeProps) {
  const config = difficultyConfig[level];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bgColor} ${config.color} ${config.borderColor} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  );
}
