/**
 * Bot Builder Wizard State Hook
 * @module lib/hooks/useBotBuilder
 *
 * Manages multi-step wizard state for creating custom bots
 */

import { useState, useCallback } from 'react';
import type { BotAccentColor } from '@/types/bot';

export interface BotBuilderState {
  // Step 1: Basic Info
  slug: string;
  title: string;
  description: string;

  // Step 2: Personality
  emoji: string;
  accentColor: BotAccentColor;
  systemPrompt: string;

  // Step 3: Knowledge
  knowledgeChunks: KnowledgeChunkDraft[];

  // Meta
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;
}

export interface KnowledgeChunkDraft {
  id: string; // Client-side ID for list key
  topic: string;
  content: string;
  keywords: string[];
}

const INITIAL_STATE: BotBuilderState = {
  slug: '',
  title: '',
  description: '',
  emoji: '🤖',
  accentColor: 'blue',
  systemPrompt: '',
  knowledgeChunks: [],
  currentStep: 1,
  isSubmitting: false,
  error: null,
};

const TOTAL_STEPS = 4;

export interface UseBotBuilderReturn {
  state: BotBuilderState;
  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLastStep: boolean;
  totalSteps: number;
  // Updates
  updateBasicInfo: (data: Partial<Pick<BotBuilderState, 'slug' | 'title' | 'description'>>) => void;
  updatePersonality: (
    data: Partial<Pick<BotBuilderState, 'emoji' | 'accentColor' | 'systemPrompt'>>,
  ) => void;
  addKnowledgeChunk: (chunk: Omit<KnowledgeChunkDraft, 'id'>) => void;
  removeKnowledgeChunk: (id: string) => void;
  updateKnowledgeChunk: (id: string, data: Partial<Omit<KnowledgeChunkDraft, 'id'>>) => void;
  // Submission
  setSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  // Validation
  validateCurrentStep: () => boolean;
  getStepErrors: () => string[];
}

/**
 * Generate unique client-side ID
 */
function generateId(): string {
  return `chunk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Hook for managing bot builder wizard state
 */
export function useBotBuilder(): UseBotBuilderReturn {
  const [state, setState] = useState<BotBuilderState>(INITIAL_STATE);

  // Navigation
  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS),
      error: null,
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
      error: null,
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setState((prev) => ({ ...prev, currentStep: step, error: null }));
    }
  }, []);

  // Updates
  const updateBasicInfo = useCallback(
    (data: Partial<Pick<BotBuilderState, 'slug' | 'title' | 'description'>>) => {
      setState((prev) => ({ ...prev, ...data, error: null }));
    },
    [],
  );

  const updatePersonality = useCallback(
    (data: Partial<Pick<BotBuilderState, 'emoji' | 'accentColor' | 'systemPrompt'>>) => {
      setState((prev) => ({ ...prev, ...data, error: null }));
    },
    [],
  );

  const addKnowledgeChunk = useCallback((chunk: Omit<KnowledgeChunkDraft, 'id'>) => {
    setState((prev) => ({
      ...prev,
      knowledgeChunks: [...prev.knowledgeChunks, { ...chunk, id: generateId() }],
      error: null,
    }));
  }, []);

  const removeKnowledgeChunk = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      knowledgeChunks: prev.knowledgeChunks.filter((c) => c.id !== id),
    }));
  }, []);

  const updateKnowledgeChunk = useCallback(
    (id: string, data: Partial<Omit<KnowledgeChunkDraft, 'id'>>) => {
      setState((prev) => ({
        ...prev,
        knowledgeChunks: prev.knowledgeChunks.map((c) => (c.id === id ? { ...c, ...data } : c)),
      }));
    },
    [],
  );

  // Submission helpers
  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setState((prev) => ({ ...prev, isSubmitting }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // Validation
  const getStepErrors = useCallback((): string[] => {
    const errors: string[] = [];

    switch (state.currentStep) {
      case 1:
        if (!state.title.trim()) errors.push('Title is required');
        if (state.title.length < 3) errors.push('Title must be at least 3 characters');
        if (!state.slug.trim()) errors.push('Slug is required');
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(state.slug)) {
          errors.push('Slug must be lowercase with hyphens only (e.g., "hr-advisor")');
        }
        break;
      case 2:
        if (!state.systemPrompt.trim()) errors.push('System prompt is required');
        if (state.systemPrompt.length < 50) {
          errors.push('System prompt must be at least 50 characters');
        }
        break;
      case 3:
        // Knowledge is optional, no validation errors
        break;
      case 4:
        // Review step - aggregate all errors
        if (!state.title.trim()) errors.push('Title is required');
        if (!state.slug.trim()) errors.push('Slug is required');
        if (!state.systemPrompt.trim()) errors.push('System prompt is required');
        break;
    }

    return errors;
  }, [state]);

  const validateCurrentStep = useCallback((): boolean => {
    return getStepErrors().length === 0;
  }, [getStepErrors]);

  return {
    state,
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    canGoNext: state.currentStep < TOTAL_STEPS,
    canGoPrev: state.currentStep > 1,
    isLastStep: state.currentStep === TOTAL_STEPS,
    totalSteps: TOTAL_STEPS,
    // Updates
    updateBasicInfo,
    updatePersonality,
    addKnowledgeChunk,
    removeKnowledgeChunk,
    updateKnowledgeChunk,
    // Submission
    setSubmitting,
    setError,
    reset,
    // Validation
    validateCurrentStep,
    getStepErrors,
  };
}
