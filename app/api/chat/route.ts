/**
 * RAG Chat API
 *
 * POST /api/chat - Chat with documents using RAG
 *
 * Flow:
 * 1. Search for relevant document chunks
 * 2. Build context from retrieved chunks
 * 3. Generate response using user's preferred LLM
 */

/* eslint-disable no-console */

import { type NextRequest } from 'next/server';
import { generateEmbedding } from '@/lib/embeddings';
import { generateLLMResponse, type ModelProvider } from '@/lib/llm-client';
import { getServiceClient } from '@/lib/supabase';
import { verifyUser } from '@/lib/api-utils';
import { jsonSuccess, jsonError, jsonUnauthorized, HTTP_STATUS } from '@/lib/api';
import { SYSTEM_PROMPTS, API_CONFIG, DOMAIN_ERRORS } from '@/lib/constants';

// Extend function timeout for model loading (Vercel)
// Note: Free tier max is 10s, Pro tier allows up to 60s
export const maxDuration = 30;

/**
 * Chat with documents using RAG
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('[Chat API] Starting request');

  try {
    console.log('[Chat API] Verifying user...');
    const user = await verifyUser(request);
    if (!user) {
      console.log('[Chat API] User verification failed');
      return jsonUnauthorized();
    }
    console.log('[Chat API] User verified:', user.id, 'Time:', Date.now() - startTime, 'ms');

    const body = await request.json();
    const { message, documentId, contextSize = 3 } = body;
    console.log('[Chat API] Request body parsed, message length:', message?.length);

    // Groq free tier limit is ~6000 tokens (~4 chars per token)
    // Limit context to ~2000 tokens leaving room for system prompt + response
    const MAX_CONTEXT_CHARS = API_CONFIG.MAX_CONTEXT_CHARS;

    if (!message || typeof message !== 'string') {
      return jsonError('Message required', 'VALIDATION_ERROR', HTTP_STATUS.BAD_REQUEST);
    }

    const supabase = getServiceClient();

    // Get user settings for LLM provider
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', user.id)
      .single();

    const provider: ModelProvider = settings?.preferred_model || 'groq';
    const apiKey = provider === 'groq'
      ? settings?.groq_api_key
      : provider === 'openai'
        ? settings?.openai_api_key
        : null;
    const ollamaUrl = settings?.ollama_url;

    // Check if user has any processed documents
    const { count: docCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'ready');

    if (!docCount || docCount === 0) {
      console.log('[Chat API] No documents found for user');
      return jsonSuccess({
        response:
          "You don't have any processed documents yet. Please upload and process some documents first, then I can answer questions about them.",
        sources: [],
        provider,
      });
    }
    console.log('[Chat API] Found', docCount, 'documents. Time:', Date.now() - startTime, 'ms');

    // Generate embedding for the query with timeout
    console.log('[Chat API] Generating query embedding...');
    const embeddingStartTime = Date.now();
    let queryEmbedding: number[];
    try {
      // Timeout for embedding (leave room for LLM call)
      const EMBEDDING_TIMEOUT = API_CONFIG.EMBEDDING_TIMEOUT;
      const embeddingPromise = generateEmbedding(message);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Embedding timeout')), EMBEDDING_TIMEOUT);
      });

      queryEmbedding = await Promise.race([embeddingPromise, timeoutPromise]);
      console.log('[Chat API] Embedding generated in', Date.now() - embeddingStartTime, 'ms');
    } catch (embeddingError) {
      const elapsed = Date.now() - embeddingStartTime;
      console.error('[Chat API] Embedding generation failed after', elapsed, 'ms:', embeddingError);

      // Check if it's a timeout (likely cold start model loading)
      if (
        embeddingError instanceof Error &&
        embeddingError.message === DOMAIN_ERRORS.EMBEDDING_TIMEOUT
      ) {
        return jsonError(
          DOMAIN_ERRORS.SERVICE_WARMING_UP,
          'SERVICE_UNAVAILABLE',
          HTTP_STATUS.SERVICE_UNAVAILABLE
        );
      }

      return jsonError(
        DOMAIN_ERRORS.FAILED_PROCESS_QUERY,
        'SERVICE_UNAVAILABLE',
        HTTP_STATUS.SERVICE_UNAVAILABLE
      );
    }

    // Search for relevant chunks
    console.log('[Chat API] Searching for relevant chunks...');
    const searchStartTime = Date.now();
    const { data: searchResults, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: `[${queryEmbedding.join(',')}]`,
      match_count: contextSize,
      filter_user_id: user.id
    });

    console.log('[Chat API] Search completed in', Date.now() - searchStartTime, 'ms');

    if (searchError) {
      console.error('[Chat API] Search error:', searchError);
      return jsonError('Failed to search documents', 'DATABASE_ERROR', HTTP_STATUS.INTERNAL_ERROR);
    }
    console.log('[Chat API] Found', searchResults?.length || 0, 'relevant chunks');

    // Filter by documentId if provided
    let relevantChunks = searchResults || [];
    if (documentId) {
      relevantChunks = relevantChunks.filter(
        (r: { document_id: string }) => r.document_id === documentId
      );
    }

    // Get document names
    const documentIds = Array.from(new Set(relevantChunks.map((r: { document_id: string }) => r.document_id)));

    const { data: documents } = await supabase
      .from('documents')
      .select('id, name')
      .in('id', documentIds);

    const documentMap = new Map(
      (documents || []).map((d: { id: string; name: string }) => [d.id, d.name])
    );

    // Build context from relevant chunks, respecting token limits
    let totalChars = 0;
    const truncatedChunks: Array<{ document_id: string; content: string; similarity: number }> = [];

    for (const chunk of relevantChunks as Array<{ document_id: string; content: string; similarity: number }>) {
      const chunkLength = chunk.content.length;
      if (totalChars + chunkLength > MAX_CONTEXT_CHARS) {
        // Truncate this chunk to fit
        const remainingSpace = MAX_CONTEXT_CHARS - totalChars;
        if (remainingSpace > 200) {
          truncatedChunks.push({
            ...chunk,
            content: chunk.content.substring(0, remainingSpace) + '... [truncated]'
          });
        }
        break;
      }
      truncatedChunks.push(chunk);
      totalChars += chunkLength;
    }

    const contextParts = truncatedChunks.map((chunk, index: number) => {
      const docName = documentMap.get(chunk.document_id) || 'Unknown Document';
      return `[Source ${index + 1}: ${docName}]\n${chunk.content}`;
    });

    const context = contextParts.join('\n\n---\n\n');

    // Format sources for response (prepare before LLM call)
    const sources = relevantChunks.map((chunk: {
      id: string;
      document_id: string;
      content: string;
      similarity: number;
    }) => ({
      document_id: chunk.document_id,
      document_name: documentMap.get(chunk.document_id) || 'Unknown',
      preview: chunk.content.substring(0, 200) + (chunk.content.length > 200 ? '...' : ''),
      similarity: chunk.similarity
    }));

    // Try to generate response using LLM
    console.log('[Chat API] Calling LLM, provider:', provider, 'context chars:', totalChars);
    const llmStartTime = Date.now();
    try {
      const llmResponse = await generateLLMResponse(
        [
          { role: 'system', content: SYSTEM_PROMPTS.RAG_ASSISTANT },
          {
            role: 'user',
            content: `Context from documents:\n\n${context}\n\n---\n\nUser question: ${message}`
          }
        ],
        {
          provider,
          apiKey,
          ollamaUrl,
          temperature: 0.7,
          maxTokens: 1024
        }
      );

      console.log('[Chat API] LLM response received in', Date.now() - llmStartTime, 'ms');
      console.log('[Chat API] Total request time:', Date.now() - startTime, 'ms');

      return jsonSuccess({
        response: llmResponse.content,
        sources,
        provider: llmResponse.provider,
        model: llmResponse.model,
      });

    } catch (llmError) {
      console.error('[Chat API] LLM call failed after', Date.now() - llmStartTime, 'ms');
      // Handle LLM-specific errors with helpful fallbacks
      if (llmError instanceof Error) {
        // For API key errors, return context-only response
        if (llmError.message.includes('API key') && relevantChunks.length > 0) {
          const fallbackParts = relevantChunks.map(
            (
              chunk: {
                document_id: string;
                content: string;
              },
              index: number
            ) => {
              const docName = documentMap.get(chunk.document_id) || 'Unknown Document';
              return `**[Source ${index + 1}: ${docName}]**\n${chunk.content}`;
            }
          );

          return jsonSuccess({
            response: `Here's what I found in your documents:\n\n${fallbackParts.join('\n\n---\n\n')}`,
            sources,
            provider: 'none',
            model: 'context-only',
          });
        }

        if (llmError.message.includes('Cannot connect to Ollama')) {
          return jsonError(
            DOMAIN_ERRORS.OLLAMA_NOT_RUNNING,
            'SERVICE_UNAVAILABLE',
            HTTP_STATUS.SERVICE_UNAVAILABLE
          );
        }

        // User-friendly error message
        console.error('[Chat API] LLM error:', llmError.message);
        console.error('[Chat API] LLM error stack:', llmError.stack);
        return jsonError(
          DOMAIN_ERRORS.AI_UNAVAILABLE,
          'SERVICE_UNAVAILABLE',
          HTTP_STATUS.SERVICE_UNAVAILABLE
        );
      }

      throw llmError;
    }
  } catch (error) {
    console.error('[Chat API] Unhandled error:', error);
    console.error('[Chat API] Stack:', error instanceof Error ? error.stack : 'no stack');

    return jsonError('Internal server error', 'INTERNAL_ERROR', HTTP_STATUS.INTERNAL_ERROR);
  }
}
