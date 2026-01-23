-- Database Optimizations and Best Practices
-- Performance indexes, constraints, and helpful functions

-- ============================================
-- Performance Indexes
-- ============================================

-- Email search on consultations (for looking up existing consultations)
CREATE INDEX IF NOT EXISTS idx_consultations_email ON consultations(email);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_documents_user_status ON documents(user_id, status);
CREATE INDEX IF NOT EXISTS idx_custom_bots_user_published ON custom_bots(user_id, is_published);

-- Text search indexes using pg_trgm for fuzzy matching
CREATE INDEX IF NOT EXISTS idx_consultations_name_trgm ON consultations USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_custom_bots_title_trgm ON custom_bots USING gin(title gin_trgm_ops);

-- ============================================
-- Table Comments (Documentation)
-- ============================================

COMMENT ON TABLE consultations IS 'Contact form submissions and consultation requests';
COMMENT ON TABLE user_settings IS 'User preferences for LLM models and API keys';
COMMENT ON TABLE documents IS 'Uploaded documents for RAG and knowledge base';
COMMENT ON TABLE document_chunks IS 'Text chunks from documents with vector embeddings for semantic search';
COMMENT ON TABLE custom_bots IS 'User-created custom AI assistants with specialized knowledge';
COMMENT ON TABLE bot_knowledge_chunks IS 'Knowledge base chunks for custom bots with vector embeddings';

-- ============================================
-- Additional Constraints
-- ============================================

-- Ensure email format is valid (basic check)
ALTER TABLE consultations
DROP CONSTRAINT IF EXISTS consultations_email_format;

ALTER TABLE consultations
ADD CONSTRAINT consultations_email_format
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Ensure document sizes are positive
ALTER TABLE documents
DROP CONSTRAINT IF EXISTS documents_size_positive;

ALTER TABLE documents
ADD CONSTRAINT documents_size_positive
CHECK (size_bytes IS NULL OR size_bytes >= 0);

-- Ensure chunk count is non-negative
ALTER TABLE documents
DROP CONSTRAINT IF EXISTS documents_chunk_count_nonnegative;

ALTER TABLE documents
ADD CONSTRAINT documents_chunk_count_nonnegative
CHECK (chunk_count >= 0);

-- ============================================
-- Helpful Utility Functions
-- ============================================

-- Function to get user's custom bots count
CREATE OR REPLACE FUNCTION get_user_bots_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM custom_bots
  WHERE user_id = user_uuid;
$$;

-- Function to get document processing statistics
CREATE OR REPLACE FUNCTION get_document_stats(user_uuid UUID)
RETURNS TABLE (
  total_documents BIGINT,
  processing_count BIGINT,
  ready_count BIGINT,
  error_count BIGINT,
  total_chunks BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    COUNT(*) as total_documents,
    COUNT(*) FILTER (WHERE status = 'processing') as processing_count,
    COUNT(*) FILTER (WHERE status = 'ready') as ready_count,
    COUNT(*) FILTER (WHERE status = 'error') as error_count,
    COALESCE(SUM(chunk_count), 0) as total_chunks
  FROM documents
  WHERE user_id = user_uuid;
$$;

-- ============================================
-- Search Functions with Better Performance
-- ============================================

-- Improved full-text search for custom bots
CREATE OR REPLACE FUNCTION search_custom_bots(
  search_query TEXT,
  user_uuid UUID DEFAULT NULL,
  include_public BOOLEAN DEFAULT true
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  description TEXT,
  emoji TEXT,
  accent_color TEXT,
  is_public BOOLEAN,
  similarity FLOAT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    cb.id,
    cb.slug,
    cb.title,
    cb.description,
    cb.emoji,
    cb.accent_color,
    cb.is_public,
    similarity(cb.title, search_query) as similarity
  FROM custom_bots cb
  WHERE
    (user_uuid IS NULL OR cb.user_id = user_uuid OR (include_public AND cb.is_public = true))
    AND (
      cb.title ILIKE '%' || search_query || '%'
      OR cb.description ILIKE '%' || search_query || '%'
      OR similarity(cb.title, search_query) > 0.3
    )
  ORDER BY similarity DESC, cb.created_at DESC
  LIMIT 20;
$$;

-- ============================================
-- Cleanup Functions
-- ============================================

-- Function to clean up orphaned document chunks
CREATE OR REPLACE FUNCTION cleanup_orphaned_chunks()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM document_chunks
  WHERE document_id NOT IN (SELECT id FROM documents);

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Function to clean up orphaned bot knowledge chunks
CREATE OR REPLACE FUNCTION cleanup_orphaned_bot_chunks()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM bot_knowledge_chunks
  WHERE bot_id NOT IN (SELECT id FROM custom_bots);

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;
