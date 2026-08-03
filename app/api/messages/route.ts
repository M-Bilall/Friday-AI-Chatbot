import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/lib/api';
import { requireAuthenticatedUser } from '@/lib/auth';
import { getConversationOrThrow } from '@/services/conversations.service';

export async function GET(request: NextRequest) {
  const user = await requireAuthenticatedUser();
  const conversationId = request.nextUrl.searchParams.get('conversationId');

  if (!conversationId) {
    return errorResponse('conversationId is required', 'VALIDATION_ERROR', 400);
  }

  const conversation = await getConversationOrThrow(user.id, conversationId).catch(() => null);

  if (!conversation) {
    return errorResponse('Messages not found', 'NOT_FOUND', 404);
  }

  return successResponse({ conversationId, messages: conversation.messages, userId: user.id });
}