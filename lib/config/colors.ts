/**
 * Color Configuration
 *
 * SSOT for color-related configurations.
 * Import from here instead of hardcoding color classes.
 */

/**
 * Accent color options for bots and UI elements
 */
export const ACCENT_COLORS = ['blue', 'green', 'purple', 'orange', 'red', 'yellow'] as const;

export type AccentColor = (typeof ACCENT_COLORS)[number];

/**
 * Border color classes for accent colors (used in cards, buttons, etc.)
 */
export const ACCENT_BORDER_CLASSES: Record<AccentColor, string> = {
  blue: 'border-blue-200 hover:border-blue-300',
  green: 'border-green-200 hover:border-green-300',
  purple: 'border-purple-200 hover:border-purple-300',
  orange: 'border-orange-200 hover:border-orange-300',
  red: 'border-red-200 hover:border-red-300',
  yellow: 'border-yellow-200 hover:border-yellow-300',
} as const;

/**
 * Background color classes for accent colors
 */
export const ACCENT_BG_CLASSES: Record<AccentColor, string> = {
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  purple: 'bg-purple-100',
  orange: 'bg-orange-100',
  red: 'bg-red-100',
  yellow: 'bg-yellow-100',
} as const;

/**
 * Text color classes for accent colors
 */
export const ACCENT_TEXT_CLASSES: Record<AccentColor, string> = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
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
