/**
 * Document types for the RAG system
 */

import { type DocumentStatusType } from '@/lib/constants';

export interface Document {
  id: string;
  user_id: string;
  name: string;
  type: string;
  size_bytes: number;
  storage_path: string;
  status: DocumentStatusType;
  error_message?: string;
  chunk_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  user_id: string;
  content: string;
  embedding: number[];
  metadata: {
    chunk_index: number;
    start_char?: number;
    end_char?: number;
  };
  created_at: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  document?: Document;
  error?: string;
}

export interface DocumentListResponse {
  success: boolean;
  documents?: Document[];
  error?: string;
}

export interface DocumentSearchResult {
  chunk_id: string;
  document_id: string;
  document_name: string;
  content: string;
  similarity: number;
}

export interface SearchResponse {
  success: boolean;
  results?: DocumentSearchResult[];
  error?: string;
}

export type SupportedFileType = 'text/plain' | 'text/markdown' | 'application/pdf';

export const SUPPORTED_FILE_TYPES: SupportedFileType[] = [
  'text/plain',
  'text/markdown',
  'application/pdf',
];

// Re-exported from SSOT for convenience
export { VALIDATION } from '@/lib/constants';
