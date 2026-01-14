/**
 * RAG Search Utilities
 * Keyword-based search for demo purposes (no external APIs required)
 */

export interface KnowledgeChunk {
  id: string;
  topic: string;
  question: string;
  content: string;
  keywords: string[];
}

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
  matchedTerms: string[];
}

/**
 * Tokenize and normalize text for search
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

/**
 * Calculate TF-IDF-like score for a chunk against query terms
 */
function calculateScore(
  chunk: KnowledgeChunk,
  queryTerms: string[]
): { score: number; matchedTerms: string[] } {
  const matchedTerms: string[] = [];
  let score = 0;

  // Combine all searchable text
  const chunkText = `${chunk.question} ${chunk.content} ${chunk.topic}`.toLowerCase();
  const chunkKeywords = chunk.keywords.map(k => k.toLowerCase());

  for (const term of queryTerms) {
    // Exact keyword match (highest weight)
    if (chunkKeywords.includes(term)) {
      score += 3;
      matchedTerms.push(term);
      continue;
    }

    // Partial keyword match
    const partialKeywordMatch = chunkKeywords.some(k =>
      k.includes(term) || term.includes(k)
    );
    if (partialKeywordMatch) {
      score += 2;
      matchedTerms.push(term);
      continue;
    }

    // Content match
    if (chunkText.includes(term)) {
      score += 1;
      matchedTerms.push(term);
    }
  }

  // Boost for question match (likely direct answer)
  const questionTerms = tokenize(chunk.question);
  const questionOverlap = queryTerms.filter(t => questionTerms.includes(t)).length;
  score += questionOverlap * 0.5;

  return { score, matchedTerms: Array.from(new Set(matchedTerms)) };
}

/**
 * Search knowledge base using keyword matching
 */
export function searchKnowledge(
  query: string,
  chunks: KnowledgeChunk[],
  topK: number = 3
): SearchResult[] {
  const queryTerms = tokenize(query);

  if (queryTerms.length === 0) {
    return [];
  }

  const results: SearchResult[] = chunks
    .map(chunk => {
      const { score, matchedTerms } = calculateScore(chunk, queryTerms);
      return { chunk, score, matchedTerms };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return results;
}

/**
 * Format search results for LLM context
 */
export function formatContext(results: SearchResult[]): string {
  if (results.length === 0) {
    return 'No relevant information found in the knowledge base.';
  }

  return results
    .map((result, index) => {
      return `[Source ${index + 1}: ${result.chunk.topic}]
Q: ${result.chunk.question}
A: ${result.chunk.content}`;
    })
    .join('\n\n');
}

/**
 * Generate a response using retrieved context (without LLM - template based)
 * This is a fallback for when no LLM is available
 */
export function generateTemplateResponse(
  query: string,
  results: SearchResult[]
): string {
  if (results.length === 0) {
    return "I don't have specific information about that in my knowledge base. Try asking about Swiss German greetings, numbers, food, directions, culture, dialects, or common expressions!";
  }

  // If we have a good match, use the content directly
  const bestMatch = results[0];

  if (bestMatch.score >= 3) {
    // High confidence - return the content with light formatting
    return bestMatch.chunk.content;
  }

  // Multiple partial matches - combine info
  if (results.length > 1) {
    const topics = Array.from(new Set(results.map(r => r.chunk.topic)));
    const combinedContent = results
      .slice(0, 2)
      .map(r => r.chunk.content)
      .join('\n\nAlso relevant: ');

    return `Based on your question about ${topics.join(' and ')}:\n\n${combinedContent}`;
  }

  return bestMatch.chunk.content;
}
