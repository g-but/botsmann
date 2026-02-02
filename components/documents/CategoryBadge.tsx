'use client';

import { type FC } from 'react';
import { type DocumentCategory, DOCUMENT_CATEGORIES } from '@/types/document';

interface CategoryBadgeProps {
  category: DocumentCategory;
  size?: 'sm' | 'md';
}

/**
 * Badge displaying a document's category with emoji and label
 */
export const CategoryBadge: FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const config = DOCUMENT_CATEGORIES.find((c) => c.value === category) || DOCUMENT_CATEGORIES[0];

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 bg-gray-100 text-gray-700 rounded-full ${sizeClasses}`}
      title={config.description}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
};
