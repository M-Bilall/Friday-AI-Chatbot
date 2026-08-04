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
      <div className="rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_34%),linear-gradient(180deg,hsl(var(--card)/0.96),hsl(var(--card)/0.9))] p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
        <Badge variant="outline">Conversation history</Badge>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Browse, search, and organize every thread.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">Searchable history, pinned items, favorites, and future export and retention workflows are already represented in the data model.</p>
      </div>
      <Card className="overflow-hidden bg-card/80 backdrop-blur-xl">
        <CardHeader className="border-b border-border bg-background/40">
          <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-foreground">All conversations</CardTitle>
          <CardDescription>{conversations.length} threads found</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-6">
          {conversations.map((conversation) => (
            <Link key={conversation.id} href={`/chat?conversation=${conversation.id}`} className="flex items-center justify-between rounded-3xl border border-border bg-background/70 px-4 py-4 transition-colors hover:bg-accent">
              <div>
                <p className="font-medium text-foreground">{conversation.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{conversation.summary ?? 'No preview available.'}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">Open</Button>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}