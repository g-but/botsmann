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
  try {
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, documentId, contextSize = 5 } = body;

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
      return NextResponse.json({
        success: true,
        response: "You don't have any processed documents yet. Please upload and process some documents first, then I can answer questions about them.",
        sources: [],
        provider
      });
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(message);

    // Search for relevant chunks
    const { data: searchResults, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: `[${queryEmbedding.join(',')}]`,
      match_count: contextSize,
      filter_user_id: user.id
    });

    if (searchError) {
      console.error('Search error:', searchError);
      return NextResponse.json(
        { success: false, error: 'Failed to search documents' },
        { status: 500 }
      );
    }

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

    // Build context from relevant chunks
    const contextParts = relevantChunks.map((chunk: {
      document_id: string;
      content: string;
      similarity: number;
    }, index: number) => {
      const docName = documentMap.get(chunk.document_id) || 'Unknown Document';
      return `[Source ${index + 1}: ${docName}]\n${chunk.content}`;
    });

    const context = contextParts.join('\n\n---\n\n');

    // Generate response using LLM
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

    // Format sources for response
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

    return NextResponse.json({
      success: true,
      response: llmResponse.content,
      sources,
      provider: llmResponse.provider,
      model: llmResponse.model
    });

  } catch (error) {
    console.error('Chat error:', error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      }
      if (error.message.includes('Cannot connect to Ollama')) {
        return NextResponse.json(
          { success: false, error: 'Cannot connect to Ollama. Make sure it is running.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
