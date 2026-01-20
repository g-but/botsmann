/**
 * Bot Demo Configuration and Types
 *
 * This module provides configuration for the unified demo system.
 */

// Configuration
export {
  botDemoConfigs,
  getBotDemoConfig,
  getAvailableDemoBotSlugs,
  // Individual bot configs for reference
  lexConfig,
  imhotepConfig,
  heidiConfig,
  nerdConfig,
  tridentConfig,
  museConfig,
} from './botDemoConfigs';

// Types
export type {
  // Core types
  BotDemoConfig,
  DemoState,
  DemoStep,
  DemoActions,
  UseDemoStateReturn,

  // Intake types
  IntakeQuestion,
  IntakeQuestionType,
  IntakePhase,
  IntakeResponses,

  // File types
  FileCategory,
  UploadedFile,

  // Chat types
  ChatMessage,
  ChatSource,

  // Output types
  DemoOutputConfig,

  // API types
  DemoChatRequest,
  DemoChatResponse,
} from './types';
