'use client';

/**
 * Custom Bot Chat Page
 *
 * Display and interact with a custom bot
 */

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { CustomBot } from '@/types/custom-bot';
import { PageLoading } from '@/components/shared/LoadingSpinner';
import { COLOR_CLASSES, type AccentColor } from '@/lib/config/colors';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function CustomBotPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [bot, setBot] = useState<CustomBot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch bot data
  useEffect(() => {
    async function fetchBot() {
      try {
        // First try to get by slug from user's bots
        const response = await fetch(`/api/custom-bots?slug=${slug}`);

        if (!response.ok) {
          throw new Error('Bot not found');
        }

        const data = await response.json();

        if (data.data?.bots?.length > 0) {
          setBot(data.data.bots[0]);
        } else {
          throw new Error('Bot not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bot');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchBot();
    }
  }, [slug]);

  // Core message sending logic (DRY: shared between sendMessage and suggestion clicks)
  const sendMessageWithContent = useCallback(
    async (content: string, clearInput = false) => {
      if (!bot || sending) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      };

      setMessages((prev) => [...prev, userMessage]);
      if (clearInput) setInput('');
      setSuggestions([]);
      setSending(true);

      try {
        const response = await fetch(`/api/custom-bots/${bot.id}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            data.data?.content || data.data?.response || 'Sorry, I could not generate a response.',
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (data.data?.suggestions && Array.isArray(data.data.suggestions)) {
          setSuggestions(data.data.suggestions);
        }
      } catch {
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Sorry, there was an error processing your message. Please try again.',
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setSending(false);
        inputRef.current?.focus();
      }
    },
    [bot, sending],
  );

  // Send message from input
  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    sendMessageWithContent(input.trim(), true);
  }, [input, sendMessageWithContent]);

  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: string) => sendMessageWithContent(suggestion),
    [sendMessageWithContent],
  );

  if (loading) {
    return <PageLoading />;
  }

  if (error || !bot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bot Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested bot does not exist.'}</p>
          <button
            onClick={() => router.push('/bots')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Bots
          </button>
        </div>
      </div>
    );
  }

  const colors = COLOR_CLASSES[bot.accent_color as AccentColor] || COLOR_CLASSES.blue;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className={`${colors.bg} text-white py-4 px-6 shadow-md`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-3xl">{bot.emoji}</span>
          <div>
            <h1 className="text-xl font-semibold">{bot.title}</h1>
            {bot.description && (
              <p className="text-sm opacity-90 line-clamp-1">{bot.description}</p>
            )}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl block mb-4">{bot.emoji}</span>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Start chatting with {bot.title}
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                {bot.description || 'Type a message to begin the conversation.'}
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? `${colors.bg} text-white`
                    : `bg-white border ${colors.border} text-gray-900`
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className={`bg-white border ${colors.border} rounded-2xl px-4 py-3`}>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:100ms]" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Context-aware suggestions */}
          {!sending && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-3 py-2 text-sm rounded-full border ${colors.border} ${colors.text} hover:bg-gray-50 transition-colors text-left`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className={`flex gap-2 items-end border ${colors.border} rounded-xl p-2 bg-gray-50`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${bot.title}...`}
              rows={1}
              className="flex-1 resize-none bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 px-2 py-1"
              style={{ maxHeight: '150px' }}
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className={`p-2 rounded-lg ${colors.bg} text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
