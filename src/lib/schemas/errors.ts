import { z } from 'zod';

export const ErrorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.array(z.object({
    field: z.string().optional(),
    message: z.string()
  })).optional()
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const createErrorResponse = (
  message: string,
  code?: string,
  details?: Array<{ field?: string; message: string }>
): ErrorResponse => ({
  error: message,
  ...(code && { code }),
  ...(details && { details })
});
