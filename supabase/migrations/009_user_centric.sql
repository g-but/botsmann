-- User-Centric Architecture Migration
-- Adds user profiles and domain tagging for personalized AI interactions
--
-- This migration follows these principles:
-- - SSOT: Domain validation happens in application layer (lib/domains.ts)
-- - SoC: Database handles storage, app handles business logic
-- - Scalable: Proper indexes for common query patterns
-- - Extensible: TEXT[] for domains allows easy expansion

-- ============================================
-- User Profiles Table
-- ============================================
-- Stores user preferences and metadata separately from auth.users
-- This allows us to track user-specific data without modifying auth schema

CREATE TABLE IF NOT EXISTS user_profiles (
  -- Primary key matches auth.users.id for 1:1 relationship
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- User preferences
  display_name TEXT,
  preferred_language TEXT DEFAULT 'en',
  timezone TEXT,

  -- Domain engagement (which professionals user has interacted with)
  -- Domains validated at application layer via lib/domains.ts
  active_domains TEXT[] DEFAULT '{}',

  -- Denormalized stats for quick dashboard access
  -- Updated via triggers when conversations/documents change
  total_conversations INTEGER DEFAULT 0,
  total_documents INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for finding recently active users (analytics, cleanup)
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_active
  ON user_profiles(last_active_at DESC);

-- ============================================
-- Row Level Security for user_profiles
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- Add domains to documents table
-- ============================================
-- Allows filtering documents by domain for professional-specific retrieval

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS domains TEXT[] DEFAULT '{}';

-- GIN index for efficient array containment queries
-- e.g., WHERE domains @> ARRAY['legal']
CREATE INDEX IF NOT EXISTS idx_documents_domains
  ON documents USING GIN(domains);

-- ============================================
-- Add professional_slug to conversations table
-- ============================================
-- Tracks which professional (Lex, Heidi, etc.) the conversation is with

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS professional_slug TEXT;

-- Index for filtering conversations by professional
CREATE INDEX IF NOT EXISTS idx_conversations_professional
  ON conversations(professional_slug);

-- ============================================
-- Update bot_type constraint to include 'professional'
-- ============================================

-- First drop the old constraint
ALTER TABLE conversations
  DROP CONSTRAINT IF EXISTS conversations_bot_type_check;

-- Add new constraint with 'professional' type
ALTER TABLE conversations
  ADD CONSTRAINT conversations_bot_type_check
  CHECK (bot_type IN ('documents', 'custom_bot', 'demo', 'professional'));

-- ============================================
-- Trigger: Auto-update user_profiles.updated_at
-- ============================================

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Trigger: Update user stats on conversation insert
-- ============================================

CREATE OR REPLACE FUNCTION update_user_conversation_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update conversation count
  UPDATE user_profiles
  SET
    total_conversations = (
      SELECT COUNT(*) FROM conversations WHERE user_id = NEW.user_id
    ),
    last_active_at = NOW()
  WHERE id = NEW.user_id;

  -- Add professional's domain to active_domains if not already present
  IF NEW.professional_slug IS NOT NULL THEN
    UPDATE user_profiles
    SET active_domains = array_append(
      active_domains,
      CASE NEW.professional_slug
        WHEN 'legal' THEN 'legal'
        WHEN 'health' THEN 'health'
        WHEN 'research' THEN 'research'
        WHEN 'language' THEN 'language'
        WHEN 'creative' THEN 'creative'
        WHEN 'business' THEN 'business'
        ELSE 'general'
      END
    )
    WHERE id = NEW.user_id
    AND NOT active_domains @> ARRAY[
      CASE NEW.professional_slug
        WHEN 'legal' THEN 'legal'
        WHEN 'health' THEN 'health'
        WHEN 'research' THEN 'research'
        WHEN 'language' THEN 'language'
        WHEN 'creative' THEN 'creative'
        WHEN 'business' THEN 'business'
        ELSE 'general'
      END
    ];
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_user_stats_on_conversation
  AFTER INSERT ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_user_conversation_count();

-- ============================================
-- Trigger: Update user stats on document insert
-- ============================================

CREATE OR REPLACE FUNCTION update_user_document_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET
    total_documents = (
      SELECT COUNT(*) FROM documents WHERE user_id = NEW.user_id
    ),
    last_active_at = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_user_stats_on_document
  AFTER INSERT ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_user_document_count();

-- ============================================
-- Helper: Ensure user profile exists
-- ============================================
-- Call this from application code when user first authenticates
-- Creates profile if it doesn't exist, returns existing if it does

CREATE OR REPLACE FUNCTION ensure_user_profile(p_user_id UUID)
RETURNS user_profiles AS $$
DECLARE
  profile user_profiles;
BEGIN
  -- Try to get existing profile
  SELECT * INTO profile FROM user_profiles WHERE id = p_user_id;

  -- Create if doesn't exist
  IF NOT FOUND THEN
    INSERT INTO user_profiles (id)
    VALUES (p_user_id)
    RETURNING * INTO profile;
  END IF;

  RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
