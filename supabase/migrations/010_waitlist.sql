-- Waitlist Table Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================
-- Waitlist: Email signups with preferences
-- ============================================

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  preferences JSONB DEFAULT '{"events": false, "newsletters": false, "blog": false, "videos": false}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lookups by email
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- No RLS needed - this is a public signup table
-- Service role key handles all operations
