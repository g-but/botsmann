import { type FC, type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  className?: string;
};

/**
 * Chevron down icon - used for dropdown indicators
 * SSOT for chevron styling across the app
 */
export const ChevronIcon: FC<IconProps & { open?: boolean }> = ({
  open = false,
  className = 'h-4 w-4',
  ...props
}) => (
  <svg
    className={`${className} transition-transform ${open ? 'rotate-180' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

/**
 * Close (X) icon - used for dismissible elements
 */
export const CloseIcon: FC<IconProps> = ({
  className = 'h-6 w-6',
  ...props
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * Hamburger menu icon - used for mobile menu toggle
 */
export const MenuIcon: FC<IconProps> = ({
  className = 'h-6 w-6',
  ...props
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
