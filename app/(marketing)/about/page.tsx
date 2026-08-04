import { Bot, ShieldCheck, Workflow } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingShell } from '@/components/layout/marketing-shell';

const points = [
  { icon: Bot, title: 'n8n-first integration', description: 'Friday is centered on a webhook-backed AI agent already running in n8n.' },
  { icon: ShieldCheck, title: 'Security by design', description: 'Every request passes through a backend route with schema validation and auth checks.' },
  { icon: Workflow, title: 'Built to evolve', description: 'The architecture already includes database models and route boundaries for future expansion.' }
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="max-w-3xl space-y-5 rounded-[2rem] border border-border bg-card/80 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">Friday is the product shell around an existing AI agent.</h1>
          <p className="text-lg leading-8 text-muted-foreground">The goal here is not to fake the agent. The goal is to ship the full application layer, the secure data model, and the polished interface users expect from a serious AI SaaS.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {points.map((point) => (
            <Card key={point.title} className="overflow-hidden bg-card/80 backdrop-blur-xl">
              <CardHeader>
                <point.icon className="h-6 w-6 text-primary" />
                <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-foreground">{point.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">{point.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}