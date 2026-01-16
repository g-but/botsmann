/**
 * Document Processing API
 *
 * POST /api/documents/process - Process a pending document
 *
 * This endpoint:
 * 1. Downloads the file from storage
 * 2. Parses the content (TXT, MD, PDF)
 * 3. Chunks the text
 * 4. Generates embeddings
 * 5. Stores chunks in the database
 */

import { type NextRequest } from 'next/server';
import { generateEmbedding, chunkText } from '@/lib/embeddings';
import { getServiceClient } from '@/lib/supabase';
import { verifyUser } from '@/lib/api-utils';
import {
  jsonSuccess,
  jsonError,
  jsonUnauthorized,
  jsonNotFound,
  handleError,
  HTTP_STATUS,
} from '@/lib/api';
import { DOMAIN_ERRORS } from '@/lib/constants';

// Extend function timeout for embedding generation (Vercel)
export const maxDuration = 60; // Allow longer for document processing

/**
 * Parse text content from file based on type
 */
async function parseFileContent(
  fileBuffer: ArrayBuffer,
  fileType: string,
  _fileName: string
): Promise<string> {
  const decoder = new TextDecoder('utf-8');

  switch (fileType) {
    case 'text/plain':
    case 'text/markdown':
      return decoder.decode(fileBuffer);

    case 'application/pdf':
      // For PDF, we'll extract text using a simple approach
      // In production, you'd want pdf-parse or similar
      const pdfText = await extractPdfText(fileBuffer);
      return pdfText;

    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * Simple PDF text extraction
 * Note: This is a basic implementation. For production, use pdf-parse library.
 */
async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  // Convert ArrayBuffer to string and look for text streams
  const bytes = new Uint8Array(buffer);
  let text = '';

  // PDF files contain text in various encodings
  // This is a simplified extraction that won't work for all PDFs
  // For production, install and use pdf-parse: npm install pdf-parse

  try {
    // Try to find text between BT (begin text) and ET (end text) markers
    const content = new TextDecoder('latin1').decode(bytes);

    // Extract text from text objects
    const textMatches = content.match(/\(([^)]*)\)/g);
    if (textMatches) {
      text = textMatches
        .map(m => m.slice(1, -1))
        .filter(t => t.length > 0 && /[a-zA-Z]/.test(t))
        .join(' ');
    }

    // Also try to extract from stream objects
    const streamMatches = content.match(/stream\s*([\s\S]*?)\s*endstream/g);
    if (streamMatches) {
      for (const stream of streamMatches) {
        const streamContent = stream.replace(/stream\s*/, '').replace(/\s*endstream/, '');
        // Look for readable text in streams
        const readableText = streamContent.match(/[a-zA-Z\s.,!?;:'"()-]{10,}/g);
        if (readableText) {
          text += ' ' + readableText.join(' ');
        }
      }
    }

    if (!text.trim()) {
      throw new Error('Could not extract text from PDF. The PDF may be image-based or encrypted.');
    }

    // Clean up the text
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\n]/g, '')
      .trim();

  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Try uploading a text or markdown file.');
  }
}

/**
 * Process a document: parse, chunk, embed, store
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return jsonUnauthorized();
    }

    const body = await request.json();
    const { documentId } = body;

    if (!documentId) {
      return jsonError('Document ID required', 'VALIDATION_ERROR', HTTP_STATUS.BAD_REQUEST);
    }

    const supabase = getServiceClient();

    // Get document and verify ownership
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !document) {
      return jsonNotFound('Document not found');
    }

    // Check if already processed
    if (document.status === 'ready') {
      return jsonSuccess({ document }, 'Document already processed');
    }

    // Update status to processing
    await supabase
      .from('documents')
      .update({ status: 'processing' })
      .eq('id', documentId);

    try {
      // Download file from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('documents')
        .download(document.storage_path);

      if (downloadError || !fileData) {
        throw new Error('Failed to download file from storage');
      }

      // Parse file content
      const fileBuffer = await fileData.arrayBuffer();
      const textContent = await parseFileContent(fileBuffer, document.type, document.name);

      if (!textContent.trim()) {
        throw new Error('No text content found in document');
      }

      // Chunk the text
      const chunks = chunkText(textContent, 500, 50);

      if (chunks.length === 0) {
        throw new Error('Document produced no chunks');
      }

      // Generate embeddings and store chunks
      const chunkRecords = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await generateEmbedding(chunk);

        chunkRecords.push({
          document_id: documentId,
          user_id: user.id,
          content: chunk,
          embedding: `[${embedding.join(',')}]`, // Format for pgvector
          metadata: { chunk_index: i },
        });
      }

      // Insert chunks in batches
      const batchSize = 50;
      for (let i = 0; i < chunkRecords.length; i += batchSize) {
        const batch = chunkRecords.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from('document_chunks')
          .insert(batch);

        if (insertError) {
          console.error('Chunk insert error:', insertError);
          throw new Error('Failed to store document chunks');
        }
      }

      // Update document status
      const { data: updatedDocument } = await supabase
        .from('documents')
        .update({
          status: 'ready',
          chunk_count: chunks.length,
          error_message: null,
        })
        .eq('id', documentId)
        .select()
        .single();

      return jsonSuccess({ document: updatedDocument, chunks_created: chunks.length });
    } catch (processingError) {
      // Update document with error
      const errorMessage =
        processingError instanceof Error ? processingError.message : 'Unknown processing error';

      await supabase
        .from('documents')
        .update({
          status: 'error',
          error_message: errorMessage,
        })
        .eq('id', documentId);

      return jsonError(errorMessage, 'INTERNAL_ERROR', HTTP_STATUS.INTERNAL_ERROR);
    }
  } catch (error) {
    return handleError(error, DOMAIN_ERRORS.FAILED_PROCESS_DOCUMENT);
  }
}
