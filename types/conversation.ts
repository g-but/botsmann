/**
 * Conversation types for persistent chat history
 * @module types/conversation
 */

/**
 * Source reference in a chat message
 */
export interface MessageSource {
  document_name: string;
  preview: string;
  chunk_id?: string;
  document_id?: string;
  similarity?: number;
}

/**
 * Chat message as stored in database
 */
export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  sources: MessageSource[] | null;
  created_at: string;
}

/**
 * Bot type for conversations
 */
export type ConversationBotType = 'documents' | 'custom_bot' | 'demo';

/**
 * Conversation as stored in database
 */
export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  bot_type: ConversationBotType;
  bot_id: string | null;
  document_id: string | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Conversation with its messages
 */
export interface ConversationWithMessages extends Conversation {
  messages: ConversationMessage[];
}

// Input types derived from Zod schemas (SSOT: lib/validations/conversation.ts)
export type {
  CreateConversationInput,
  UpdateConversationInput,
  AddMessageInput,
} from '@/lib/validations/conversation';

/**
 * API response for conversation list
 */
export interface ConversationListResponse {
  success: boolean;
  conversations?: Conversation[];
  error?: string;
}

/**
 * API response for single conversation
 */
export interface ConversationResponse {
  success: boolean;
  conversation?: ConversationWithMessages;
  error?: string;
}

/**
 * API response for conversation creation
 */
export interface CreateConversationResponse {
  success: boolean;
  conversation?: Conversation;
  error?: string;
}

/**
 * API response for message addition
 */
export interface AddMessageResponse {
  success: boolean;
  message?: ConversationMessage;
  error?: string;
}

/**
 * Onboarding step definition
 */
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  href?: string;
}

/**
 * User settings with onboarding fields
 */
export interface UserSettingsWithOnboarding {
  id: string;
  preferred_model: 'groq' | 'openrouter' | 'ollama';
  groq_api_key: string | null;
  openrouter_api_key: string | null;
  ollama_url: string | null;
  onboarding_completed: boolean;
  onboarding_steps_completed: string[];
  created_at: string;
}

/**
 * Usage statistics for dashboard
 */
export interface UsageStats {
  total_conversations: number;
  total_messages: number;
  total_documents: number;
  documents_ready: number;
  documents_pending: number;
  total_bots: number;
  bots_published: number;
}
