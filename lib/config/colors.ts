/**
 * Accent Colors Configuration - SSOT
 * @module lib/config/colors
 *
 * Single source of truth for all accent colors used throughout the app.
 * All color types, schemas, and Tailwind mappings should derive from here.
 */

import { z } from 'zod';

/**
 * All accent colors available in the system.
 * Used by bot templates and internal features.
 */
export const ACCENT_COLORS = [
  'blue',
  'green',
  'indigo',
  'red',
  'amber',
  'pink',
  'rose',
  'purple',
  'orange',
  'slate',
  'yellow',
  'sky',
  'stone',
  'violet',
  'cyan',
  'teal',
] as const;

/**
 * Accent colors available for custom bots (user-created).
 * Subset of ACCENT_COLORS - matches database CHECK constraint.
 */
export const CUSTOM_BOT_ACCENT_COLORS = ['blue', 'green', 'indigo', 'red', 'amber'] as const;

/**
 * Type for all accent colors in the system
 */
export type AccentColor = (typeof ACCENT_COLORS)[number];

/**
 * Type for custom bot accent colors (restricted set)
 */
export type CustomBotAccentColor = (typeof CUSTOM_BOT_ACCENT_COLORS)[number];

/**
 * Zod schema for all accent colors
 */
export const AccentColorSchema = z.enum(ACCENT_COLORS);

/**
 * Zod schema for custom bot accent colors (matches DB constraint)
 */
export const CustomBotAccentColorSchema = z.enum(CUSTOM_BOT_ACCENT_COLORS);

/**
 * Tailwind background color classes for each accent color (500 weight)
 */
export const ACCENT_COLOR_BG_CLASSES: Record<AccentColor, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  indigo: 'bg-indigo-500',
  red: 'bg-red-500',
  amber: 'bg-amber-500',
  pink: 'bg-pink-500',
  rose: 'bg-rose-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  slate: 'bg-slate-500',
  yellow: 'bg-yellow-500',
  sky: 'bg-sky-500',
  stone: 'bg-stone-500',
  violet: 'bg-violet-500',
  cyan: 'bg-cyan-500',
  teal: 'bg-teal-500',
};

/**
 * Get the Tailwind bg class for an accent color
 * Falls back to purple if color not found
 */
export function getAccentColorBgClass(color: string): string {
  return ACCENT_COLOR_BG_CLASSES[color as AccentColor] || 'bg-purple-500';
}

/**
 * Color picker options with labels (for forms) - uses restricted set
 */
export const ACCENT_COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
] as const;

/**
 * Composite color classes for themed UI (supports all accent colors)
 */
export const COLOR_CLASSES: Record<AccentColor, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
  green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200' },
  red: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200' },
  slate: { bg: 'bg-slate-500', text: 'text-slate-600', border: 'border-slate-200' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-200' },
  sky: { bg: 'bg-sky-500', text: 'text-sky-600', border: 'border-sky-200' },
  stone: { bg: 'bg-stone-500', text: 'text-stone-600', border: 'border-stone-200' },
  violet: { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-200' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', border: 'border-cyan-200' },
  teal: { bg: 'bg-teal-500', text: 'text-teal-600', border: 'border-teal-200' },
};

/**
 * Border color classes (for restricted color set)
 */
export const ACCENT_BORDER_CLASSES: Record<CustomBotAccentColor, string> = {
  blue: 'border-blue-200 hover:border-blue-300',
  green: 'border-green-200 hover:border-green-300',
  indigo: 'border-indigo-200 hover:border-indigo-300',
  red: 'border-red-200 hover:border-red-300',
  amber: 'border-amber-200 hover:border-amber-300',
} as const;

/**
 * Light background color classes (for restricted color set)
 */
export const ACCENT_BG_CLASSES: Record<CustomBotAccentColor, string> = {
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  indigo: 'bg-indigo-100',
  red: 'bg-red-100',
  amber: 'bg-amber-100',
} as const;

/**
 * Text color classes (for restricted color set)
 */
export const ACCENT_TEXT_CLASSES: Record<CustomBotAccentColor, string> = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  indigo: 'text-indigo-600',
  red: 'text-red-600',
  amber: 'text-amber-600',
} as const;

/**
 * Get border class for an accent color with fallback
 */
export function getAccentBorderClass(color: string | null | undefined): string {
  return ACCENT_BORDER_CLASSES[color as CustomBotAccentColor] || ACCENT_BORDER_CLASSES.blue;
}

/**
 * Get light background class for an accent color with fallback
 */
export function getAccentBgClass(color: string | null | undefined): string {
  return ACCENT_BG_CLASSES[color as CustomBotAccentColor] || ACCENT_BG_CLASSES.blue;
}

/**
 * Get text class for an accent color with fallback
 */
export function getAccentTextClass(color: string | null | undefined): string {
  return ACCENT_TEXT_CLASSES[color as CustomBotAccentColor] || ACCENT_TEXT_CLASSES.blue;
}

/**
 * Starter question hover classes for professional demos
 * Uses ProfessionalAccentColor set (includes 'purple')
 */
export const ACCENT_STARTER_HOVER_CLASSES: Record<string, string> = {
  blue: 'hover:border-blue-300 hover:bg-blue-50',
  green: 'hover:border-green-300 hover:bg-green-50',
  indigo: 'hover:border-indigo-300 hover:bg-indigo-50',
  red: 'hover:border-red-300 hover:bg-red-50',
  amber: 'hover:border-amber-300 hover:bg-amber-50',
  purple: 'hover:border-purple-300 hover:bg-purple-50',
};

/**
 * Focus border classes for professional demo inputs
 * Uses ProfessionalAccentColor set (includes 'purple')
 */
export const ACCENT_FOCUS_BORDER_CLASSES: Record<string, string> = {
  blue: 'focus:border-blue-500',
  green: 'focus:border-green-500',
  indigo: 'focus:border-indigo-500',
  red: 'focus:border-red-500',
  amber: 'focus:border-amber-500',
  purple: 'focus:border-purple-500',
};

/**
 * Default accent color
 */
export const DEFAULT_ACCENT_COLOR: CustomBotAccentColor = 'blue';

/**
 * Comprehensive accent class set for themed components
 */
export interface AccentClasses {
  primary: string;
  text: string;
  border: string;
  lightBg: string;
  badge: string;
}

const ACCENT_CLASS_SETS: Record<CustomBotAccentColor, AccentClasses> = {
  blue: {
    primary: 'bg-blue-500',
    text: 'text-blue-600',
    border: 'border-blue-500',
    lightBg: 'bg-blue-100',
    badge: 'bg-blue-100 text-blue-800',
  },
  green: {
    primary: 'bg-green-500',
    text: 'text-green-600',
    border: 'border-green-500',
    lightBg: 'bg-green-100',
    badge: 'bg-green-100 text-green-800',
  },
  indigo: {
    primary: 'bg-indigo-500',
    text: 'text-indigo-600',
    border: 'border-indigo-500',
    lightBg: 'bg-indigo-100',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  red: {
    primary: 'bg-red-500',
    text: 'text-red-600',
    border: 'border-red-500',
    lightBg: 'bg-red-100',
    badge: 'bg-red-100 text-red-800',
  },
  amber: {
    primary: 'bg-amber-500',
    text: 'text-amber-600',
    border: 'border-amber-500',
    lightBg: 'bg-amber-100',
    badge: 'bg-amber-100 text-amber-800',
  },
};

/**
 * Get comprehensive accent classes for a color
 */
export function getAccentClasses(color: string | null | undefined): AccentClasses {
  return ACCENT_CLASS_SETS[color as CustomBotAccentColor] || ACCENT_CLASS_SETS.blue;
}
