'use client';

import { useState, useCallback, useMemo } from 'react';
import { getBotDemoConfig } from '@/lib/demo/botDemoConfigs';
import type {
  DemoStep,
  IntakeResponses,
  UploadedFile,
  ChatMessage,
  UseDemoStateReturn,
  DemoChatResponse,
} from '@/lib/demo/types';

/**
 * Generate a unique ID for messages and files
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Build context summary from intake responses for the LLM
 */
function buildContextSummary(
  intakeResponses: IntakeResponses,
  files: UploadedFile[],
  botSlug: string,
): string {
  const config = getBotDemoConfig(botSlug);
  if (!config) return '';

  const parts: string[] = [];

  // Add intake responses
  const responseEntries = Object.entries(intakeResponses).filter(
    ([, value]) => value && (Array.isArray(value) ? value.length > 0 : value.trim() !== ''),
  );

  if (responseEntries.length > 0) {
    parts.push('USER CONTEXT:');
    for (const [questionId, value] of responseEntries) {
      const question = config.intakeQuestions.find((q) => q.id === questionId);
      const label = question?.question || questionId;
      const displayValue = Array.isArray(value) ? value.join(', ') : value;
      parts.push(`- ${label}: ${displayValue}`);
    }
  }

  // Add file information
  const readyFiles = files.filter((f) => f.status === 'ready');
  if (readyFiles.length > 0) {
    parts.push('');
    parts.push('UPLOADED DOCUMENTS:');
    for (const file of readyFiles) {
      parts.push(`- ${file.name} (${file.category || 'uncategorized'})`);
    }
  }

  return parts.join('\n');
}

/**
 * Unified state management hook for bot demos
 */
export function useDemoState(botSlug: string): UseDemoStateReturn {
  const config = getBotDemoConfig(botSlug);

  // Core state
  const [step, setStep] = useState<DemoStep>('intake');
  const [intakeResponses, setIntakeResponses] = useState<IntakeResponses>({});
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Computed context summary
  const contextSummary = useMemo(
    () => buildContextSummary(intakeResponses, files, botSlug),
    [intakeResponses, files, botSlug],
  );

  // Update intake response
  const updateIntake = useCallback((questionId: string, value: string | string[]) => {
    setIntakeResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  // Upload files
  const uploadFiles = useCallback(async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    setIsUploading(true);

    // Add files to state with 'uploading' status
    const uploadingFiles: UploadedFile[] = newFiles.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const,
      uploadedAt: new Date(),
    }));

    setFiles((prev) => [...prev, ...uploadingFiles]);

    // Process each file
    for (const uploadedFile of uploadingFiles) {
      const originalFile = newFiles.find((f) => f.name === uploadedFile.name);
      if (!originalFile) continue;

      try {
        // Upload file
        const formData = new FormData();
        formData.append('file', originalFile);

        const uploadResponse = await fetch('/api/documents', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }

        const uploadResult = await uploadResponse.json();

        // Update status to processing
        setFiles((prev) =>
          prev.map((f) => (f.id === uploadedFile.id ? { ...f, status: 'processing' as const } : f)),
        );

        // Process document
        const processResponse = await fetch('/api/documents/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId: uploadResult.data.id }),
        });

        if (!processResponse.ok) {
          throw new Error('Processing failed');
        }

        // Update to ready
        setFiles((prev) =>
          prev.map((f) => (f.id === uploadedFile.id ? { ...f, status: 'ready' as const } : f)),
        );
      } catch (error) {
        // Update to error status
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id
              ? {
                  ...f,
                  status: 'error' as const,
                  errorMessage: error instanceof Error ? error.message : 'Upload failed',
                }
              : f,
          ),
        );
      }
    }

    setIsUploading(false);
  }, []);

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !config) return;

      setIsLoading(true);

      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Add placeholder assistant message
      const assistantId = generateId();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true,
        },
      ]);

      try {
        const response = await fetch('/api/demo/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content.trim(),
            systemPrompt: config.systemPrompt,
            additionalContext: contextSummary,
          }),
        });

        if (!response.ok) {
          throw new Error('Chat request failed');
        }

        const result: { success: boolean; data: DemoChatResponse } = await response.json();

        // Update assistant message with response
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: result.data.response,
                  sources: result.data.sources,
                  isStreaming: false,
                }
              : m,
          ),
        );
      } catch (error) {
        // Update with error message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "I'm sorry, I encountered an error processing your request. Please try again.",
                  isStreaming: false,
                }
              : m,
          ),
        );
      }

      setIsLoading(false);
    },
    [config, contextSummary],
  );

  // Start chat (transition from intake to chat)
  const startChat = useCallback(() => {
    if (!config) return;

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: config.welcomeMessage,
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
    setStep('chat');
  }, [config]);

  // Reset all state
  const reset = useCallback(() => {
    setStep('intake');
    setIntakeResponses({});
    setFiles([]);
    setMessages([]);
    setIsLoading(false);
    setIsUploading(false);
  }, []);

  return {
    // State
    step,
    intakeResponses,
    files,
    messages,
    isLoading,
    isUploading,
    contextSummary,

    // Actions
    updateIntake,
    uploadFiles,
    removeFile,
    sendMessage,
    startChat,
    reset,
  };
}
