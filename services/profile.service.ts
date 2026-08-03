import 'server-only';

import { prisma } from '@/lib/prisma';

import type { ProfileUpdateInput } from '@/features/profile/profile.schema';

export async function getProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true, conversations: { take: 5, orderBy: { updatedAt: 'desc' } }, ownedWorkspaces: true }
  });
}

export async function updateProfile(userId: string, input: ProfileUpdateInput) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      avatarUrl: input.avatarUrl === undefined ? undefined : input.avatarUrl,
      settings: input.companyName !== undefined ? { update: { companyName: input.companyName ?? null } } : undefined
    },
    include: { settings: true }
  });
}