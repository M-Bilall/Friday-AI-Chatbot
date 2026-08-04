import 'server-only';

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { createConversation, getConversationOrThrow } from '@/services/conversations.service';
import { sendMessageToN8n } from '@/lib/n8n';

import type { SendMessageInput } from '@/features/chat/chat.schema';

type ConversationWithMessages = Prisma.ConversationGetPayload<{ include: { messages: true } }>;
type ChatTurnParams = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  input: SendMessageInput;
};

export async function runChatTurn({ user, input }: ChatTurnParams) {
  const conversation: ConversationWithMessages = input.conversationId
    ? await getConversationOrThrow(user.id, input.conversationId)
    : await getConversationOrThrow(
        user.id,
        (
          await createConversation(user.id, {
            title: 'New conversation',
            workspaceId: input.workspaceId,
            model: input.model
          })
        ).id
      );

  const userMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: 'USER',
      content: input.message,
      status: 'SENT',
      model: input.model
    }
  });

  if (input.attachments.length) {
    await prisma.attachment.updateMany({
      where: {
        id: { in: input.attachments.map((attachment) => attachment.id) },
        userId: user.id
      },
      data: {
        conversationId: conversation.id,
        messageId: userMessage.id
      }
    });
  }

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      lastMessageAt: new Date(),
      model: input.model
    }
  });

  const history = [...conversation.messages, userMessage].slice(-20).map((message) => ({
    role: message.role.toLowerCase() as 'user' | 'assistant' | 'system',
    content: message.content
  }));

  const n8nResponse = await sendMessageToN8n({
    conversationId: conversation.id,
    message: input.message,
    model: input.model,
    user,
    history,
    metadata: {
      workspaceId: input.workspaceId,
      attachmentCount: input.attachments.length
    }
  });

  const assistantMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: 'ASSISTANT',
      content: n8nResponse.reply || 'Friday is waiting for a response from the AI agent.',
      rawContent: JSON.stringify(n8nResponse.raw ?? {}),
      status: n8nResponse.reply ? 'SENT' : 'ERROR',
      model: input.model
    }
  });

  const updatedConversation = await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      title: n8nResponse.title?.trim() || (conversation.messages.length === 0 ? input.message.slice(0, 48) : conversation.title),
      summary: n8nResponse.summary ?? conversation.summary,
      lastMessageAt: new Date()
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      },
      attachments: true,
      workspace: true
    }
  });

  return {
    conversation: updatedConversation,
    userMessage,
    assistantMessage,
    reply: assistantMessage.content,
    streamingReady: true
  };
}