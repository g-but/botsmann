import { z } from 'zod';

export const ProductSearchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(500, 'Query too long'),
  limit: z.number().int().min(1).max(100).optional().default(20),
  offset: z.number().int().min(0).optional().default(0),
});

export type ProductSearchInput = z.infer<typeof ProductSearchSchema>;
