import 'server-only';

import { prisma } from '@/lib/prisma';

export type DashboardConversation = Awaited<ReturnType<typeof prisma.conversation.findMany>>[number];

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