import { errorResponse, successResponse } from '@/lib/api';
import { requireAuthenticatedUser } from '@/lib/auth';
import { sendMessageSchema } from '@/features/chat/chat.schema';
import { runChatTurn } from '@/services/chat.service';

function toStreamResponse(data: unknown) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(`event: message\ndata: ${JSON.stringify(data)}\n\n`));
      controller.enqueue(new TextEncoder().encode('event: done\ndata: {}\n\n'));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  });
}

export async function POST(request: Request) {
  const user = await requireAuthenticatedUser();
  const body = await request.json().catch(() => ({}));
  const parsed = sendMessageSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse('Invalid chat payload', 'VALIDATION_ERROR', 400, parsed.error.flatten());
  }

  try {
    const result = await runChatTurn({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      input: parsed.data
    });

    if (body.stream === true) {
      return toStreamResponse({ conversation: result.conversation, reply: result.reply, streamingReady: true });
    }

    return successResponse(result, { status: 201 });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Failed to send message', 'CHAT_ERROR', 502);
  }
}