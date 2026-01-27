import React from 'react';
import { type CustomBotAccentColor } from '@/lib/config/colors';

export interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface Step {
  title: string;
  description: string;
  image?: string;
}

export interface BotPageProps {
  title: string;
  overview: string;
  features: Feature[];
  howItWorks: Step[];
  demo?: React.ReactNode;
}

/**
 * Menu item for bot page navigation
 */
export interface BotMenuItem {
  id: string;
  label: string;
  icon?: string;
  section?: string;
}

/**
 * Accent colors available for bot pages (restricted set of 5 colors)
 * Re-exported from SSOT in lib/config/colors.ts
 */
export type { CustomBotAccentColor as BotAccentColor } from '@/lib/config/colors';

/**
 * Navigation configuration for bot pages
 */
export interface BotNavConfig {
  /** Display title in navigation */
  navTitle: string;
  /** Emoji displayed in navigation */
  emoji: string;
  /** Short description shown in nav */
  navDescription?: string;
  /** Accent color theme */
  accentColor: CustomBotAccentColor;
  /** Menu items for page sections */
  menuItems: BotMenuItem[];
}
