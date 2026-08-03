import { z } from 'zod';

export const uploadQuerySchema = z.object({
  conversationId: z.string().uuid().optional(),
  purpose: z.enum(['conversation', 'profile', 'knowledge-base']).default('conversation')
});

export type UploadQueryInput = z.infer<typeof uploadQuerySchema>;