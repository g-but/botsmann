import { searchAmazon } from '@/lib/platforms/amazon';
import { searchRicardo } from '@/lib/platforms/ricardo';
import { processQuery } from '@/lib/nlp';
import { jsonSuccess, jsonError, handleError, HTTP_STATUS } from '@/lib/api';
import { DOMAIN_ERRORS } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return jsonError('Invalid query parameter', 'VALIDATION_ERROR', HTTP_STATUS.BAD_REQUEST);
    }

    // Process query with NLP
    const { category, attributes } = await processQuery(query);

    // Search platforms in parallel
    const [amazonResults, ricardoResults] = await Promise.all([
      searchAmazon(category, attributes),
      searchRicardo(category, attributes),
    ]);

    // Combine and sort results
    const results = [...amazonResults, ...ricardoResults].sort((a, b) => a.price - b.price);

    return jsonSuccess({ results });
  } catch (error) {
    return handleError(error, DOMAIN_ERRORS.FAILED_SEARCH_PRODUCTS);
  }
}
