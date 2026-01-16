/**
 * Validation Schemas
 * @module lib/validations
 *
 * Centralized Zod validation schemas
 */

// Custom bot validations
export {
  AccentColorSchema,
  BotMenuItemSchema,
  NavConfigSchema,
  CreateCustomBotSchema,
  UpdateCustomBotSchema,
  CreateKnowledgeChunkSchema,
  UpdateKnowledgeChunkSchema,
  BulkCreateKnowledgeChunksSchema,
  type CreateCustomBotInput,
  type UpdateCustomBotInput,
  type CreateKnowledgeChunkInput,
  type UpdateKnowledgeChunkInput,
  type BulkCreateKnowledgeChunksInput,
} from './custom-bot';
