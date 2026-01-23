import { type FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';

interface LogoProps {
  /** Link destination. Set to null to render without a link */
  href?: Route | null;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    icon: 'px-2 py-1 text-sm',
    text: 'text-lg',
  },
  md: {
    icon: 'px-4 py-2 text-xl',
    text: 'text-2xl',
  },
  lg: {
    icon: 'px-5 py-3 text-2xl',
    text: 'text-3xl',
  },
} as const;

/**
 * Botsmann Logo component
 * Single source of truth for logo styling across the app
 */
export const Logo: FC<LogoProps> = ({ href = '/' as Route, showText = true, size = 'md' }) => {
  const sizes = sizeClasses[size];

  const logoContent = (
    <div className="group flex items-center space-x-3">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
        <div
          className={`relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold ${sizes.icon} rounded-lg shadow-lg`}
        >
          B
        </div>
      </div>
      {showText && (
        <span
          className={`${sizes.text} font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent`}
        >
          Botsmann
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
