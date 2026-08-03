import 'server-only';

import { prisma } from '@/lib/prisma';

import type { Prisma } from '@prisma/client';

export type DashboardConversation = Prisma.ConversationGetPayload<{
  include: {
    messages: true;
  };
}>;

export async function getDashboardData(userId: string) {
  const [totalConversations, totalMessages, pinnedConversations, favoriteConversations, recentConversations] = await Promise.all([
    prisma.conversation.count({ where: { userId, archivedAt: null } }),
    prisma.message.count({ where: { conversation: { userId } } }),
    prisma.conversation.count({ where: { userId, isPinned: true } }),
    prisma.conversation.count({ where: { userId, isFavorite: true } }),
    prisma.conversation.findMany({
      where: { userId },
      orderBy: [{ isPinned: 'desc' }, { lastMessageAt: 'desc' }, { createdAt: 'desc' }],
      take: 5,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })
  ]);

  return {
    totalConversations,
    totalMessages,
    pinnedConversations,
    favoriteConversations,
    recentConversations
  };
}