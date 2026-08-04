import { ArrowRight, Bot, FileText, LockKeyhole, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingShell } from '@/components/layout/marketing-shell';

const items = [
  {
    icon: Bot,
    title: 'Agentic chat system',
    description: 'The app is built around an existing n8n AI agent with a secure API bridge in the middle.'
  },
  {
    icon: FileText,
    title: 'Conversation intelligence',
    description: 'Searchable history, pinned threads, favorites, and export-friendly data structures are included.'
  },
  {
    icon: LockKeyhole,
    title: 'Enterprise-ready access',
    description: 'Supabase authentication, protected routes, and server validation are designed for production use.'
  }
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="max-w-3xl space-y-5 rounded-[2rem] border border-border bg-card/80 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Features
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-6xl">Everything Friday needs to feel like a premium AI product.</h1>
          <p className="text-lg leading-8 text-muted-foreground">Friday is more than a chat window. It is a full application stack with identity, persistence, API boundaries, and a design system built for long-term maintenance.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <Card key={item.title} className="overflow-hidden bg-card/80 backdrop-blur-xl">
              <CardHeader>
                <item.icon className="h-6 w-6 text-primary" />
                <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-foreground">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">{item.description}</CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/signup">
              Start building
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>
      </section>
    </MarketingShell>
  );
}