import { z } from 'zod';

export const WaitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  preferences: z.object({
    events: z.boolean().default(false),
    newsletters: z.boolean().default(false),
    blog: z.boolean().default(false),
    videos: z.boolean().default(false),
  }).default({}),
});

export type WaitlistInput = z.infer<typeof WaitlistSchema>;
