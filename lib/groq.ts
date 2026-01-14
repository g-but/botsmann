/**
 * Groq API Client for Free LLM Responses
 *
 * Groq offers a generous free tier:
 * - 14,400 requests/day for Llama models
 * - No credit card required
 * - Very fast inference
 *
 * Get your free API key at: https://console.groq.com
 */

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Use Llama 3.1 8B - fast and free
const DEFAULT_MODEL = 'llama-3.1-8b-instant';

export async function generateWithGroq(
  systemPrompt: string,
  userMessage: string,
  context: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    // Return a helpful message if no API key is configured
    return `I found relevant information about your question, but I need an API key to generate a personalized response. Here's what I found:\n\n${context}\n\n---\nTo enable AI responses, add GROQ_API_KEY to your environment variables. Get a free key at console.groq.com`;
  }

  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: `Context information:\n${context}\n\n---\nUser question: ${userMessage}`
    }
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      // Fallback to context-only response
      return `Based on the information I found:\n\n${context}`;
    }

    const data: GroqResponse = await response.json();
    return data.choices[0]?.message?.content || context;
  } catch (error) {
    console.error('Groq request failed:', error);
    // Fallback to context-only response
    return `Based on the information I found:\n\n${context}`;
  }
}

/**
 * Create a RAG system prompt for the Botsmann assistant
 */
export function getBotsmannSystemPrompt(): string {
  return `You are a helpful assistant for Botsmann, a platform that builds private AI assistants.

Your role is to answer questions about Botsmann's services, AI bots, and how the platform works.

Guidelines:
- Be friendly, professional, and concise
- Use the provided context to answer questions accurately
- If the context doesn't contain relevant information, say so honestly
- Encourage users to book a consultation for detailed discussions
- Mention specific bot names (Heidi, Lex, Imhotep, Nerd, Trident, Muse) when relevant
- Emphasize Botsmann's privacy-first approach when discussing data handling

Available AI Assistants:
- Heidi: Swiss German Teacher (live)
- Lex: Legal Expert (coming soon)
- Imhotep: Medical Expert (coming soon)
- Nerd: Research Assistant (coming soon)
- Trident: AI Product Manager (coming soon)
- Muse: Artistic Advisor (coming soon)

Key value propositions:
- Your data stays yours (privacy-first)
- Local or cloud deployment options
- No subscriptions for local setups
- Expert consulting available`;
}
