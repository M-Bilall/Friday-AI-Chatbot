import Link from 'next/link';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingShell } from '@/components/layout/marketing-shell';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    description: 'For evaluation and internal testing.',
    features: ['Single workspace', 'Conversation history', 'Secure auth']
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For shipping a serious AI product.',
    featured: true,
    features: ['Team-ready architecture', 'Uploads and RAG ready', 'Priority support']
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For regulated production deployments.',
    features: ['SSO and governance', 'Advanced workspace controls', 'Custom retention policies']
  }
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="max-w-3xl space-y-5 rounded-[2rem] border border-border bg-card/80 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">Pricing built for a future product, not a toy demo.</h1>
          <p className="text-lg leading-8 text-muted-foreground">This build ships the structure you need now and leaves room for subscriptions, team workspaces, and enterprise controls later.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.featured ? 'overflow-hidden border-primary/30 bg-card/90 backdrop-blur-xl' : 'overflow-hidden bg-card/80 backdrop-blur-xl'}>
              <CardHeader>
                <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-foreground">{plan.name}</CardTitle>
                <div className="text-4xl font-semibold text-foreground">{plan.price}</div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-foreground">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span>{feature}</span>
                  </div>
                ))}
                <Button asChild className="mt-4 w-full rounded-full" variant={plan.featured ? 'default' : 'outline'}>
                  <Link href="/signup">Choose {plan.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}