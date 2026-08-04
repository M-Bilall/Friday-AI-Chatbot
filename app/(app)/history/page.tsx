import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { requireAuthenticatedUser } from '@/lib/auth';
import { listConversations } from '@/services/conversations.service';

export default async function HistoryPage() {
  const user = await requireAuthenticatedUser();
  const conversations = await listConversations(user.id);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-white/70">Conversation history</Badge>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">Browse, search, and organize every thread.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">Searchable history, pinned items, favorites, and future export and retention workflows are already represented in the data model.</p>
      </div>
      <Card className="overflow-hidden border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <CardHeader className="border-b border-white/10 bg-white/[0.02]">
          <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-white">All conversations</CardTitle>
          <CardDescription className="text-white/50">{conversations.length} threads found</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-6">
          {conversations.map((conversation) => (
            <Link key={conversation.id} href={`/chat?conversation=${conversation.id}`} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 transition-colors hover:bg-white/[0.06]">
              <div>
                <p className="font-medium text-white">{conversation.title}</p>
                <p className="mt-1 text-sm text-white/50">{conversation.summary ?? 'No preview available.'}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]">Open</Button>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}