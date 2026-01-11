import type { BotAccentColor } from '@/types/bot';

/**
 * Color classes for navigation elements by accent color
 * Centralized to avoid duplication across navigation components
 */
export interface NavColorClasses {
  /** Logo/icon background */
  logo: string;
  /** Title text color */
  title: string;
  /** Active menu item */
  active: string;
  /** Hover state for menu items */
  hover: string;
  /** Primary accent (buttons, CTAs) */
  accent: string;
  /** Border color */
  border: string;
}

/**
 * Navigation color schemes for all bot accent colors
 * SSOT for navigation styling - update here to change all bot pages
 */
export const NAV_COLOR_CLASSES: Record<BotAccentColor, NavColorClasses> = {
  blue: {
    logo: 'bg-blue-100',
    title: 'text-blue-900',
    active: 'text-blue-700 bg-blue-50',
    hover: 'hover:text-blue-700 hover:bg-blue-50',
    accent: 'bg-blue-600 hover:bg-blue-700',
    border: 'border-blue-300',
  },
  green: {
    logo: 'bg-green-100',
    title: 'text-green-900',
    active: 'text-green-700 bg-green-50',
    hover: 'hover:text-green-700 hover:bg-green-50',
    accent: 'bg-green-600 hover:bg-green-700',
    border: 'border-green-300',
  },
  indigo: {
    logo: 'bg-indigo-100',
    title: 'text-indigo-900',
    active: 'text-indigo-700 bg-indigo-50',
    hover: 'hover:text-indigo-700 hover:bg-indigo-50',
    accent: 'bg-indigo-600 hover:bg-indigo-700',
    border: 'border-indigo-300',
  },
  red: {
    logo: 'bg-red-100',
    title: 'text-red-900',
    active: 'text-red-700 bg-red-50',
    hover: 'hover:text-red-700 hover:bg-red-50',
    accent: 'bg-red-600 hover:bg-red-700',
    border: 'border-red-300',
  },
  amber: {
    logo: 'bg-amber-100',
    title: 'text-amber-900',
    active: 'text-amber-700 bg-amber-50',
    hover: 'hover:text-amber-700 hover:bg-amber-50',
    accent: 'bg-amber-600 hover:bg-amber-700',
    border: 'border-amber-300',
  },
};

/**
 * Get color classes for a given accent color
 * Falls back to blue if invalid color provided
 */
export const getNavColors = (accentColor: string): NavColorClasses => {
  return NAV_COLOR_CLASSES[accentColor as BotAccentColor] ?? NAV_COLOR_CLASSES.blue;
};
