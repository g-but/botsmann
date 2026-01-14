/**
 * Multi-Provider LLM Client
 *
 * Supports:
 * - Groq (free, default)
 * - OpenAI (BYOK)
 * - Ollama (local)
 */

export type ModelProvider = 'groq' | 'openai' | 'ollama';

interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMOptions {
  provider: ModelProvider;
  apiKey?: string | null;
  ollamaUrl?: string | null;
  temperature?: number;
  maxTokens?: number;
}

interface LLMResponse {
  content: string;
  provider: ModelProvider;
  model: string;
}

// Groq configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';

// OpenAI configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini'; // Cost-effective option

// Ollama configuration
const OLLAMA_MODEL = 'llama3.1:8b';

/**
 * Generate a response using the specified LLM provider
 */
export async function generateLLMResponse(
  messages: LLMMessage[],
  options: LLMOptions
): Promise<LLMResponse> {
  const { provider, apiKey, ollamaUrl, temperature = 0.7, maxTokens = 1024 } = options;

  switch (provider) {
    case 'groq':
      return generateWithGroq(messages, apiKey, temperature, maxTokens);
    case 'openai':
      return generateWithOpenAI(messages, apiKey, temperature, maxTokens);
    case 'ollama':
      return generateWithOllama(messages, ollamaUrl, temperature, maxTokens);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Generate with Groq (free tier)
 */
async function generateWithGroq(
  messages: LLMMessage[],
  apiKey: string | null | undefined,
  temperature: number,
  maxTokens: number
): Promise<LLMResponse> {
  // Use provided key or fallback to server-side key
  const key = apiKey || process.env.GROQ_API_KEY;

  if (!key) {
    throw new Error('Groq API key not configured');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Groq API error:', error);
    throw new Error('Groq API request failed');
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || '',
    provider: 'groq',
    model: GROQ_MODEL,
  };
}

/**
 * Generate with OpenAI (BYOK)
 */
async function generateWithOpenAI(
  messages: LLMMessage[],
  apiKey: string | null | undefined,
  temperature: number,
  maxTokens: number
): Promise<LLMResponse> {
  if (!apiKey) {
    throw new Error('OpenAI API key required');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI API error:', error);
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || '',
    provider: 'openai',
    model: OPENAI_MODEL,
  };
}

/**
 * Generate with Ollama (local)
 */
async function generateWithOllama(
  messages: LLMMessage[],
  ollamaUrl: string | null | undefined,
  temperature: number,
  maxTokens: number
): Promise<LLMResponse> {
  const baseUrl = ollamaUrl || 'http://localhost:11434';
  const url = `${baseUrl}/api/chat`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Ollama API error:', error);
      throw new Error('Ollama API request failed');
    }

    const data = await response.json();
    return {
      content: data.message?.content || '',
      provider: 'ollama',
      model: OLLAMA_MODEL,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to Ollama. Is it running?');
    }
    throw error;
  }
}

/**
 * Helper to create a simple chat completion
 */
export async function chat(
  systemPrompt: string,
  userMessage: string,
  context: string,
  options: LLMOptions
): Promise<string> {
  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Context:\n${context}\n\n---\nUser question: ${userMessage}` }
  ];

  const response = await generateLLMResponse(messages, options);
  return response.content;
}
