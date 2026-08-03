import { z } from 'zod';

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().trim().min(1, 'Write a message'),
  model: z.string().min(1).default('friday-default'),
  workspaceId: z.string().uuid().optional(),
  attachments: z
    .array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        url: z.string().url()
      })
    )
    .default([])
});

export const conversationFilterSchema = z.object({
  query: z.string().trim().optional(),
  workspaceId: z.string().uuid().optional(),
  pinned: z.coerce.boolean().optional(),
  favorites: z.coerce.boolean().optional()
});

export const conversationRenameSchema = z.object({
  title: z.string().trim().min(2).max(120)
});

export const conversationUpdateSchema = z.object({
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  archivedAt: z.string().datetime().nullable().optional()
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type ConversationFilterInput = z.infer<typeof conversationFilterSchema>;
export type ConversationRenameInput = z.infer<typeof conversationRenameSchema>;
export type ConversationUpdateInput = z.infer<typeof conversationUpdateSchema>;