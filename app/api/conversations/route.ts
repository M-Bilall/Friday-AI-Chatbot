import { NextRequest } from 'next/server';

import { errorResponse, successResponse } from '@/lib/api';
import { requireAuthenticatedUser } from '@/lib/auth';
import { conversationFilterSchema, conversationRenameSchema } from '@/features/chat/chat.schema';
import { createConversation, listConversations } from '@/services/conversations.service';

export async function GET(request: NextRequest) {
  const user = await requireAuthenticatedUser();
  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = conversationFilterSchema.safeParse(searchParams);

  if (!parsed.success) {
    return errorResponse('Invalid conversation filters', 'VALIDATION_ERROR', 400, parsed.error.flatten());
  }

  const conversations = await listConversations(user.id, parsed.data);
  return successResponse({ conversations });
}

export async function POST(request: Request) {
  const user = await requireAuthenticatedUser();
  const body = await request.json().catch(() => ({}));
  const parsed = conversationRenameSchema.safeParse({ title: body.title ?? 'New conversation' });

  if (!parsed.success) {
    return errorResponse('Invalid conversation payload', 'VALIDATION_ERROR', 400, parsed.error.flatten());
  }

  const conversation = await createConversation(user.id, {
    title: parsed.data.title,
    workspaceId: body.workspaceId,
    model: body.model,
    summary: body.summary
  });

  return successResponse({ conversation }, { status: 201 });
}