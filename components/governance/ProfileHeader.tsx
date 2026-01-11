'use client';

import { type FC } from 'react';

interface ProfileHeaderProps {
  name: string;
  id: string;
  subtitle?: string;
  avatarUrl?: string;
  gradientFrom?: string;
  gradientTo?: string;
  badge?: {
    label: string;
    value: string | number;
  };
}

/**
 * Reusable profile header component for governance profiles
 * Used by CitizenProfile, AgencyProfile, and EmployeeProfile
 */
export const ProfileHeader: FC<ProfileHeaderProps> = ({
  name,
  id,
  subtitle,
  avatarUrl,
  gradientFrom = 'blue-600',
  gradientTo = 'green-600',
  badge,
}) => {
  return (
    <div className={`relative bg-gradient-to-r from-${gradientFrom} to-${gradientTo} px-4 py-6 sm:px-6 lg:px-8`}>
      <div className="relative max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0 flex items-center">
            {avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element -- Dynamic external avatar URL from data */
              <img
                className="h-16 w-16 rounded-full border-4 border-white"
                src={avatarUrl}
                alt={name}
              />
            ) : (
              <div className="h-16 w-16 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
                {name.charAt(0)}
              </div>
            )}
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white truncate">{name}</h1>
              <p className="text-white opacity-90">ID: {id}</p>
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
