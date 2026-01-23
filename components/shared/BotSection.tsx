import { type FC, type ReactNode } from 'react';

interface BotSectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  isLast?: boolean;
}

/**
 * Standardized section wrapper for bot pages
 * Provides consistent spacing, scroll-margin for navigation, and section IDs
 */
export const BotSection: FC<BotSectionProps> = ({
  id,
  children,
  className = '',
  isLast = false,
}) => {
  const baseClasses = 'scroll-mt-24';
  const spacingClasses = isLast ? 'mb-24' : 'my-16';

  return (
    <section id={id} className={`${baseClasses} ${spacingClasses} ${className}`.trim()}>
      {children}
    </section>
  );
};
