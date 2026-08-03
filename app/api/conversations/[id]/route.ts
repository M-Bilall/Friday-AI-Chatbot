import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/lib/api';
import { requireAuthenticatedUser } from '@/lib/auth';
import { conversationRenameSchema, conversationUpdateSchema } from '@/features/chat/chat.schema';
import { deleteConversation, getConversationOrThrow, renameConversation, updateConversation } from '@/services/conversations.service';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const user = await requireAuthenticatedUser();
  const { id } = await params;

  try {
    const conversation = await getConversationOrThrow(user.id, id);
    return successResponse({ conversation });
  } catch {
    return errorResponse('Conversation not found', 'NOT_FOUND', 404);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const user = await requireAuthenticatedUser();
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const renameResult = conversationRenameSchema.safeParse(body);
  const updateResult = conversationUpdateSchema.safeParse(body);

  if (renameResult.success) {
    const conversation = await renameConversation(user.id, id, renameResult.data);
    return successResponse({ conversation });
  }

  if (updateResult.success) {
    const conversation = await updateConversation(user.id, id, updateResult.data);
    return successResponse({ conversation });
  }

  return errorResponse('Invalid conversation update', 'VALIDATION_ERROR', 400, {
    rename: renameResult.error?.flatten(),
    update: updateResult.error?.flatten()
  });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const user = await requireAuthenticatedUser();
  const { id } = await params;

  await deleteConversation(user.id, id);

  return successResponse({ deleted: true });
}