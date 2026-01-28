'use client';

import React from 'react';
import { CitizenData } from './types';

interface ProfileHeaderProps {
  citizen: CitizenData;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ citizen }) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-green-600 px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0 flex items-center">
            {citizen.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element -- Dynamic external avatar URL from data */
              <img
                className="h-16 w-16 rounded-full border-4 border-white"
                src={citizen.avatarUrl}
                alt={citizen.name}
              />
            ) : (
              <div className="h-16 w-16 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
                {citizen.name.charAt(0)}
              </div>
            )}
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-white truncate">{citizen.name}</h1>
              <p className="text-white opacity-90">Citizen ID: {citizen.id}</p>
              <p className="text-white opacity-80">Registered since {citizen.registeredSince}</p>
            </div>
          </div>
          <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Participation Score: {citizen.participationScore}/100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
