import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Bot, BrainCircuit, ShieldCheck, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthenticatedSupabaseUser } from '@/lib/auth';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI workspace built for scale',
    description: 'Friday keeps conversations, profiles, and settings isolated with a clean architecture that is ready for growth.'
  },
  {
    icon: ShieldCheck,
    title: 'Authentication and guardrails',
    description: 'Supabase authentication, protected routes, validation, and server-side API boundaries keep the app secure.'
  },
  {
    icon: Bot,
    title: 'n8n-powered conversations',
    description: 'The frontend never talks to n8n directly. Every chat request flows through the Next.js API layer first.'
  }
];

export default async function HomePage() {
  const user = await getAuthenticatedSupabaseUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.16),transparent_45%),radial-gradient(circle_at_center,hsl(var(--secondary)/0.1),transparent_34%)]" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 sm:px-10 lg:px-12">
          <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-[var(--shadow-soft)] backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-primary" />
                Production AI SaaS platform for Friday
              </div>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-balance font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  A premium AI assistant workspace for serious products.
                </h1>
                <p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
                  Friday pairs a polished, ChatGPT-class interface with Supabase auth, Prisma persistence, and a backend that safely brokers every n8n request.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup">
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {['Auth + settings', 'History + search', 'Streaming-ready API'].map((item) => (
                  <div key={item} className="rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm text-muted-foreground shadow-[var(--shadow-soft)] backdrop-blur-xl">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <Card className="overflow-hidden bg-card/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-foreground">Dashboard preview</CardTitle>
                <CardDescription>Modern, responsive, and ready for production workflows.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.title} className="rounded-3xl border border-border bg-background/60 p-4">
                    <feature.icon className="mb-3 h-5 w-5 text-primary" />
                    <h2 className="mb-2 font-medium text-foreground">{feature.title}</h2>
                    <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}