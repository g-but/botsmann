'use client';

import { type FC, type ReactNode } from 'react';

type InfoBoxVariant = 'info' | 'warning' | 'success' | 'error';

interface InfoBoxProps {
  variant: InfoBoxVariant;
  title?: string;
  children: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const variantStyles: Record<
  InfoBoxVariant,
  { bg: string; icon: string; text: string; button: string }
> = {
  info: {
    bg: 'bg-blue-50',
    icon: 'text-blue-400',
    text: 'text-blue-700',
    button: 'text-blue-700 hover:text-blue-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-400',
    text: 'text-yellow-700',
    button: 'text-yellow-700 hover:text-yellow-600',
  },
  success: {
    bg: 'bg-green-50',
    icon: 'text-green-400',
    text: 'text-green-700',
    button: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  error: {
    bg: 'bg-red-50',
    icon: 'text-red-400',
    text: 'text-red-700',
    button: 'text-red-700 hover:text-red-600',
  },
};

const icons: Record<InfoBoxVariant, JSX.Element> = {
  info: (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  success: (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

/**
 * Reusable info/warning/success/error box component
 */
export const InfoBox: FC<InfoBoxProps> = ({ variant, title, children, action }) => {
  const styles = variantStyles[variant];

  return (
    <div className={`rounded-md ${styles.bg} p-4`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${styles.icon}`}>{icons[variant]}</div>
        <div className="ml-3 flex-1">
          {title && (
            <h3
              className={`text-sm font-medium ${styles.text.replace('text-', 'text-').replace('-700', '-800')}`}
            >
              {title}
            </h3>
          )}
          <div className={`${title ? 'mt-2' : ''} text-sm ${styles.text}`}>{children}</div>
          {action && (
            <div className="mt-4">
              <button
                type="button"
                onClick={action.onClick}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
