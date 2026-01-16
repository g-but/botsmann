import { type FC } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  size?: AvatarSize;
  /** Border styling. Set to false to remove border */
  border?: string | false;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-12 w-12 text-lg',
  lg: 'h-16 w-16 text-2xl',
  xl: 'h-24 w-24 text-4xl',
} as const;

/**
 * Reusable Avatar component
 * Displays image if available, otherwise shows fallback initial
 */
export const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'lg',
  border = 'border-4 border-white',
  className = '',
}) => {
  const sizeClass = sizeClasses[size];
  const initial = fallback || alt.charAt(0).toUpperCase();
  const borderClass = border === false ? '' : border;

  if (src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element -- Dynamic external avatar URL */
      <img
        className={`${sizeClass} rounded-full ${borderClass} object-cover ${className}`}
        src={src}
        alt={alt}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full ${borderClass} bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
    >
      {initial}
    </div>
  );
};
