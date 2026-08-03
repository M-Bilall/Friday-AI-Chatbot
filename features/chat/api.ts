import type { ConversationFilterInput, SendMessageInput } from '@/features/chat/chat.schema';

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    credentials: 'include'
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error?.message ?? 'Request failed');
  }

  return body.data as T;
}

export type ChatConversation = {
  id: string;
  title: string;
  summary: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  archivedAt: string | null;
  lastMessageAt: string | null;
  model: string;
  messages?: Array<{
    id: string;
    role: 'USER' | 'ASSISTANT' | 'SYSTEM';
    content: string;
    createdAt: string;
  }>;
};

export type ChatMessage = {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: string;
};

export async function getConversations(filters: ConversationFilterInput = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  return fetchJson<{ conversations: ChatConversation[] }>(`/api/conversations?${searchParams.toString()}`);
}

export async function createConversation(payload: { title?: string; workspaceId?: string; model?: string; summary?: string }) {
  return fetchJson<{ conversation: ChatConversation }>('/api/conversations', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function getMessages(conversationId: string) {
  return fetchJson<{ conversationId: string; messages: ChatMessage[] }>(`/api/messages?conversationId=${conversationId}`);
}

export async function sendChatMessage(payload: SendMessageInput & { stream?: boolean }) {
  return fetchJson<{ conversation: ChatConversation; reply: string; streamingReady: boolean; assistantMessage: ChatMessage; userMessage: ChatMessage }>(
    '/api/chat',
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  );
}

export async function renameConversation(conversationId: string, title: string) {
  return fetchJson<{ conversation: ChatConversation }>(`/api/conversations/${conversationId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title })
  });
}

export async function toggleConversationState(conversationId: string, payload: { isPinned?: boolean; isFavorite?: boolean; archivedAt?: string | null }) {
  return fetchJson<{ conversation: ChatConversation }>(`/api/conversations/${conversationId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function deleteConversation(conversationId: string) {
  return fetchJson<{ deleted: boolean }>(`/api/conversations/${conversationId}`, {
    method: 'DELETE'
  });
}