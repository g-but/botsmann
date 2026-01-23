/**
 * Color Configuration
 *
 * SSOT for color-related configurations.
 * Import from here instead of hardcoding color classes.
 */

/**
 * Accent color options for bots and UI elements
 */
export const ACCENT_COLORS = ['blue', 'green', 'indigo', 'red', 'amber'] as const;

export type AccentColor = (typeof ACCENT_COLORS)[number];

/**
 * Color picker options with labels (for forms)
 */
export const ACCENT_COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
] as const;

/**
 * Composite color classes for themed UI (solid backgrounds)
 * Used in bot chat pages, headers, buttons
 */
export const COLOR_CLASSES: Record<AccentColor, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
  green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' },
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200' },
  red: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200' },
};

/**
 * Border color classes for accent colors (used in cards, buttons, etc.)
 */
export const ACCENT_BORDER_CLASSES: Record<AccentColor, string> = {
  blue: 'border-blue-200 hover:border-blue-300',
  green: 'border-green-200 hover:border-green-300',
  indigo: 'border-indigo-200 hover:border-indigo-300',
  red: 'border-red-200 hover:border-red-300',
  amber: 'border-amber-200 hover:border-amber-300',
} as const;

/**
 * Light background color classes (for cards, badges)
 */
export const ACCENT_BG_CLASSES: Record<AccentColor, string> = {
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  indigo: 'bg-indigo-100',
  red: 'bg-red-100',
  amber: 'bg-amber-100',
} as const;

/**
 * Text color classes for accent colors
 */
export const ACCENT_TEXT_CLASSES: Record<AccentColor, string> = {
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
  return ACCENT_BORDER_CLASSES[color as AccentColor] || ACCENT_BORDER_CLASSES.blue;
}

/**
 * Get background class for an accent color with fallback
 */
export function getAccentBgClass(color: string | null | undefined): string {
  return ACCENT_BG_CLASSES[color as AccentColor] || ACCENT_BG_CLASSES.blue;
}

/**
 * Get text class for an accent color with fallback
 */
export function getAccentTextClass(color: string | null | undefined): string {
  return ACCENT_TEXT_CLASSES[color as AccentColor] || ACCENT_TEXT_CLASSES.blue;
}

/**
 * Default accent color
 */
export const DEFAULT_ACCENT_COLOR: AccentColor = 'blue';
