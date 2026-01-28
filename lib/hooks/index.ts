/**
 * Hooks and configurations for navigation
 * @module lib/hooks
 */

export { useScrollNavigation } from './useScrollNavigation';
export { getNavColors } from './navigationConfig';

// Bot builder hooks
export { useBotBuilder } from './useBotBuilder';
export type { BotBuilderState, KnowledgeChunkDraft, UseBotBuilderReturn } from './useBotBuilder';

// Dashboard hooks
export { useDashboardStats } from './useDashboardStats';
export type { CustomBot, DashboardStats } from './useDashboardStats';
