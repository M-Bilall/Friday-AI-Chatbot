import 'server-only';

import { prisma } from '@/lib/prisma';

import type { ConversationFilterInput, ConversationRenameInput, ConversationUpdateInput } from '@/features/chat/chat.schema';

export async function listConversations(userId: string, filters: ConversationFilterInput = {}) {
  const query = filters.query?.trim();

  return prisma.conversation.findMany({
    where: {
      userId,
      archivedAt: filters.pinned ? null : undefined,
      isPinned: filters.pinned ?? undefined,
      isFavorite: filters.favorites ?? undefined,
      workspaceId: filters.workspaceId,
      OR: query
        ? [
            { title: { contains: query, mode: 'insensitive' } },
            { summary: { contains: query, mode: 'insensitive' } },
            { messages: { some: { content: { contains: query, mode: 'insensitive' } } } }
          ]
        : undefined
    },
    orderBy: [{ isPinned: 'desc' }, { lastMessageAt: 'desc' }, { createdAt: 'desc' }],
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });
}

export async function getConversationOrThrow(userId: string, conversationId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      },
      attachments: true,
      workspace: true
    }
  });

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  return conversation;
}

export async function createConversation(userId: string, input: { title?: string; workspaceId?: string; model?: string; summary?: string }) {
  return prisma.conversation.create({
    data: {
      userId,
      workspaceId: input.workspaceId,
      title: input.title?.trim() || 'New conversation',
      summary: input.summary,
      model: input.model ?? 'friday-default'
    }
  });
}

export async function renameConversation(userId: string, conversationId: string, input: ConversationRenameInput) {
  await getConversationOrThrow(userId, conversationId);

  return prisma.conversation.update({
    where: { id: conversationId },
    data: { title: input.title.trim() }
  });
}

export async function updateConversation(userId: string, conversationId: string, input: ConversationUpdateInput) {
  await getConversationOrThrow(userId, conversationId);

  return prisma.conversation.update({
    where: { id: conversationId },
    data: {
      isPinned: input.isPinned,
      isFavorite: input.isFavorite,
      archivedAt: input.archivedAt === null ? null : input.archivedAt ? new Date(input.archivedAt) : undefined
    }
  });
}

export async function deleteConversation(userId: string, conversationId: string) {
  await getConversationOrThrow(userId, conversationId);

  return prisma.conversation.delete({
    where: { id: conversationId }
  });
}

export async function listMessages(conversationId: string, take = 100) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take
  });
}