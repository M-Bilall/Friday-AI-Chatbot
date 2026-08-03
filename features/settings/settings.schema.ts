import { z } from 'zod';

export const settingsUpdateSchema = z.object({
  theme: z.enum(['LIGHT', 'DARK', 'SYSTEM']),
  defaultModel: z.string().trim().min(1),
  language: z.string().trim().min(2).max(12),
  timezone: z.string().trim().min(2).max(64),
  compactMode: z.boolean(),
  sendReadReceipts: z.boolean(),
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean()
});

export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;