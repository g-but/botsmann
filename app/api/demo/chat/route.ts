import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define types inline to avoid import issues
interface KnowledgeChunk {
  id: string;
  topic: string;
  question: string;
  content: string;
  keywords: string[];
}

interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
  matchedTerms: string[];
}

// Inline search functions to avoid import issues on Vercel
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

function calculateScore(
  chunk: KnowledgeChunk,
  queryTerms: string[]
): { score: number; matchedTerms: string[] } {
  const matchedTerms: string[] = [];
  let score = 0;
  const chunkText = `${chunk.question} ${chunk.content} ${chunk.topic}`.toLowerCase();
  const chunkKeywords = chunk.keywords.map(k => k.toLowerCase());

  for (const term of queryTerms) {
    if (chunkKeywords.includes(term)) {
      score += 3;
      matchedTerms.push(term);
      continue;
    }
    const partialKeywordMatch = chunkKeywords.some(k => k.includes(term) || term.includes(k));
    if (partialKeywordMatch) {
      score += 2;
      matchedTerms.push(term);
      continue;
    }
    if (chunkText.includes(term)) {
      score += 1;
      matchedTerms.push(term);
    }
  }

  const questionTerms = tokenize(chunk.question);
  const questionOverlap = queryTerms.filter(t => questionTerms.includes(t)).length;
  score += questionOverlap * 0.5;

  return { score, matchedTerms: Array.from(new Set(matchedTerms)) };
}

function searchKnowledge(
  query: string,
  chunks: KnowledgeChunk[],
  topK: number = 3
): SearchResult[] {
  const queryTerms = tokenize(query);
  if (queryTerms.length === 0) return [];

  return chunks
    .map(chunk => {
      const { score, matchedTerms } = calculateScore(chunk, queryTerms);
      return { chunk, score, matchedTerms };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function generateTemplateResponse(query: string, results: SearchResult[]): string {
  if (results.length === 0) {
    return "I don't have specific information about that. Try asking about Swiss German greetings, numbers, food, directions, culture, dialects, or common expressions!";
  }
  const bestMatch = results[0];
  if (bestMatch.score >= 3) {
    return bestMatch.chunk.content;
  }
  if (results.length > 1) {
    const topics = Array.from(new Set(results.map(r => r.chunk.topic)));
    const combinedContent = results.slice(0, 2).map(r => r.chunk.content).join('\n\nAlso relevant: ');
    return `Based on your question about ${topics.join(' and ')}:\n\n${combinedContent}`;
  }
  return bestMatch.chunk.content;
}

// Inline knowledge data to avoid JSON import issues on Vercel
const knowledgeChunks: KnowledgeChunk[] = [
  {
    id: 'greetings-1',
    topic: 'Greetings',
    question: 'How do you say hello in Swiss German?',
    content: "The most common Swiss German greeting is 'Grüezi' (GREW-tsee), used in formal situations. For informal settings, use 'Hoi' or 'Sali'. In the morning, say 'Guete Morge' (good morning), and in the evening 'Guete Abig' (good evening). When leaving, 'Uf Widerluege' is the formal goodbye, while 'Tschüss' or 'Ciao' work for casual situations.",
    keywords: ['hello', 'greetings', 'grüezi', 'hoi', 'sali', 'goodbye', 'morning', 'evening', 'formal', 'informal']
  },
  {
    id: 'greetings-2',
    topic: 'Greetings',
    question: "What's the difference between Grüezi and Hoi?",
    content: "'Grüezi' is formal and respectful—use it with strangers, in shops, at work, or with older people. 'Hoi' is casual and friendly—use it with friends, younger people, or in relaxed settings. Using 'Hoi' with a stranger might seem too familiar, while 'Grüezi' with close friends might feel distant. In Zürich, you'll hear both constantly.",
    keywords: ['grüezi', 'hoi', 'formal', 'informal', 'difference', 'strangers', 'friends', 'polite', 'casual']
  },
  {
    id: 'numbers-1',
    topic: 'Numbers',
    question: 'How do you count in Swiss German?',
    content: "Swiss German numbers: eis (1), zwei (2), drü (3), vier (4), föif (5), sächs (6), sibä (7), acht (8), nüün (9), zää (10). Note the differences from High German: 'drü' instead of 'drei', 'föif' instead of 'fünf', 'sächs' instead of 'sechs'. For 20, say 'zwänzg', and for 100, say 'hundert' (same as High German).",
    keywords: ['numbers', 'count', 'counting', 'one', 'two', 'three', 'eis', 'zwei', 'drü', 'föif']
  },
  {
    id: 'food-1',
    topic: 'Food & Dining',
    question: 'How do I order food in Swiss German?',
    content: "At a restaurant, say 'Ich hätt gern...' (I would like...) followed by your order. For drinks: 'Es Bier, bitte' (a beer, please) or 'E Kafi' (a coffee). To ask for the bill: 'Chönt ich zahle?' or simply 'Zahle, bitte'. Common food words: Rösti (potato dish), Zürigschnätzlets (Zurich-style meat), Fondue, Raclette. Tip: 'En Guete!' means 'enjoy your meal'.",
    keywords: ['food', 'restaurant', 'order', 'ordering', 'eat', 'drink', 'beer', 'coffee', 'bill', 'pay', 'rösti', 'fondue']
  },
  {
    id: 'food-2',
    topic: 'Food & Dining',
    question: 'What are typical Swiss dishes?',
    content: "Classic Swiss dishes include: Rösti (crispy grated potatoes, originally from Bern), Fondue (melted cheese with bread), Raclette (melted cheese scraped onto potatoes), Zürigschnätzlets (sliced veal in cream sauce with rösti), Älplermagronen (Alpine macaroni with potatoes, cheese, and onions), and Birchermüesli (invented in Zürich, a healthy breakfast). For dessert, try Vermicelles (chestnut purée) or Zuger Kirschtorte.",
    keywords: ['swiss', 'dishes', 'food', 'traditional', 'rösti', 'fondue', 'raclette', 'cheese', 'typical', 'cuisine']
  },
  {
    id: 'culture-1',
    topic: 'Culture',
    question: 'What should I know about Swiss culture?',
    content: "Swiss people value punctuality—being late is considered disrespectful. Quiet hours (Ruhezeit) are strictly observed: no loud noise after 10 PM or on Sundays. Recycling is mandatory and taken seriously. The Swiss are initially reserved but warm up once you know them. Small talk often centers on weather, mountains, or local news. Tipping is appreciated but not expected (service is included). Always greet shopkeepers when entering and leaving.",
    keywords: ['culture', 'customs', 'swiss', 'punctuality', 'quiet', 'sunday', 'recycling', 'etiquette', 'manners', 'tips']
  },
  {
    id: 'culture-2',
    topic: 'Culture',
    question: 'What are the Swiss quiet hours (Ruhezeit)?',
    content: "Ruhezeit (quiet time) is sacred in Switzerland. General rules: No loud activities from 12:00-13:00 (lunch break), after 22:00 on weekdays, after 20:00 on Saturdays, and ALL DAY on Sundays. This means no vacuuming, drilling, loud music, or even running laundry machines in apartments. Breaking Ruhezeit can result in complaints from neighbors or even fines. Plan noisy tasks for weekday afternoons.",
    keywords: ['quiet', 'hours', 'ruhezeit', 'sunday', 'noise', 'rules', 'apartment', 'neighbors', 'loud', 'when']
  },
  {
    id: 'dialects-1',
    topic: 'Dialects',
    question: 'Are there different Swiss German dialects?',
    content: "Yes! Every canton has its own dialect. Züridütsch (Zurich) is most common in media. Bärndütsch (Bern) is slower and softer. Baseldytsch (Basel) has French influences. Walliserdütsch (Valais) is so different that other Swiss struggle to understand it. Graubünden has Romansh influences. Despite differences, Swiss people understand each other (mostly). Züridütsch is a good starting point as it's widely understood.",
    keywords: ['dialects', 'zürich', 'bern', 'basel', 'different', 'variations', 'canton', 'regional', 'understand', 'züridütsch', 'bärndütsch']
  },
  {
    id: 'expressions-1',
    topic: 'Common Expressions',
    question: 'What are some useful Swiss German expressions?',
    content: "'Merci vilmal' (thank you very much), 'Kei Problem' (no problem), 'Genau' (exactly, often used as 'yes'), 'Oder?' (right? - tag question), 'Gopfertami!' (mild swear, like 'damn'), 'Säuglatt' (super cool), 'Es isch mega guet' (it's really good), 'Ich verstah nöd' (I don't understand), 'Chönd Sie langsamer rede?' (Can you speak slower?). Swiss love adding 'oder' at the end of sentences for confirmation.",
    keywords: ['expressions', 'phrases', 'common', 'useful', 'thank', 'merci', 'understand', 'cool', 'slang', 'everyday']
  },
  {
    id: 'expressions-2',
    topic: 'Common Expressions',
    question: "How do I say 'I don't understand' in Swiss German?",
    content: "'Ich verstah nöd' or 'Ich ha nöd verstande' (I didn't understand). To ask someone to repeat: 'Wie bitte?' or 'Chönd Sie das wiederhole?'. To ask them to slow down: 'Chönd Sie langsamer rede, bitte?'. Don't be embarrassed to ask—Swiss people appreciate the effort to learn their dialect and are usually happy to help or switch to High German.",
    keywords: ['understand', "don't understand", 'repeat', 'slower', 'help', 'confused', 'verstah', 'speak', 'language']
  }
];

const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  includeContext: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, includeContext } = ChatRequestSchema.parse(body);

    // Search the knowledge base
    const results = searchKnowledge(message, knowledgeChunks, 3);

    // Generate response
    const response = generateTemplateResponse(message, results);

    // Optionally include the raw context for debugging
    const responseData: {
      success: boolean;
      response: string;
      sources: Array<{ topic: string; question: string; score: number }>;
      context?: string;
    } = {
      success: true,
      response,
      sources: results.map(r => ({
        topic: r.chunk.topic,
        question: r.chunk.question,
        score: r.score,
      })),
    };

    if (includeContext) {
      responseData.context = results.map(r => r.chunk.content).join('\n\n');
    }

    return NextResponse.json(responseData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET handler for debugging/health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Swiss German RAG Demo API',
    chunks: knowledgeChunks.length,
    topics: Array.from(new Set(knowledgeChunks.map(c => c.topic)))
  });
}
