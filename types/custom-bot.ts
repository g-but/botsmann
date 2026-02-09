/**
 * Custom Bot Types
 * @module types/custom-bot
 *
 * Types for user-created custom AI assistants
 */

import type { BotAccentColor, BotMenuItem } from './bot';

/**
 * Navigation configuration for custom bot pages
 */
export interface CustomBotNavConfig {
  menuItems: BotMenuItem[];
}

/**
 * Custom bot as stored in database
 */
export interface CustomBot {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  description: string | null;
  emoji: string;
  accent_color: BotAccentColor;
  system_prompt: string;
  nav_config: CustomBotNavConfig;
  is_published: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Input types derived from Zod schemas (SSOT: lib/validations/custom-bot.ts)
export type { CreateCustomBotInput, UpdateCustomBotInput } from '@/lib/validations/custom-bot';

/**
 * Knowledge chunk for custom bot RAG
 */
export interface BotKnowledgeChunk {
  id: string;
  bot_id: string;
  user_id: string;
  topic: string | null;
  question: string | null;
  content: string;
  keywords: string[];
  source: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Knowledge chunk input types derived from Zod schemas (SSOT: lib/validations/custom-bot.ts)
export type {
  CreateKnowledgeChunkInput,
  UpdateKnowledgeChunkInput,
} from '@/lib/validations/custom-bot';

/**
 * Knowledge chunk with similarity score (from vector search)
 */
export interface KnowledgeChunkMatch {
  id: string;
  topic: string | null;
  question: string | null;
  content: string;
  keywords: string[];
  similarity: number;
}

/**
 * Custom bot with knowledge chunk count
 */
export interface CustomBotWithStats extends CustomBot {
  knowledge_count: number;
}
