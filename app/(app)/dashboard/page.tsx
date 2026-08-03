import { ArrowUpRight, MessageSquareText, Pin, Star } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { requireAuthenticatedUser } from '@/lib/auth';
import { getDashboardData } from '@/services/dashboard.service';
import type { DashboardConversation } from '@/services/dashboard.service';

export default async function DashboardPage() {
  const user = await requireAuthenticatedUser();
  const dashboard = await getDashboardData(user.id);

  const stats = [
    { label: 'Conversations', value: dashboard.totalConversations, icon: MessageSquareText },
    { label: 'Messages', value: dashboard.totalMessages, icon: ArrowUpRight },
    { label: 'Pinned', value: dashboard.pinnedConversations, icon: Pin },
    { label: 'Favorites', value: dashboard.favoriteConversations, icon: Star }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-white/70">Welcome back</Badge>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">Your Friday workspace</h1>
            <p className="max-w-2xl text-sm leading-7 text-white/55">Monitor activity, jump into conversations, and manage the settings that shape your AI assistant workflow.</p>
          </div>
          <Button asChild className="rounded-full px-5">
            <Link href="/chat">Open chat</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden border-white/10 bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/55">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-sky-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="overflow-hidden border-white/10 bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-white">Recent conversations</CardTitle>
            <CardDescription className="text-white/50">Quick access to your latest threads and favorites.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard.recentConversations.length ? (
              dashboard.recentConversations.map((conversation: DashboardConversation) => (
                <Link key={conversation.id} href={`/chat?conversation=${conversation.id}`} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 transition-colors hover:bg-white/[0.06]">
                  <div>
                    <p className="font-medium text-white">{conversation.title}</p>
                    <p className="mt-1 text-sm text-white/50">{conversation.summary ?? conversation.messages?.[0]?.content ?? 'No preview available.'}</p>
                  </div>
                  <div className="text-right text-xs text-white/45">
                    <p>{conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleDateString() : 'Today'}</p>
                    <p>{conversation.isPinned ? 'Pinned' : conversation.isFavorite ? 'Favorite' : 'Active'}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-white/50">No conversations yet. Start one from chat.</div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-white/10 bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-white">Getting started</CardTitle>
            <CardDescription className="text-white/50">Friday is already configured for the next phase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/55">
            <p>1. Configure Supabase auth providers in the dashboard.</p>
            <p>2. Add the n8n webhook URL and service role key to your environment variables.</p>
            <p>3. Run Prisma migrations, then seed the workspace and sample conversation.</p>
            <p>4. Connect your upload bucket for conversation attachments and future RAG ingestion.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}