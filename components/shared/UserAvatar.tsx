import { type FC } from 'react';

type UserAvatarSize = 'sm' | 'md' | 'lg';

interface UserAvatarProps {
  /** User's email to extract initial from */
  email?: string | null;
  /** Optional custom initial override */
  initial?: string;
  size?: UserAvatarSize;
  className?: string;
}

const sizeClasses: Record<UserAvatarSize, string> = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
} as const;

/**
 * Authenticated user avatar with gradient background
 * SSOT for user avatar styling in auth navigation
 */
export const UserAvatar: FC<UserAvatarProps> = ({
  email,
  initial,
  size = 'sm',
  className = '',
}) => {
  const displayInitial = initial || email?.[0]?.toUpperCase() || 'U';
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold ${className}`}
    >
      {displayInitial}
    </div>
  );
};
