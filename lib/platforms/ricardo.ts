import { ProductResult } from '@/types/products';

export async function searchRicardo(
  _category: string,
  _attributes: Record<string, unknown>,
): Promise<ProductResult[]> {
  if (!process.env.RICARDO_API_KEY) {
    console.info('Ricardo API key is not configured');
    return [];
  }

  // Real Ricardo API integration not yet implemented
  return [];
}
