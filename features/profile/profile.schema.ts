import { z } from 'zod';

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  avatarUrl: z.preprocess((value) => (value === '' ? null : value), z.string().url().nullable().optional()),
  companyName: z.preprocess((value) => (value === '' ? null : value), z.string().trim().max(120).nullable().optional())
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;