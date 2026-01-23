'use client';

import { type FC } from 'react';
import Link from 'next/link';
import {
  getProviderById,
  getProviderColorClasses,
  type ProviderId,
  type ConnectionStatus,
} from '@/lib/infrastructure';
import { StatusBadge } from './StatusBadge';

interface InfrastructureWidgetProps {
  currentProvider: ProviderId;
  status?: ConnectionStatus;
}

/**
 * Compact infrastructure status widget for settings page
 * Links to full infrastructure page for configuration
 */
export const InfrastructureWidget: FC<InfrastructureWidgetProps> = ({
  currentProvider,
  status = 'not-configured',
}) => {
  const provider = getProviderById(currentProvider);
  if (!provider) return null;

  const colors = getProviderColorClasses(provider.color);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">AI Infrastructure</h3>
          <Link
            href="/infrastructure"
            className={`text-sm font-medium ${colors.text} hover:underline`}
          >
            Configure →
          </Link>
        </div>
      </div>

      {/* Current Provider */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Provider icon */}
          <div
            className={`w-12 h-12 ${colors.bgLight} rounded-xl flex items-center justify-center text-2xl`}
          >
            {provider.logo}
          </div>

          {/* Provider info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{provider.name}</span>
              <StatusBadge status={status} size="sm" />
            </div>
            <p className="text-sm text-gray-500 truncate">{provider.tagline}</p>
          </div>
        </div>

        {/* Quick action for unconfigured providers that need keys */}
        {status === 'not-configured' && provider.keyRequired && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link
              href="/infrastructure"
              className={`block text-center py-2 px-4 rounded-lg ${colors.bg} text-white font-medium text-sm hover:opacity-90 transition-opacity`}
            >
              Add API Key
            </Link>
          </div>
        )}

        {/* Ready status message */}
        {(status === 'connected' || (currentProvider === 'groq' && !provider.keyRequired)) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Ready to use</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
