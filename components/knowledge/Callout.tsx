'use client';

import type { ReactNode } from 'react';

type CalloutType = 'info' | 'warning' | 'tip' | 'danger';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutStyles: Record<CalloutType, {
  bg: string;
  border: string;
  icon: string;
  iconBg: string;
  title: string;
}> = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    iconBg: 'bg-blue-100',
    title: 'text-blue-800',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    iconBg: 'bg-amber-100',
    title: 'text-amber-800',
  },
  tip: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    iconBg: 'bg-green-100',
    title: 'text-green-800',
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    iconBg: 'bg-red-100',
    title: 'text-red-800',
  },
};

const defaultTitles: Record<CalloutType, string> = {
  info: 'Info',
  warning: 'Warning',
  tip: 'Tip',
  danger: 'Important',
};

/**
 * Callout component for highlighting important information in guides
 */
export function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = calloutStyles[type];
  const displayTitle = title || defaultTitles[type];

  return (
    <div className={`my-6 rounded-lg border ${styles.bg} ${styles.border} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 rounded-full p-1 ${styles.iconBg}`}>
          <CalloutIcon type={type} className={`w-4 h-4 ${styles.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${styles.title} mb-1`}>
            {displayTitle}
          </p>
          <div className="text-sm text-gray-700 prose prose-sm max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalloutIcon({ type, className }: { type: CalloutType; className: string }) {
  switch (type) {
    case 'info':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'tip':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case 'danger':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}
