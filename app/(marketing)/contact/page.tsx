import { Mail, MapPin, Phone } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketingShell } from '@/components/layout/marketing-shell';

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-white sm:text-6xl">Contact Friday.</h1>
          <p className="text-lg leading-8 text-white/55">This build is ready to wire into a real support flow, but the page already presents the right structure for production contact channels.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            { icon: Mail, title: 'Email', description: 'support@friday.ai' },
            { icon: Phone, title: 'Phone', description: '+1 (555) 000-2026' },
            { icon: MapPin, title: 'Location', description: 'Remote-first, global team' }
          ].map((entry) => (
            <Card key={entry.title} className="overflow-hidden border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl">
              <CardHeader>
                <entry.icon className="h-6 w-6 text-sky-300" />
                <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-white">{entry.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-white/50">{entry.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}