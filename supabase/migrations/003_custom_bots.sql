-- Custom Bots Schema
-- Enables users to create their own AI assistants with custom expertise

-- ============================================
-- Custom Bots Table
-- ============================================

CREATE TABLE IF NOT EXISTS custom_bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identity
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,

  -- Appearance
  emoji TEXT DEFAULT '🤖',
  accent_color TEXT DEFAULT 'blue' CHECK (accent_color IN ('blue', 'green', 'indigo', 'red', 'amber')),

  -- Behavior
  system_prompt TEXT NOT NULL,

  -- Navigation config (stored as JSONB for flexibility)
  nav_config JSONB DEFAULT '{"menuItems": []}',

  -- Publishing
  is_published BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false, -- If true, anyone can chat with this bot

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique slug per user
  CONSTRAINT unique_user_bot_slug UNIQUE (user_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_custom_bots_user_id ON custom_bots(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_bots_slug ON custom_bots(slug);
CREATE INDEX IF NOT EXISTS idx_custom_bots_is_public ON custom_bots(is_public) WHERE is_public = true;

-- ============================================
-- Bot Knowledge Chunks Table
-- ============================================

CREATE TABLE IF NOT EXISTS bot_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID NOT NULL REFERENCES custom_bots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  topic TEXT,
  question TEXT, -- Optional: if this chunk answers a specific question
  content TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',

  -- Vector embedding for semantic search
  embedding VECTOR(384),

  -- Metadata
  source TEXT, -- e.g., "manual", "document:uuid", "url:https://..."
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bot_knowledge_bot_id ON bot_knowledge_chunks(bot_id);
CREATE INDEX IF NOT EXISTS idx_bot_knowledge_user_id ON bot_knowledge_chunks(user_id);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE custom_bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- Custom Bots Policies
CREATE POLICY "Users can view own bots"
  ON custom_bots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public bots"
  ON custom_bots FOR SELECT
  USING (is_public = true AND is_published = true);

CREATE POLICY "Users can insert own bots"
  ON custom_bots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bots"
  ON custom_bots FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bots"
  ON custom_bots FOR DELETE
  USING (auth.uid() = user_id);

-- Bot Knowledge Policies
CREATE POLICY "Users can view own bot knowledge"
  ON bot_knowledge_chunks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public bot knowledge"
  ON bot_knowledge_chunks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM custom_bots
      WHERE custom_bots.id = bot_knowledge_chunks.bot_id
      AND custom_bots.is_public = true
      AND custom_bots.is_published = true
    )
  );

CREATE POLICY "Users can insert own bot knowledge"
  ON bot_knowledge_chunks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bot knowledge"
  ON bot_knowledge_chunks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bot knowledge"
  ON bot_knowledge_chunks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Helper Functions
-- ============================================

-- Function to search bot knowledge chunks by similarity
CREATE OR REPLACE FUNCTION match_bot_knowledge(
  query_embedding VECTOR(384),
  target_bot_id UUID,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  topic TEXT,
  question TEXT,
  content TEXT,
  keywords TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bkc.id,
    bkc.topic,
    bkc.question,
    bkc.content,
    bkc.keywords,
    1 - (bkc.embedding <=> query_embedding) AS similarity
  FROM bot_knowledge_chunks bkc
  WHERE bkc.bot_id = target_bot_id
    AND bkc.embedding IS NOT NULL
  ORDER BY bkc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Auto-update updated_at for custom_bots
CREATE TRIGGER update_custom_bots_updated_at
  BEFORE UPDATE ON custom_bots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
