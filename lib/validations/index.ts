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

// Conversation validations
export {
  ConversationBotTypeSchema,
  MessageSourceSchema,
  CreateConversationSchema,
  UpdateConversationSchema,
  AddMessageSchema,
  OnboardingStepSchema,
  CompleteOnboardingSchema,
  type CreateConversationInput,
  type UpdateConversationInput,
  type AddMessageInput,
  type OnboardingStepInput,
  type CompleteOnboardingInput,
} from './conversation';
