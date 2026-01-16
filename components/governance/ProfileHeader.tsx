'use client';

import { type FC } from 'react';
import { Avatar } from '@/components/shared';

export type GradientVariant = 'blue-green' | 'blue-purple' | 'purple-pink' | 'green-teal';

interface ProfileHeaderProps {
  name: string;
  id: string;
  idLabel?: string;
  subtitle?: string;
  avatarUrl?: string;
  gradient?: GradientVariant;
  badge?: {
    label: string;
    value: string | number;
  };
}

const gradientClasses: Record<GradientVariant, string> = {
  'blue-green': 'from-blue-600 to-green-600',
  'blue-purple': 'from-blue-600 to-purple-600',
  'purple-pink': 'from-purple-600 to-pink-600',
  'green-teal': 'from-green-600 to-teal-600',
} as const;

/**
 * Reusable profile header component for governance profiles
 * Used by CitizenProfile, AgencyProfile, and EmployeeProfile
 *
 * SSOT for profile header styling across governance module
 */
export const ProfileHeader: FC<ProfileHeaderProps> = ({
  name,
  id,
  idLabel = 'ID',
  subtitle,
  avatarUrl,
  gradient = 'blue-green',
  badge,
}) => {
  const gradientClass = gradientClasses[gradient];

  return (
    <div className={`relative bg-gradient-to-r ${gradientClass} px-4 py-6 sm:px-6 lg:px-8`}>
      <div className="relative max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0 flex items-center">
            <Avatar
              src={avatarUrl}
              alt={name}
              size="lg"
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white truncate">{name}</h1>
              <p className="text-white opacity-90">{idLabel}: {id}</p>
              {subtitle && <p className="text-white opacity-80">{subtitle}</p>}
            </div>
          </div>
          {badge && (
            <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {badge.label}: {badge.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
