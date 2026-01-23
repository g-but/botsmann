-- Ensure required PostgreSQL extensions are installed
-- This migration ensures all necessary extensions are available

-- pgvector for embeddings (already in 001, but ensuring it's there)
CREATE EXTENSION IF NOT EXISTS vector;

-- pgcrypto for generating random UUIDs and encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- pg_trgm for trigram text search (useful for fuzzy matching)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
