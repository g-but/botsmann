-- Waitlist table for early signups

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public waitlist)
CREATE POLICY "Allow anonymous insert" ON waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to read their own entries by email (optional)
-- NOTE: Matching by email requires the same email as auth identity; typically we don't expose read.
-- Keeping SELECT closed unless via service role.

COMMENT ON TABLE waitlist IS 'Public waitlist signups with preferences';

