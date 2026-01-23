-- Conversations and Onboarding Schema
-- Enables persistent chat history and user onboarding tracking

-- ============================================
-- Conversations Table
-- ============================================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Metadata
  title TEXT NOT NULL DEFAULT 'New Conversation',
  bot_type TEXT NOT NULL DEFAULT 'documents' CHECK (bot_type IN ('documents', 'custom_bot', 'demo')),

  -- Optional references
  bot_id UUID REFERENCES custom_bots(id) ON DELETE SET NULL,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,

  -- Stats
  message_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for conversations
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_bot_type ON conversations(bot_type);

-- ============================================
-- Conversation Messages Table
-- ============================================

CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,

  -- Sources for RAG responses (stored as JSONB)
  sources JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON conversation_messages(created_at);

-- ============================================
-- User Settings Updates (Onboarding)
-- ============================================

-- Add onboarding fields to user_settings
ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_steps_completed JSONB DEFAULT '[]';

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

-- Conversations Policies
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Message Policies
CREATE POLICY "Users can view own messages"
  ON conversation_messages FOR SELECT
  USING (
    conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own messages"
  ON conversation_messages FOR INSERT
  WITH CHECK (
    conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own messages"
  ON conversation_messages FOR DELETE
  USING (
    conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
  );

-- ============================================
-- Helper Functions
-- ============================================

-- Function to update conversation's updated_at and message_count
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET
    updated_at = NOW(),
    message_count = (
      SELECT COUNT(*) FROM conversation_messages
      WHERE conversation_id = NEW.conversation_id
    )
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update conversation on new message
CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON conversation_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- Auto-update updated_at for conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Auto-generate title from first message
-- ============================================

CREATE OR REPLACE FUNCTION generate_conversation_title()
RETURNS TRIGGER AS $$
DECLARE
  first_msg TEXT;
  msg_count INTEGER;
BEGIN
  -- Only update title if it's still the default
  SELECT COUNT(*) INTO msg_count FROM conversation_messages WHERE conversation_id = NEW.conversation_id;

  IF msg_count = 1 AND NEW.role = 'user' THEN
    -- Get first 50 characters of the message for title
    first_msg := LEFT(NEW.content, 50);
    IF LENGTH(NEW.content) > 50 THEN
      first_msg := first_msg || '...';
    END IF;

    UPDATE conversations
    SET title = first_msg
    WHERE id = NEW.conversation_id AND title = 'New Conversation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-generate title
CREATE TRIGGER auto_generate_conversation_title
  AFTER INSERT ON conversation_messages
  FOR EACH ROW
  EXECUTE FUNCTION generate_conversation_title();
