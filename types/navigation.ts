import type { Route } from 'next';

/**
 * Configuration for megamenu section header
 */
export interface MegaMenuHeader {
  title: string;
  subtitle?: string;
  gradient?: string;
}

/**
 * Configuration for megamenu section footer with CTA
 */
export interface MegaMenuFooter {
  label: string;
  href: Route;
}

/**
 * Megamenu section configuration
 */
export interface MegaMenuConfig {
  /** Number of columns in the grid (1-3) */
  columns?: 1 | 2 | 3;
  /** Optional header with title and subtitle */
  header?: MegaMenuHeader;
  /** Optional footer with CTA link */
  footer?: MegaMenuFooter;
}

/**
 * Child menu item (submenu entry)
 */
export interface MenuChildItem {
  label: string;
  path: Route;
  description?: string;
  icon?: string;
}

/**
 * Top-level menu item
 */
export interface MenuItem {
  label: string;
  path: Route;
  /** Child items for dropdown/megamenu */
  children?: MenuChildItem[];
  /** Render as CTA button instead of link */
  isButton?: boolean;
  /** Megamenu configuration (only used when children exist) */
  megaMenu?: MegaMenuConfig;
}

/**
 * Props for navigation components
 */
export interface NavItemProps {
  item: MenuItem;
  isActive?: boolean;
  onNavigate?: () => void;
}

/**
 * Props for mobile navigation
 */
export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  currentPath: string;
}
