'use client';

/**
 * Step 1: Basic Information
 * - Bot title
 * - URL slug
 * - Description
 */

import { useEffect } from 'react';

interface StepBasicInfoProps {
  title: string;
  slug: string;
  description: string;
  onChange: (data: { title?: string; slug?: string; description?: string }) => void;
  errors: string[];
}

/**
 * Convert title to URL-friendly slug
 */
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function StepBasicInfo({ title, slug, description, onChange, errors }: StepBasicInfoProps) {
  // Auto-generate slug from title if slug is empty or matches previous auto-generated value
  useEffect(() => {
    if (title && !slug) {
      onChange({ slug: titleToSlug(title) });
    }
  }, [title, slug, onChange]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Give your bot a name and identity. This is how users will find and recognize it.
        </p>
      </div>

      {/* Error display */}
      {errors.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <ul className="list-disc list-inside text-sm text-red-700">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Bot Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            const newTitle = e.target.value;
            onChange({
              title: newTitle,
              // Auto-update slug if it was auto-generated
              ...(slug === titleToSlug(title) ? { slug: titleToSlug(newTitle) } : {}),
            });
          }}
          placeholder="e.g., HR Strategy Advisor"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          maxLength={100}
        />
        <p className="mt-1 text-xs text-gray-500">{title.length}/100 characters</p>
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          URL Slug <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex rounded-lg shadow-sm">
          <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
            /bots/
          </span>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => onChange({ slug: e.target.value.toLowerCase() })}
            placeholder="hr-strategy-advisor"
            className="block w-full rounded-r-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            maxLength={50}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Lowercase letters, numbers, and hyphens only
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="A brief description of what your bot does and who it's for..."
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          maxLength={500}
        />
        <p className="mt-1 text-xs text-gray-500">{description.length}/500 characters</p>
      </div>
    </div>
  );
}
