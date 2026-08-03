"use client";

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Archive, ChevronDown, Heart, MessageSquarePlus, Pencil, Pin, Search, Sparkles, Trash2, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createConversation as createConversationApi, getConversations, getMessages, sendChatMessage, renameConversation, toggleConversationState, deleteConversation } from '@/features/chat/api';
import { MessageItem } from '@/features/chat/components/message-item';
import { Composer } from '@/features/chat/components/composer';
import { uploadAttachmentRequest } from '@/features/upload/upload.api';
import { cn } from '@/lib/utils';

type WorkspaceProps = {
  initialConversationId?: string | null;
};

export function ChatWorkspace({ initialConversationId }: WorkspaceProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConversationId ?? null);
  const [draft, setDraft] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const conversationsQuery = useQuery({
    queryKey: ['conversations', query],
    queryFn: () => getConversations({ query }),
    refetchOnWindowFocus: false
  });

  const activeConversationQuery = useQuery({
    queryKey: ['messages', activeConversationId],
    queryFn: () => getMessages(activeConversationId ?? ''),
    enabled: Boolean(activeConversationId)
  });

  useEffect(() => {
    const selected = searchParams.get('conversation');
    if (selected) {
      setActiveConversationId(selected);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!activeConversationId && conversationsQuery.data?.conversations?.[0]) {
      setActiveConversationId(conversationsQuery.data.conversations[0].id);
    }
  }, [activeConversationId, conversationsQuery.data]);

  const sendMessageMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess(result) {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', result.conversation.id] });
      setActiveConversationId(result.conversation.id);
      startTransition(() => router.replace(`/chat?conversation=${result.conversation.id}`));
    }
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => renameConversation(id, title),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof toggleConversationState>[1] }) => toggleConversationState(id, payload),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setActiveConversationId(null);
      router.replace('/chat');
    }
  });

  const conversations = conversationsQuery.data?.conversations ?? [];
  const activeConversation = useMemo(() => conversations.find((conversation) => conversation.id === activeConversationId) ?? null, [activeConversationId, conversations]);
  const messages = activeConversationQuery.data?.messages ?? activeConversation?.messages ?? [];

  const suggestedPrompts = [
    'Summarize the latest project updates.',
    'Draft a polished email response.',
    'Give me a plan for today’s priorities.',
    'Help me rewrite this text to sound concise.'
  ];

  async function handleSend(payload: { message: string; attachments: File[] }) {
    let conversationId = activeConversationId;

    if (!conversationId) {
      const created = await createConversationApi({ title: 'New conversation', model: 'friday-default' });
      conversationId = created.conversation.id;
      setActiveConversationId(conversationId);
      router.replace(`/chat?conversation=${conversationId}`);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }

    const uploadedAttachments = await Promise.all(
      payload.attachments.map(async (file) => {
        const attachment = await uploadAttachmentRequest(file, { conversationId: conversationId ?? undefined, purpose: 'conversation' });
        return {
          id: attachment.attachment.id,
          name: attachment.attachment.name,
          url: attachment.attachment.url
        };
      })
    );

    await sendMessageMutation.mutateAsync({
      message: payload.message,
      attachments: uploadedAttachments,
      conversationId: conversationId ?? undefined,
      model: activeConversation?.model ?? 'friday-default'
    });
  }

  async function handleNewConversation() {
    const result = await createConversationApi({ title: 'New conversation', model: 'friday-default' });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    setActiveConversationId(result.conversation.id);
    router.replace(`/chat?conversation=${result.conversation.id}`);
  }

  function exportCurrentConversation() {
    if (!activeConversation) return;

    const payload = {
      conversation: {
        id: activeConversation.id,
        title: activeConversation.title,
        summary: activeConversation.summary,
        model: activeConversation.model,
        isPinned: activeConversation.isPinned,
        isFavorite: activeConversation.isFavorite,
        archivedAt: activeConversation.archivedAt
      },
      messages: messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt
      }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${activeConversation.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'conversation'}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1800px] gap-4 px-3 py-3 sm:px-6 lg:px-8">
      <aside className="hidden w-[340px] shrink-0 flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1016]/85 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl xl:flex">
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">Conversation history</p>
              <p className="text-xs text-white/45">Search, pin, and revisit your threads</p>
            </div>
            <Button size="icon" variant="ghost" onClick={handleNewConversation} className="rounded-full text-white/70 hover:bg-white/6 hover:text-white">
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3">
            <Search className="h-4 w-4 text-white/35" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" className="border-none bg-transparent px-0 text-sm text-white placeholder:text-white/35 focus-visible:ring-0" />
          </div>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {conversationsQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-3xl bg-white/5" />
              ))}
            </div>
          ) : conversations.length ? (
            conversations.map((conversation, index) => (
              <motion.button
                key={conversation.id}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: index * 0.03 }}
                onClick={() => setActiveConversationId(conversation.id)}
                className={cn(
                  'w-full rounded-3xl border px-4 py-3 text-left transition-colors',
                  conversation.id === activeConversationId ? 'border-white/10 bg-white/10' : 'border-transparent bg-transparent hover:bg-white/5'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{conversation.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/45">{conversation.summary ?? conversation.messages?.[0]?.content ?? 'No preview available yet.'}</p>
                  </div>
                  <div className="flex items-center gap-1 text-white/60">
                    {conversation.isPinned ? <Pin className="h-3.5 w-3.5" /> : null}
                    {conversation.isFavorite ? <Heart className="h-3.5 w-3.5 text-emerald-400" /> : null}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Badge variant="outline" className="border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.2em] text-white/60">{conversation.model}</Badge>
                  {conversation.lastMessageAt ? <span className="text-[11px] text-white/40">{new Date(conversation.lastMessageAt).toLocaleDateString()}</span> : null}
                </div>
              </motion.button>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 p-6 text-center text-sm text-white/50">
              No conversations yet.
            </div>
          )}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0d12]/90 shadow-[0_20px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{activeConversation?.title ?? 'New conversation'}</p>
            <p className="truncate text-xs text-white/45">{activeConversation?.summary ?? 'Friday will respond through the backend API and n8n webhook.'}</p>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" size="icon" onClick={() => activeConversationId && renameMutation.mutate({ id: activeConversationId, title: `${activeConversation?.title ?? 'Conversation'} · Updated` })} disabled={!activeConversationId || renameMutation.isPending} className="rounded-full text-white/70 hover:bg-white/6 hover:text-white">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => activeConversationId && toggleMutation.mutate({ id: activeConversationId, payload: { isPinned: !activeConversation?.isPinned } })} disabled={!activeConversationId} className="rounded-full text-white/70 hover:bg-white/6 hover:text-white">
              <Pin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => activeConversationId && toggleMutation.mutate({ id: activeConversationId, payload: { isFavorite: !activeConversation?.isFavorite } })} disabled={!activeConversationId} className="rounded-full text-white/70 hover:bg-white/6 hover:text-white">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => activeConversationId && toggleMutation.mutate({ id: activeConversationId, payload: { archivedAt: activeConversation?.archivedAt ? null : new Date().toISOString() } })} disabled={!activeConversationId} className="rounded-full text-white/70 hover:bg-white/6 hover:text-white">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={exportCurrentConversation} disabled={!activeConversationId || !messages.length} className="rounded-full text-white/70 hover:bg-white/6 hover:text-white">
              <Trash2 className="h-4 w-4 rotate-180" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => activeConversationId && deleteMutation.mutate(activeConversationId)} disabled={!activeConversationId} className="rounded-full text-white/70 hover:bg-white/6 hover:text-red-300">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileHistoryOpen(true)} className="rounded-full text-white/70 hover:bg-white/6 hover:text-white">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
            {!messages.length ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 sm:p-8"
              >
                <div className="max-w-2xl space-y-4">
                  <Badge variant="outline" className="border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.24em] text-white/60">Friday assistant</Badge>
                  <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-5xl">How can I help?</h1>
                  <p className="max-w-xl text-sm leading-7 text-white/55 sm:text-base">Start a conversation to route a prompt through the backend API and n8n workflow. The interface stays focused on the work, not the chrome.</p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <motion.button
                      key={prompt}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * index }}
                      onClick={() => setDraft(prompt)}
                      className="group rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:bg-white/[0.06]"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 group-hover:text-white">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-6 text-white/80">{prompt}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((message, index) => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 * index }}>
                  <MessageItem key={message.id} role={message.role} content={message.content} timestamp={message.createdAt} onCopy={(value) => navigator.clipboard.writeText(value)} />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {sendError ? (
          <div className="px-4 pb-3 sm:px-6">
            <div className="mx-auto max-w-4xl rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{sendError}</div>
          </div>
        ) : null}

        <div className="border-t border-white/10 bg-[#0b0d12]/95 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
          <div className="mx-auto w-full max-w-4xl">
            <Composer busy={sendMessageMutation.isPending || isPending} onSend={handleSend} onStop={() => undefined} value={draft} onValueChange={setDraft} />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {mobileHistoryOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm xl:hidden"
            onClick={() => setMobileHistoryOpen(false)}
          >
            <motion.aside
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={(event) => event.stopPropagation()}
              className="flex h-full w-[min(88vw,340px)] flex-col overflow-hidden border-r border-white/10 bg-[#0d1016]/95 shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div>
                  <p className="text-sm font-medium text-white">Conversation history</p>
                  <p className="text-xs text-white/45">Recent threads</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileHistoryOpen(false)} className="rounded-full text-white/70 hover:bg-white/6 hover:text-white">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => {
                      setActiveConversationId(conversation.id);
                      setMobileHistoryOpen(false);
                    }}
                    className={cn(
                      'w-full rounded-3xl border px-4 py-3 text-left transition-colors',
                      conversation.id === activeConversationId ? 'border-white/10 bg-white/10' : 'border-transparent bg-transparent hover:bg-white/5'
                    )}
                  >
                    <p className="truncate text-sm font-medium text-white">{conversation.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/45">{conversation.summary ?? conversation.messages?.[0]?.content ?? 'No preview available yet.'}</p>
                  </button>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}