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
        <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-white sm:text-6xl">Friday is the product shell around an existing AI agent.</h1>
          <p className="text-lg leading-8 text-white/55">The goal here is not to fake the agent. The goal is to ship the full application layer, the secure data model, and the polished interface users expect from a serious AI SaaS.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {points.map((point) => (
            <Card key={point.title} className="overflow-hidden border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl">
              <CardHeader>
                <point.icon className="h-6 w-6 text-sky-300" />
                <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-white">{point.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-white/50">{point.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}