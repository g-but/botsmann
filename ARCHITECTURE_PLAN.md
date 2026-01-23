# User-Centric Architecture Plan

## Vision

**"The USER is the constant. The professionals are lenses/interfaces into the user's world."**

The user is the center of the system. Documents are stored once and tagged by domain. Context accumulates over time. Professionals (Lex, Heidi, Nerd, etc.) are specialized interfaces that help users interact with their data through domain-specific expertise.

---

## Current State Analysis

### Existing Tables (8)

- `user_settings` - AI model preferences, API keys
- `documents` - User uploaded documents
- `document_chunks` - Chunks with pgvector embeddings (384d)
- `custom_bots` - User-created bots
- `bot_knowledge_chunks` - Bot-specific knowledge
- `conversations` - Chat sessions (bot_type, bot_id, document_id)
- `conversation_messages` - Messages with sources
- `waitlist` - Public signups

### What's Missing

1. **No dedicated user profile table** - user data scattered in `auth.users.user_metadata`
2. **No accumulated user context** - each conversation starts fresh
3. **Documents tied to conversations** - not domain-tagged for cross-professional access
4. **No user knowledge extraction** - facts learned about user aren't persisted

---

## Proposed Architecture

### Phase 1: User Foundation

#### New Table: `user_profiles`

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  display_name TEXT,
  preferred_language TEXT DEFAULT 'en',
  timezone TEXT,

  -- Onboarding state
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step TEXT,

  -- Domain preferences (which professionals they've engaged with)
  active_domains TEXT[] DEFAULT '{}',  -- ['legal', 'health', 'language', ...]

  -- Usage stats
  total_conversations INTEGER DEFAULT 0,
  total_documents INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Users can only access their own profile
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);
```

#### New Table: `user_context`

Stores accumulated facts/knowledge about the user extracted from conversations.

```sql
CREATE TABLE user_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- The fact/context
  content TEXT NOT NULL,

  -- Domain tagging (can belong to multiple domains)
  domains TEXT[] DEFAULT '{}',  -- ['legal', 'health', 'general']

  -- Source tracking
  source_type TEXT,  -- 'conversation', 'document', 'user_input'
  source_id UUID,    -- conversation_id or document_id

  -- Relevance and recency
  confidence FLOAT DEFAULT 1.0,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  use_count INTEGER DEFAULT 0,

  -- Embedding for semantic search
  embedding vector(384),

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_context_user_id ON user_context(user_id);
CREATE INDEX idx_user_context_domains ON user_context USING GIN(domains);
CREATE INDEX idx_user_context_embedding ON user_context USING ivfflat (embedding vector_cosine_ops);

-- RLS
ALTER TABLE user_context ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own context" ON user_context
  FOR ALL USING (auth.uid() = user_id);
```

### Phase 2: Domain-Tagged Documents

#### Modify: `documents` table

Add domain tagging to existing documents table.

```sql
-- Add domain tagging
ALTER TABLE documents ADD COLUMN IF NOT EXISTS domains TEXT[] DEFAULT '{}';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS auto_detected_domain TEXT;

-- Index for domain queries
CREATE INDEX IF NOT EXISTS idx_documents_domains ON documents USING GIN(domains);
```

**Domain Detection Logic:**

- Auto-detect domain based on content analysis during upload
- User can manually adjust/add domains
- Domains: `legal`, `health`, `research`, `language`, `creative`, `business`, `general`

### Phase 3: Smart Context Retrieval

#### New Function: `get_relevant_context`

Retrieves user context relevant to current conversation.

```sql
CREATE OR REPLACE FUNCTION get_relevant_context(
  p_user_id UUID,
  p_query_embedding vector(384),
  p_domains TEXT[] DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  domains TEXT[],
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    uc.id,
    uc.content,
    uc.domains,
    1 - (uc.embedding <=> p_query_embedding) as similarity
  FROM user_context uc
  WHERE uc.user_id = p_user_id
    AND uc.is_active = TRUE
    AND (p_domains IS NULL OR uc.domains && p_domains)
  ORDER BY uc.embedding <=> p_query_embedding
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Phase 4: Conversation Flow

#### Updated Conversation Model

```
User sends message
    ↓
[1] Get user profile & preferences
    ↓
[2] Embed query
    ↓
[3] Retrieve relevant context:
    - User context (facts about user)
    - Relevant documents (domain-filtered)
    - Recent conversation history
    ↓
[4] Build system prompt:
    - Professional's base personality
    - User context section
    - Relevant document excerpts
    ↓
[5] Generate response
    ↓
[6] Extract & store new user context (async)
    - "User mentioned they live in Zurich"
    - "User is preparing for immigration"
    ↓
[7] Return response
```

### Phase 5: Professional as Lens

Each professional has access to:

1. **Their domain's documents** - Lex sees legal docs, Imhotep sees health docs
2. **Relevant user context** - filtered by domain + general
3. **Cross-domain context** - with explicit user permission

#### Professional Configuration

```typescript
interface Professional {
  slug: string;
  name: string;
  domains: string[]; // Primary domains
  canAccessDomains: string[]; // Additional domains they might reference
  contextPrompt: string; // How to use user context
}

// Example
const lex: Professional = {
  slug: 'legal',
  name: 'Lex',
  domains: ['legal'],
  canAccessDomains: ['legal', 'business', 'general'],
  contextPrompt: `You have access to the user's legal documents and relevant
    context about their legal situation. Use this to provide personalized advice.`,
};
```

---

## Implementation Phases

### Phase 1: Database Foundation (Week 1)

- [ ] Create `user_profiles` table with RLS
- [ ] Create `user_context` table with RLS
- [ ] Add domain field to `documents` table
- [ ] Create database functions for context retrieval
- [ ] Write migrations

### Phase 2: Context Extraction (Week 2)

- [ ] Build context extraction service
- [ ] Extract facts from conversation messages (async)
- [ ] Domain classification for extracted facts
- [ ] Embedding generation for context items

### Phase 3: Smart Retrieval (Week 2-3)

- [ ] Update chat API to fetch user context
- [ ] Implement domain filtering
- [ ] Build context injection into prompts
- [ ] Add relevance scoring

### Phase 4: Document Domain Tagging (Week 3)

- [ ] Auto-detect document domain on upload
- [ ] UI for manual domain adjustment
- [ ] Update document search to respect domains

### Phase 5: Cross-Domain Features (Week 4)

- [ ] User settings for cross-domain sharing
- [ ] Professional handoff ("Let me connect you with Imhotep for the health aspects")
- [ ] Unified conversation view across professionals

---

## API Changes

### New Endpoints

```
POST /api/user/profile
GET  /api/user/profile
PATCH /api/user/profile

GET  /api/user/context
POST /api/user/context/extract  (async extraction from conversation)
DELETE /api/user/context/:id

PATCH /api/documents/:id/domains
```

### Updated Endpoints

```
POST /api/chat
  - Now includes: user context retrieval
  - Now includes: async context extraction
  - Now includes: domain-filtered document search

GET /api/conversations
  - Add: filter by professional/domain
  - Add: cross-professional view
```

---

## Data Flow Example

**Scenario: User uploads immigration documents, then asks Lex a question**

1. **Document Upload**
   - User uploads "visa_application.pdf"
   - System auto-detects domain: `legal`
   - Chunks created with embeddings

2. **First Conversation with Lex**
   - User: "I'm applying for a Swiss work permit"
   - System retrieves: visa_application chunks
   - Lex responds with advice
   - **Context extracted**:
     - "User is applying for Swiss work permit"
     - "User has document: visa_application.pdf"

3. **Later Conversation with Lex**
   - User: "What documents do I need?"
   - System retrieves:
     - User context: "applying for Swiss work permit"
     - Documents: visa_application chunks
   - Lex: "Based on your Swiss work permit application, you'll need..."

4. **Conversation with Heidi (Language)**
   - User: "Help me practice for my German test"
   - System retrieves:
     - User context: "applying for Swiss work permit" (general relevant)
     - No health/language documents yet
   - Heidi: "Since you're moving to Switzerland, let's focus on practical German for your permit process..."

---

## Privacy & Control

### User Controls

- View all extracted context
- Delete specific context items
- Toggle cross-domain sharing
- Export all data
- Delete account (cascades all data)

### System Safeguards

- All tables have RLS
- Context extraction is transparent
- User can see what each professional "knows"
- No sharing between users ever

---

## Success Metrics

1. **Engagement**: Users return to same professional multiple times
2. **Context Quality**: Professional responses reference user history accurately
3. **Cross-Domain**: Users engage with multiple professionals
4. **Document Reuse**: Same document referenced across conversations
5. **Context Growth**: User context items grow over time

---

## Open Questions

1. **Context Limits**: How much context to retrieve per query? (Start with 10 items)
2. **Context Decay**: Should old context be deprioritized? (Yes, use last_used_at)
3. **Extraction Frequency**: Every message or end of conversation? (Every message, async)
4. **Domain Boundaries**: Strict or fuzzy? (Fuzzy - domains are hints, not walls)

---

## Next Steps

1. Review and approve this plan
2. Create database migrations
3. Implement Phase 1 (user_profiles, user_context tables)
4. Update chat API with basic context retrieval
5. Build context extraction service
