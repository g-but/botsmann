/**
 * Quick Chat API for Build Your Own Bot
 *
 * POST /api/quick-chat - Simple chat without authentication or documents
 *
 * This endpoint is for the Quick Create bot preview feature.
 * It uses a system prompt provided by the client to simulate the bot's personality.
 */

/* eslint-disable no-console */

import { type NextRequest } from 'next/server';
import { generateLLMResponse } from '@/lib/llm-client';
import { jsonSuccess, jsonError, HTTP_STATUS } from '@/lib/api';
import { rateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/request';

// Extend function timeout for model loading (Vercel)
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('[Quick Chat API] Starting request');

  try {
    // Rate limit per IP (stricter since no auth)
    const limiter = rateLimit({ limit: 10, interval: 60 * 1000, uniqueTokenPerInterval: 1000 });
    const ip = getClientIp(request);
    const { isRateLimited } = await limiter.check(`quick-chat:${ip}`);
    if (isRateLimited) {
      return jsonError(
        'Too many requests. Please slow down.',
        'RATE_LIMIT',
        HTTP_STATUS.RATE_LIMIT,
      );
    }

    const body = await request.json();
    const { message, systemPrompt, additionalContext, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return jsonError('Message required', 'VALIDATION_ERROR', HTTP_STATUS.BAD_REQUEST);
    }

    if (!systemPrompt || typeof systemPrompt !== 'string') {
      return jsonError('System prompt required', 'VALIDATION_ERROR', HTTP_STATUS.BAD_REQUEST);
    }

    // Build the full system prompt with additional context
    let fullSystemPrompt = systemPrompt;
    if (additionalContext) {
      fullSystemPrompt += `\n\nAdditional context: ${additionalContext}`;
    }

    // Add a safety wrapper to keep responses appropriate
    fullSystemPrompt += `\n\nIMPORTANT: Keep responses helpful and stay in character. Never break character or discuss being an AI unless directly asked.`;

    console.log('[Quick Chat API] Calling LLM...');
    const llmStartTime = Date.now();

    // Build messages array with conversation history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: fullSystemPrompt },
    ];

    // Add conversation history if provided (limit to last 10 exchanges to stay within context)
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-20); // Last 20 messages (10 exchanges)
      for (const msg of recentHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    // Add the current message
    messages.push({ role: 'user', content: message });

    try {
      const llmResponse = await generateLLMResponse(messages, {
        provider: 'groq', // Use Groq as default (fast and free tier)
        temperature: 0.8, // Slightly higher for more personality
        maxTokens: 256, // Keep responses short for preview
      });

      console.log('[Quick Chat API] LLM response in', Date.now() - llmStartTime, 'ms');
      console.log('[Quick Chat API] Total time:', Date.now() - startTime, 'ms');

      return jsonSuccess({
        response: llmResponse.content,
        provider: llmResponse.provider,
        model: llmResponse.model,
      });
    } catch (llmError) {
      console.error('[Quick Chat API] LLM error:', llmError);

      // Return a friendly fallback response
      return jsonSuccess({
        response: "I'm having a moment... could you try again?",
        provider: 'fallback',
        model: 'none',
      });
    }
  } catch (error) {
    console.error('[Quick Chat API] Unhandled error:', error);
    return jsonError('Internal server error', 'INTERNAL_ERROR', HTTP_STATUS.INTERNAL_ERROR);
  }
}
