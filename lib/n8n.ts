import { serverEnv } from '@/lib/env.server';

export type N8nChatInput = {
  conversationId: string;
  message: string;
  model: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  history: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  metadata?: Record<string, unknown>;
};

export type N8nChatOutput = {
  reply: string;
  title?: string;
  summary?: string;
  raw?: unknown;
};

export async function sendMessageToN8n(payload: N8nChatInput) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(serverEnv.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(serverEnv.N8N_WEBHOOK_SECRET ? { 'x-friday-webhook-secret': serverEnv.N8N_WEBHOOK_SECRET } : {})
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed with status ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const raw = (await response.json()) as Partial<N8nChatOutput> & { message?: string; content?: string; response?: string };

      return {
        reply: raw.reply ?? raw.message ?? raw.content ?? raw.response ?? '',
        title: raw.title,
        summary: raw.summary,
        raw
      } satisfies N8nChatOutput;
    }

    const reply = await response.text();
    return {
      reply,
      raw: { reply }
    } satisfies N8nChatOutput;
  } finally {
    clearTimeout(timeout);
  }
}