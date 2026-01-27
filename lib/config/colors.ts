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
export const CUSTOM_BOT_ACCENT_COLORS = [
  'blue',
  'green',
  'indigo',
  'red',
  'amber',
] as const;

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
 * Composite color classes for themed UI (for restricted color set)
 */
export const COLOR_CLASSES: Record<CustomBotAccentColor, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
  green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200' },
  red: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200' },
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
 * Default accent color
 */
export const DEFAULT_ACCENT_COLOR: CustomBotAccentColor = 'blue';
