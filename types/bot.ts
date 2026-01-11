import React from 'react';

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
 * Accent colors available for bot pages
 */
export type BotAccentColor = 'blue' | 'green' | 'indigo' | 'red' | 'amber';

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
  accentColor: BotAccentColor;
  /** Menu items for page sections */
  menuItems: BotMenuItem[];
}
