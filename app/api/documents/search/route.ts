/**
 * Document Search API
 *
 * POST /api/documents/search - Semantic search across user's documents
 *
 * Uses pgvector for similarity search with cosine distance
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from '@/lib/embeddings';

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

/**
 * Search for relevant document chunks
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
    const { query, limit = 5, documentId } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query string required' },
        { status: 400 }
      );
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    const supabase = getServiceClient();

    // Use the match_documents function for vector similarity search
    const { data: results, error } = await supabase.rpc('match_documents', {
      query_embedding: `[${queryEmbedding.join(',')}]`,
      match_count: limit,
      filter_user_id: user.id
    });

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { success: false, error: 'Search failed' },
        { status: 500 }
      );
    }

    // If documentId filter is provided, filter results
    let filteredResults = results || [];
    if (documentId) {
      filteredResults = filteredResults.filter(
        (r: { document_id: string }) => r.document_id === documentId
      );
    }

    // Get document names for the results
    const documentIds = Array.from(new Set(filteredResults.map((r: { document_id: string }) => r.document_id)));

    const { data: documents } = await supabase
      .from('documents')
      .select('id, name')
      .in('id', documentIds);

    const documentMap = new Map(
      (documents || []).map((d: { id: string; name: string }) => [d.id, d.name])
    );

    // Format results
    const formattedResults = filteredResults.map((r: {
      id: string;
      document_id: string;
      content: string;
      similarity: number;
    }) => ({
      chunk_id: r.id,
      document_id: r.document_id,
      document_name: documentMap.get(r.document_id) || 'Unknown',
      content: r.content,
      similarity: r.similarity
    }));

    return NextResponse.json({
      success: true,
      results: formattedResults,
      query
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
