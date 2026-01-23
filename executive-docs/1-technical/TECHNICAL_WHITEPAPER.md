# Botsmann: Privacy-First AI Assistant Platform

## Technical Whitepaper

**Version:** 1.0
**Date:** January 16, 2026
**Authors:** Botsmann Development Team
**Contact:** REDACTED_EMAIL

---

## Abstract

Botsmann is a privacy-first, multi-provider AI assistant platform featuring specialized domain expertise in legal, medical, research, language learning, and creative fields. Built on a modern serverless architecture with Next.js 14, TypeScript, and Supabase, the platform implements Retrieval-Augmented Generation (RAG) to provide accurate, cited responses from user-controlled knowledge bases. Unlike traditional AI assistants that centralize data and lock users into proprietary models, Botsmann offers multi-provider LLM support (Groq, OpenAI, Ollama), client-side embedding generation, and optional self-hosted deployment, ensuring users maintain complete sovereignty over their data.

**Key Innovations:**

- Privacy-preserving architecture with local and self-hosted options
- Multi-provider LLM abstraction layer (Groq/OpenAI/Ollama)
- Client-side embedding generation using WebAssembly transformers
- Domain-specialized AI assistants with custom system prompts
- Vector similarity search using pgvector for accurate RAG

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Architecture](#2-system-architecture)
3. [Technical Stack](#3-technical-stack)
4. [Core Components](#4-core-components)
5. [RAG Implementation](#5-rag-implementation)
6. [LLM Provider Abstraction](#6-llm-provider-abstraction)
7. [Embedding Generation](#7-embedding-generation)
8. [Database Schema](#8-database-schema)
9. [Security Architecture](#9-security-architecture)
10. [Performance Optimization](#10-performance-optimization)
11. [Deployment Architecture](#11-deployment-architecture)
12. [API Reference](#12-api-reference)
13. [Future Roadmap](#13-future-roadmap)
14. [Appendix](#14-appendix)

---

## 1. Introduction

### 1.1 Motivation

The AI assistant landscape is dominated by closed, proprietary systems that:

- Lock users into specific LLM providers
- Centralize sensitive data on third-party servers
- Lack domain specialization for professional use cases
- Provide limited transparency on data usage
- Restrict deployment options for enterprises

Botsmann addresses these limitations through:

1. **Multi-provider architecture**: Support for Groq (free), OpenAI (BYOK), and Ollama (self-hosted)
2. **Privacy-first design**: User data never sent to external services in local mode
3. **Domain specialization**: 6+ specialized AI assistants for specific professional domains
4. **Self-hosted capability**: Full deployment on user infrastructure
5. **RAG transparency**: All responses include source citations

### 1.2 Use Cases

**Professional Applications:**

- **Legal (Lex)**: Case analysis, document review, multi-jurisdictional research (130+ jurisdictions)
- **Medical (Imhotep)**: Evidence-based clinical insights, research literature analysis
- **Research (Nerd)**: Systematic research organization, gap identification, citation management
- **Language Learning (Heidi)**: Swiss German tutoring with cultural context
- **Creative Arts (Muse)**: Style analysis, technique guidance, art history insights
- **Product Management (Trident)**: Project planning, technical direction, workflow optimization

**Enterprise Applications:**

- Internal knowledge base search
- Contract analysis platform
- Compliance documentation system
- Technical documentation hub
- Customer support AI

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 18 + TypeScript (Next.js 14 App Router)       │  │
│  │  ├── Server Components (default)                     │  │
│  │  ├── Client Components (interactive UI)              │  │
│  │  ├── Route Handlers (API endpoints)                  │  │
│  │  └── Middleware (auth, CORS, rate limiting)          │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTPS/TLS
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Business Logic  │  │ RAG Engine      │  │ LLM Client  │ │
│  │ - Validation    │  │ - Chunking      │  │ - Provider  │ │
│  │ - Auth          │  │ - Embedding     │  │   Selection │ │
│  │ - Rate Limit    │  │ - Retrieval     │  │ - Streaming │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└──────────────────────────┬───────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐ ┌───────▼────────┐ ┌──────▼──────────┐
│   LLM Layer    │ │  Data Layer     │ │  External APIs  │
│ - Groq API     │ │ - Supabase      │ │ - AWS SES       │
│ - OpenAI API   │ │   PostgreSQL    │ │ - SendGrid      │
│ - Ollama       │ │ - pgvector      │ │ - Giscus        │
│   (Local)      │ │ - Auth          │ │                 │
│                │ │ - File Storage  │ │                 │
└────────────────┘ └─────────────────┘ └─────────────────┘
```

### 2.2 Data Flow: Document Upload & RAG

```
┌──────────────┐
│ User uploads │
│   document   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 1. File Validation                               │
│    - Type check (PDF, TXT, MD)                   │
│    - Size limit (10MB)                           │
│    - Format verification                         │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 2. Text Extraction                               │
│    - PDF: pdf-parse library                     │
│    - TXT/MD: Direct read                        │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 3. Chunking Strategy                             │
│    - Target: ~512 tokens per chunk               │
│    - Overlap: 50 tokens (10%)                    │
│    - Preserves semantic boundaries               │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 4. Embedding Generation                          │
│    - Model: @xenova/transformers (WebAssembly)   │
│    - Dimension: 384 (MiniLM-L6-v2)               │
│    - Execution: Server-side or client-side       │
│    - Time: 5-8s typical, 15s max (cold start)    │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 5. Storage                                       │
│    - Insert into documents table                │
│    - Insert chunks into document_chunks table    │
│    - Store embeddings in pgvector column         │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│  User Queries │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 6. Query Processing                              │
│    - Embed user question (same model)            │
│    - Vector similarity search (pgvector)         │
│    - Retrieve top-K chunks (K=5 default)         │
│    - Cosine similarity threshold: 0.7            │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 7. Context Assembly                              │
│    - Format retrieved chunks                     │
│    - Add source metadata                         │
│    - Build system + user prompt                  │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 8. LLM Inference                                 │
│    - Select provider (Groq/OpenAI/Ollama)        │
│    - Stream response                             │
│    - Parse citations                             │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 9. Response Rendering                            │
│    - Display markdown formatted response         │
│    - Show source citations                       │
│    - Link to original documents                  │
└──────────────────────────────────────────────────┘
```

---

## 3. Technical Stack

### 3.1 Frontend

| Component         | Technology      | Version | Purpose                      |
| ----------------- | --------------- | ------- | ---------------------------- |
| **Framework**     | Next.js         | 14.x    | React framework with SSR/SSG |
| **Language**      | TypeScript      | 5.x     | Type-safe development        |
| **UI Library**    | React           | 18.2    | Component-based UI           |
| **Styling**       | Tailwind CSS    | 3.4     | Utility-first CSS            |
| **UI Components** | DaisyUI         | 5.0     | Tailwind component library   |
| **Icons**         | Heroicons       | 2.2     | SVG icon library             |
| **Animations**    | Framer Motion   | 12.23   | Declarative animations       |
| **Forms**         | react-hook-form | 7.54    | Form state management        |
| **Validation**    | Zod             | 3.24    | Schema validation            |

### 3.2 Backend

| Component        | Technology            | Version | Purpose                  |
| ---------------- | --------------------- | ------- | ------------------------ |
| **Runtime**      | Node.js               | 18+     | JavaScript runtime       |
| **Framework**    | Next.js API Routes    | 14.x    | Serverless API endpoints |
| **Database**     | PostgreSQL (Supabase) | 15.x    | Relational database      |
| **Vector DB**    | pgvector              | 0.5.x   | Vector similarity search |
| **Auth**         | Supabase Auth         | 2.x     | JWT-based authentication |
| **File Storage** | Supabase Storage      | 2.x     | Object storage           |
| **Email**        | AWS SES               | -       | Transactional email      |
| **Email Client** | Nodemailer            | 7.0     | Email sending library    |

### 3.3 AI/ML

| Component         | Technology           | Version     | Purpose                     |
| ----------------- | -------------------- | ----------- | --------------------------- |
| **LLM (Primary)** | Groq                 | API         | Fast, free inference        |
| **LLM (Premium)** | OpenAI               | GPT-4o-mini | High-quality responses      |
| **LLM (Local)**   | Ollama               | llama3.1:8b | Self-hosted inference       |
| **Embeddings**    | @xenova/transformers | 2.x         | Client/server embeddings    |
| **Model**         | MiniLM-L6-v2         | -           | 384-dim sentence embeddings |

### 3.4 Infrastructure

| Component    | Technology          | Purpose                        |
| ------------ | ------------------- | ------------------------------ |
| **Hosting**  | Vercel              | Serverless deployment          |
| **Database** | Supabase Cloud      | Managed PostgreSQL             |
| **Region**   | US East (default)   | Low latency for US/EU          |
| **CDN**      | Vercel Edge Network | Global content delivery        |
| **CI/CD**    | GitHub Actions      | Automated testing & deployment |

---

## 4. Core Components

### 4.1 Frontend Components

#### 4.1.1 Server Components (Default)

```typescript
// app/page.tsx - Homepage (Server Component)
export default async function HomePage() {
  // Fetch data server-side (no API call needed)
  const bots = await getBotsFromDatabase()

  return <BotGrid bots={bots} />
}
```

**Benefits:**

- Zero JavaScript shipped to client
- Direct database access (no API)
- Faster initial page load
- SEO-friendly

#### 4.1.2 Client Components (Interactive)

```typescript
// components/ChatInterface.tsx
'use client'

import { useState } from 'react'

export default function ChatInterface({ botId }: { botId: string }) {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = async (content: string) => {
    // Client-side interactivity
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ botId, message: content })
    })

    const data = await response.json()
    setMessages([...messages, data.message])
  }

  return (
    <div className="chat-container">
      {/* Chat UI */}
    </div>
  )
}
```

**Benefits:**

- Interactive UI (forms, animations)
- Client-side state management
- Real-time updates
- Event handling

### 4.2 API Routes (Route Handlers)

#### 4.2.1 Chat Endpoint

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { streamLLMResponse } from '@/lib/llm-client';

export async function POST(req: NextRequest) {
  const { message, botId, userId } = await req.json();

  // 1. Authenticate user
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. Retrieve relevant documents (RAG)
  const context = await retrieveContext(message, botId, userId);

  // 3. Build prompt
  const prompt = buildPrompt(message, context, botId);

  // 4. Stream LLM response
  const stream = await streamLLMResponse(prompt, user.settings);

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
```

#### 4.2.2 Document Upload Endpoint

```typescript
// app/api/documents/route.ts
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  // 1. Validate file
  if (!isValidFileType(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    // 10MB
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }

  // 2. Extract text
  const text = await extractText(file);

  // 3. Chunk text
  const chunks = chunkText(text, 512);

  // 4. Generate embeddings
  const embeddings = await generateEmbeddings(chunks);

  // 5. Store in database
  await storeDocument(file, chunks, embeddings);

  return NextResponse.json({ success: true });
}
```

### 4.3 Database Client

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
}
```

---

## 5. RAG Implementation

### 5.1 Chunking Strategy

**Implementation:**

```typescript
// lib/rag/chunker.ts
export function chunkText(text: string, targetTokens: number = 512): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);

  let currentChunk = '';
  let currentTokenCount = 0;

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence);

    if (currentTokenCount + sentenceTokens > targetTokens && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
      currentTokenCount = sentenceTokens;
    } else {
      currentChunk += ' ' + sentence;
      currentTokenCount += sentenceTokens;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks;
}

function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}
```

**Overlap Strategy:**

```typescript
export function chunkTextWithOverlap(
  text: string,
  targetTokens: number = 512,
  overlapTokens: number = 50,
): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];

  let i = 0;
  while (i < sentences.length) {
    let chunk = '';
    let tokenCount = 0;
    let j = i;

    // Build chunk
    while (j < sentences.length && tokenCount < targetTokens) {
      chunk += sentences[j] + ' ';
      tokenCount += estimateTokens(sentences[j]);
      j++;
    }

    chunks.push(chunk.trim());

    // Move back by overlap amount
    const overlapSentences = Math.max(1, Math.floor(overlapTokens / 100));
    i = j - overlapSentences;
  }

  return chunks;
}
```

### 5.2 Vector Search

**SQL Query:**

```sql
-- Vector similarity search using pgvector
SELECT
  dc.id,
  dc.content,
  dc.chunk_index,
  d.title,
  d.file_name,
  1 - (dc.embedding <=> $1::vector) as similarity
FROM document_chunks dc
JOIN documents d ON dc.document_id = d.id
WHERE
  dc.bot_id = $2
  AND d.user_id = $3
  AND 1 - (dc.embedding <=> $1::vector) > 0.7  -- Similarity threshold
ORDER BY dc.embedding <=> $1::vector  -- Cosine distance
LIMIT 5;
```

**TypeScript Implementation:**

```typescript
// lib/rag/retrieval.ts
export async function retrieveContext(
  query: string,
  botId: string,
  userId: string,
  topK: number = 5,
): Promise<DocumentChunk[]> {
  // 1. Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // 2. Search for similar chunks
  const supabase = createClient();
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: topK,
    filter_bot_id: botId,
    filter_user_id: userId,
  });

  if (error) throw error;

  return data;
}
```

**PostgreSQL Function:**

```sql
-- Database function for vector search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  filter_bot_id uuid,
  filter_user_id uuid
)
RETURNS TABLE (
  id uuid,
  content text,
  chunk_index int,
  document_title text,
  file_name text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.content,
    dc.chunk_index,
    d.title,
    d.file_name,
    1 - (dc.embedding <=> query_embedding) as similarity
  FROM document_chunks dc
  JOIN documents d ON dc.document_id = d.id
  WHERE
    dc.bot_id = filter_bot_id
    AND d.user_id = filter_user_id
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### 5.3 Prompt Engineering

```typescript
// lib/rag/prompt-builder.ts
export function buildRAGPrompt(
  query: string,
  context: DocumentChunk[],
  botConfig: BotConfig,
): string {
  const systemPrompt = `${botConfig.systemPrompt}

Use the following context to answer the user's question. Always cite your sources.

Context:
${context
  .map(
    (chunk, i) => `
[${i + 1}] Source: ${chunk.document_title} (${chunk.file_name})
Content: ${chunk.content}
`,
  )
  .join('\n')}

Instructions:
- Answer based on the provided context
- If the answer is not in the context, say "I don't have enough information"
- Always include citations using [1], [2], etc.
- Be concise and accurate
`;

  return systemPrompt;
}
```

---

## 6. LLM Provider Abstraction

### 6.1 Provider Interface

```typescript
// lib/llm/types.ts
export interface LLMProvider {
  name: 'groq' | 'openai' | 'ollama';
  apiKey?: string;
  baseURL?: string;
  model: string;
}

export interface LLMRequest {
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

### 6.2 Multi-Provider Client

```typescript
// lib/llm/client.ts
import Groq from 'groq-sdk';
import OpenAI from 'openai';

export async function generateCompletion(
  request: LLMRequest,
  provider: LLMProvider,
): Promise<LLMResponse> {
  switch (provider.name) {
    case 'groq':
      return await generateGroqCompletion(request, provider);
    case 'openai':
      return await generateOpenAICompletion(request, provider);
    case 'ollama':
      return await generateOllamaCompletion(request, provider);
    default:
      throw new Error(`Unknown provider: ${provider.name}`);
  }
}

async function generateGroqCompletion(
  request: LLMRequest,
  provider: LLMProvider,
): Promise<LLMResponse> {
  const groq = new Groq({
    apiKey: provider.apiKey || process.env.GROQ_API_KEY,
  });

  const completion = await groq.chat.completions.create({
    model: provider.model || 'llama-3.1-8b-instant',
    messages: request.messages,
    temperature: request.temperature || 0.7,
    max_tokens: request.maxTokens || 2000,
    stream: false,
  });

  return {
    content: completion.choices[0].message.content || '',
    usage: {
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0,
    },
  };
}

async function generateOpenAICompletion(
  request: LLMRequest,
  provider: LLMProvider,
): Promise<LLMResponse> {
  const openai = new OpenAI({
    apiKey: provider.apiKey || process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: provider.model || 'gpt-4o-mini',
    messages: request.messages,
    temperature: request.temperature || 0.7,
    max_tokens: request.maxTokens || 2000,
  });

  return {
    content: completion.choices[0].message.content || '',
    usage: {
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0,
    },
  };
}

async function generateOllamaCompletion(
  request: LLMRequest,
  provider: LLMProvider,
): Promise<LLMResponse> {
  const baseURL = provider.baseURL || 'http://localhost:11434';

  const response = await fetch(`${baseURL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: provider.model || 'llama3.1:8b',
      messages: request.messages,
      stream: false,
    }),
  });

  const data = await response.json();

  return {
    content: data.message.content,
    usage: {
      promptTokens: data.prompt_eval_count || 0,
      completionTokens: data.eval_count || 0,
      totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
    },
  };
}
```

### 6.3 Streaming Support

```typescript
// lib/llm/streaming.ts
export async function streamCompletion(
  request: LLMRequest,
  provider: LLMProvider,
): Promise<ReadableStream> {
  switch (provider.name) {
    case 'groq':
      return streamGroqCompletion(request, provider);
    case 'openai':
      return streamOpenAICompletion(request, provider);
    case 'ollama':
      return streamOllamaCompletion(request, provider);
    default:
      throw new Error(`Unknown provider: ${provider.name}`);
  }
}

async function streamGroqCompletion(
  request: LLMRequest,
  provider: LLMProvider,
): Promise<ReadableStream> {
  const groq = new Groq({ apiKey: provider.apiKey });

  const stream = await groq.chat.completions.create({
    model: provider.model || 'llama-3.1-8b-instant',
    messages: request.messages,
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          controller.enqueue(new TextEncoder().encode(content));
        }
      }
      controller.close();
    },
  });
}
```

---

## 7. Embedding Generation

### 7.1 Transformer.js Integration

```typescript
// lib/embeddings/generator.ts
import { pipeline, env } from '@xenova/transformers';

// Configure for server-side execution
env.allowLocalModels = false;
env.useBrowserCache = false;

let embeddingPipeline: any = null;

export async function initializeEmbeddingModel() {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embeddingPipeline;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await initializeEmbeddingModel();

  const output = await model(text, {
    pooling: 'mean',
    normalize: true,
  });

  return Array.from(output.data);
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map((text) => generateEmbedding(text)));
}
```

### 7.2 Model Specifications

**Model:** `Xenova/all-MiniLM-L6-v2`

**Characteristics:**

- **Architecture:** Transformer encoder (BERT-based)
- **Embedding Dimension:** 384
- **Max Sequence Length:** 512 tokens
- **Model Size:** ~80MB (ONNX format)
- **Performance:**
  - Client-side: 2-5s per chunk
  - Server-side: 1-3s per chunk
  - Cold start: 10-15s (model download)

**Trade-offs:**

- ✅ Small model size (fast download)
- ✅ Good semantic understanding
- ✅ Works in browser (WebAssembly)
- ⚠️ Lower quality than larger models (BGE, E5)
- ⚠️ No multilingual support (English-optimized)

### 7.3 Performance Optimization

```typescript
// lib/embeddings/cache.ts
const embeddingCache = new Map<string, number[]>();

export async function getCachedEmbedding(text: string): Promise<number[]> {
  const hash = hashString(text);

  if (embeddingCache.has(hash)) {
    return embeddingCache.get(hash)!;
  }

  const embedding = await generateEmbedding(text);
  embeddingCache.set(hash, embedding);

  return embedding;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}
```

---

## 8. Database Schema

### 8.1 Tables

#### 8.1.1 Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

#### 8.1.2 Documents Table

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_user_id ON documents(user_id);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);
```

#### 8.1.3 Document Chunks Table

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  bot_id UUID,
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding vector(384),  -- 384-dimensional vector
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vector similarity index (HNSW for fast approximate search)
CREATE INDEX idx_document_chunks_embedding
  ON document_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_bot_id ON document_chunks(bot_id);

ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own document chunks"
  ON document_chunks FOR SELECT
  USING (
    document_id IN (
      SELECT id FROM documents WHERE user_id = auth.uid()
    )
  );
```

#### 8.1.4 Custom Bots Table

```sql
CREATE TABLE custom_bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  accent_color TEXT DEFAULT 'indigo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_custom_bots_user_id ON custom_bots(user_id);

ALTER TABLE custom_bots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bots"
  ON custom_bots FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

#### 8.1.5 User Settings Table

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  preferred_llm TEXT DEFAULT 'groq',  -- groq, openai, ollama
  groq_api_key TEXT,
  openai_api_key TEXT,
  ollama_server_url TEXT DEFAULT 'http://localhost:11434',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 8.2 Database Functions

#### Vector Search Function

```sql
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  filter_bot_id uuid DEFAULT NULL,
  filter_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  chunk_index int,
  document_title text,
  file_name text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.content,
    dc.chunk_index,
    d.title as document_title,
    d.file_name,
    1 - (dc.embedding <=> query_embedding) as similarity
  FROM document_chunks dc
  JOIN documents d ON dc.document_id = d.id
  WHERE
    (filter_bot_id IS NULL OR dc.bot_id = filter_bot_id)
    AND (filter_user_id IS NULL OR d.user_id = filter_user_id)
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 9. Security Architecture

### 9.1 Authentication Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. Login request (email/password)
     ▼
┌─────────────────┐
│ Supabase Auth   │
└────┬────────────┘
     │
     │ 2. Verify credentials
     │ 3. Generate JWT
     ▼
┌─────────────────┐
│  Client stores  │
│  JWT in cookie  │
└────┬────────────┘
     │
     │ 4. Subsequent requests include JWT
     ▼
┌─────────────────┐
│ Next.js API     │
│ ├─ Verify JWT   │
│ ├─ Extract user │
│ └─ Apply RLS    │
└─────────────────┘
```

### 9.2 Row-Level Security (RLS)

**Principle:** Users can only access their own data

**Implementation:**

```sql
-- Example RLS policy
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);
```

**Enforcement:**

- Automatic in all Supabase queries
- No application-level filtering needed
- Prevents data leaks even with SQL injection

### 9.3 API Security

#### Input Validation

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(10000),
  botId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const DocumentUploadSchema = z.object({
  file: z
    .custom<File>()
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File too large')
    .refine(
      (file) => ['application/pdf', 'text/plain', 'text/markdown'].includes(file.type),
      'Invalid file type',
    ),
});
```

#### Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export async function checkRateLimit(userId: string): Promise<boolean> {
  const { success } = await ratelimit.limit(userId);
  return success;
}
```

### 9.4 Data Privacy

**Principle:** Minimize data exposure

**Strategies:**

1. **Local-first embeddings**: Generated client-side or server-side, never sent to LLM providers
2. **BYOK (Bring Your Own Key)**: Users provide their own OpenAI keys
3. **Self-hosted option**: Full deployment on user infrastructure
4. **No analytics by default**: No third-party tracking
5. **Encrypted at rest**: Supabase encrypts all data

---

## 10. Performance Optimization

### 10.1 Server Components

**Default:** All components are Server Components

**Benefits:**

- Zero JavaScript shipped to client
- Faster initial page load
- Direct database access
- SEO-friendly

**Example:**

```typescript
// app/bots/page.tsx (Server Component by default)
import { getBots } from '@/lib/data/bots'

export default async function BotsPage() {
  const bots = await getBots()  // Direct database access

  return (
    <div>
      {bots.map(bot => (
        <BotCard key={bot.id} bot={bot} />
      ))}
    </div>
  )
}
```

### 10.2 Code Splitting

**Automatic:** Next.js 14 App Router automatically splits code

**Dynamic Imports:**

```typescript
// components/ChatInterface.tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false  // Client-side only
})
```

### 10.3 Caching Strategy

**Static Pages:**

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  return <Article post={post} />
}
```

**Revalidation:**

```typescript
// Revalidate every 1 hour
export const revalidate = 3600;

// Or on-demand
import { revalidatePath } from 'next/cache';
revalidatePath('/blog');
```

### 10.4 Image Optimization

```typescript
import Image from 'next/image'

<Image
  src="/bot-icons/lex.png"
  alt="Lex Legal Assistant"
  width={64}
  height={64}
  priority  // Load above the fold
/>
```

**Benefits:**

- Automatic WebP/AVIF conversion
- Responsive images
- Lazy loading
- Blur placeholder

---

## 11. Deployment Architecture

### 11.1 Vercel Deployment

**Configuration:**

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"], // US East
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key"
  }
}
```

**Automatic Deployments:**

- Push to `main` → Production deployment
- Pull request → Preview deployment
- Branch push → Development deployment

### 11.2 Environment Variables

**Required:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# LLM Providers (Optional)
GROQ_API_KEY=xxx  # Fallback server key
OPENAI_API_KEY=xxx  # For users without own key

# Email (Choose one)
AWS_SES_REGION=eu-central-1
AWS_SES_ACCESS_KEY=xxx
AWS_SES_SECRET_KEY=xxx
```

### 11.3 Monitoring

**Recommended Stack:**

- **Error Tracking:** Sentry
- **Performance:** Vercel Analytics
- **Uptime:** UptimeRobot
- **Logs:** Vercel Logs + CloudWatch

---

## 12. API Reference

### 12.1 Chat API

**Endpoint:** `POST /api/chat`

**Request:**

```typescript
{
  "message": "What are the key terms in my contract?",
  "botId": "lex",
  "userId": "user-uuid"
}
```

**Response (Streaming):**

```
data: {"type": "token", "content": "Based"}
data: {"type": "token", "content": " on"}
data: {"type": "token", "content": " your"}
...
data: {"type": "done"}
```

### 12.2 Document Upload API

**Endpoint:** `POST /api/documents`

**Request (FormData):**

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('botId', 'lex');
```

**Response:**

```typescript
{
  "success": true,
  "documentId": "doc-uuid",
  "chunks": 12,
  "processingTime": 8543  // ms
}
```

### 12.3 Custom Bot API

**Endpoint:** `POST /api/custom-bots`

**Request:**

```typescript
{
  "name": "Contract Analyzer",
  "description": "Specialized in commercial contracts",
  "systemPrompt": "You are a contract analysis expert...",
  "accentColor": "blue"
}
```

**Response:**

```typescript
{
  "success": true,
  "botId": "bot-uuid"
}
```

---

## 13. Future Roadmap

### 13.1 Q1 2026 (Next 3 Months)

**Core Features:**

- [ ] Multi-document synthesis (analyze multiple docs together)
- [ ] Advanced RAG (hybrid search: vector + keyword)
- [ ] Bot usage analytics dashboard
- [ ] Improved mobile responsiveness

**Integrations:**

- [ ] Slack bot
- [ ] Discord bot
- [ ] Zapier integration
- [ ] API SDK (Python, JavaScript)

**Infrastructure:**

- [ ] Production error monitoring (Sentry)
- [ ] Performance metrics dashboard
- [ ] Automated testing in CI/CD
- [ ] Blue-green deployments

### 13.2 Q2 2026 (3-6 Months)

**Premium Features:**

- [ ] Custom model fine-tuning
- [ ] Team collaboration (shared bots)
- [ ] Advanced analytics
- [ ] Priority support

**Enterprise:**

- [ ] Self-hosted deployment guide
- [ ] Air-gapped deployment support
- [ ] Custom integrations
- [ ] SLA-based support

**Product:**

- [ ] Mobile app (iOS/Android)
- [ ] Browser extension
- [ ] Voice interface
- [ ] Multi-language support

### 13.3 Q3-Q4 2026 (6-12 Months)

**Advanced AI:**

- [ ] Multimodal support (images, audio)
- [ ] Autonomous research agents
- [ ] Multi-step reasoning
- [ ] Custom model training

**Scale:**

- [ ] Multi-region deployment
- [ ] CDN optimization
- [ ] Database sharding
- [ ] Microservices architecture

**Business:**

- [ ] Marketplace for community bots
- [ ] White-label offering
- [ ] Partner program
- [ ] Enterprise certifications (SOC2, ISO27001)

---

## 14. Appendix

### 14.1 Glossary

**RAG (Retrieval-Augmented Generation):** AI technique that retrieves relevant documents before generating responses, improving accuracy and enabling citations.

**Embedding:** Numerical vector representation of text that captures semantic meaning, enabling similarity search.

**pgvector:** PostgreSQL extension for storing and searching vector embeddings.

**HNSW (Hierarchical Navigable Small World):** Graph-based algorithm for fast approximate nearest neighbor search.

**Server Components:** React components that render on the server, reducing JavaScript sent to client.

**BYOK (Bring Your Own Key):** Users provide their own API keys for third-party services.

**RLS (Row-Level Security):** Database-level access control that filters rows based on user identity.

### 14.2 References

**Technologies:**

- Next.js: https://nextjs.org
- Supabase: https://supabase.com
- Groq: https://groq.com
- pgvector: https://github.com/pgvector/pgvector
- Transformer.js: https://huggingface.co/docs/transformers.js

**Papers:**

- "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (Lewis et al., 2020)
- "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks" (Reimers & Gurevych, 2019)

### 14.3 Contact

**Development Team:** REDACTED_EMAIL
**Repository:** [GitHub URL if public]
**Website:** https://www.botsmann.com

---

**Document Version:** 1.0
**Last Updated:** January 16, 2026
**License:** Proprietary
