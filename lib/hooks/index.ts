/**
 * Hooks and configurations for navigation
 * @module lib/hooks
 */

export { useScrollNavigation } from './useScrollNavigation';
export type { NavColorClasses } from './navigationConfig';
export { NAV_COLOR_CLASSES, getNavColors } from './navigationConfig';

// Form hooks
export { useFormSubmit } from './useFormSubmit';
export type { UseFormSubmitOptions, UseFormSubmitReturn } from './useFormSubmit';

// Bot builder hooks
export { useBotBuilder } from './useBotBuilder';
export type { BotBuilderState, KnowledgeChunkDraft, UseBotBuilderReturn } from './useBotBuilder';

// Dashboard hooks
export { useDashboardStats } from './useDashboardStats';
export type { CustomBot, DashboardStats } from './useDashboardStats';
