import 'server-only';

import { prisma } from '@/lib/prisma';

import type { SettingsUpdateInput } from '@/features/settings/settings.schema';

export async function getSettings(userId: string) {
  return prisma.userSettings.findUnique({
    where: { userId }
  });
}

export async function updateSettings(userId: string, input: SettingsUpdateInput) {
  return prisma.userSettings.upsert({
    where: { userId },
    update: input,
    create: {
      userId,
      ...input
    }
  });
}