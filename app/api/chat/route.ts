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

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from '@/lib/embeddings';
import { generateLLMResponse, type ModelProvider } from '@/lib/llm-client';

// Server-side Supabase client with service role
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase not configured');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// Verify user from JWT token
async function verifyUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const supabase = getServiceClient();

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return null;
  }

  return user;
}

const SYSTEM_PROMPT = `You are a helpful assistant that answers questions based on the provided document context.

Instructions:
- Only use information from the provided context to answer questions
- If the context doesn't contain relevant information, say so clearly
- Cite which document the information comes from when possible
- Be concise but thorough
- If asked about something not in the documents, acknowledge the limitation

Context from user's documents will be provided below.`;

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
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.log('[Chat API] User verified:', user.id, 'Time:', Date.now() - startTime, 'ms');

    const body = await request.json();
    const { message, documentId, contextSize = 3 } = body;
    console.log('[Chat API] Request body parsed, message length:', message?.length);

    // Groq free tier limit is ~6000 tokens (~4 chars per token)
    // Limit context to ~2000 tokens (8000 chars) leaving room for system prompt + response
    const MAX_CONTEXT_CHARS = 8000;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message required' },
        { status: 400 }
      );
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
      return NextResponse.json({
        success: true,
        response: "You don't have any processed documents yet. Please upload and process some documents first, then I can answer questions about them.",
        sources: [],
        provider
      });
    }
    console.log('[Chat API] Found', docCount, 'documents. Time:', Date.now() - startTime, 'ms');

    // Generate embedding for the query
    console.log('[Chat API] Generating query embedding...');
    const embeddingStartTime = Date.now();
    let queryEmbedding: number[];
    try {
      queryEmbedding = await generateEmbedding(message);
      console.log('[Chat API] Embedding generated in', Date.now() - embeddingStartTime, 'ms');
    } catch (embeddingError) {
      console.error('[Chat API] Embedding generation failed:', embeddingError);
      return NextResponse.json(
        { success: false, error: 'Failed to process query. Please try again.' },
        { status: 503 }
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
      return NextResponse.json(
        { success: false, error: 'Failed to search documents' },
        { status: 500 }
      );
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
          { role: 'system', content: SYSTEM_PROMPT },
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

      return NextResponse.json({
        success: true,
        response: llmResponse.content,
        sources,
        provider: llmResponse.provider,
        model: llmResponse.model
      });

    } catch (llmError) {
      console.error('[Chat API] LLM call failed after', Date.now() - llmStartTime, 'ms');
      // Handle LLM-specific errors with helpful fallbacks
      if (llmError instanceof Error) {
        // For API key errors, return context-only response
        if (llmError.message.includes('API key') && relevantChunks.length > 0) {
          const fallbackParts = relevantChunks.map((chunk: {
            document_id: string;
            content: string;
          }, index: number) => {
            const docName = documentMap.get(chunk.document_id) || 'Unknown Document';
            return `**[Source ${index + 1}: ${docName}]**\n${chunk.content}`;
          });

          return NextResponse.json({
            success: true,
            response: `Here's what I found in your documents:\n\n${fallbackParts.join('\n\n---\n\n')}`,
            sources,
            provider: 'none',
            model: 'context-only'
          });
        }

        if (llmError.message.includes('Cannot connect to Ollama')) {
          return NextResponse.json(
            { success: false, error: 'Cannot connect to Ollama. Make sure it is running.' },
            { status: 503 }
          );
        }

        // User-friendly error message
        console.error('[Chat API] LLM error:', llmError.message);
        console.error('[Chat API] LLM error stack:', llmError.stack);
        return NextResponse.json(
          { success: false, error: 'AI service temporarily unavailable. Please try again in a moment.' },
          { status: 503 }
        );
      }

      throw llmError;
    }

  } catch (error) {
    console.error('[Chat API] Unhandled error:', error);
    console.error('[Chat API] Stack:', error instanceof Error ? error.stack : 'no stack');

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
