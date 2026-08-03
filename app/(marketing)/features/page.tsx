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
        <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/60">
            <Sparkles className="h-4 w-4 text-sky-300" />
            Features
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl">Everything Friday needs to feel like a premium AI product.</h1>
          <p className="text-lg leading-8 text-white/55">Friday is more than a chat window. It is a full application stack with identity, persistence, API boundaries, and a design system built for long-term maintenance.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <Card key={item.title} className="overflow-hidden border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl">
              <CardHeader>
                <item.icon className="h-6 w-6 text-sky-300" />
                <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-white">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-white/50">{item.description}</CardContent>
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