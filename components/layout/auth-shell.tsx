import Link from 'next/link';
import type { ReactNode } from 'react';

import { Logo } from '@/components/logo';

export function AuthShell({ children, eyebrow, title, description }: { children: ReactNode; eyebrow: string; title: string; description: string }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <section className="relative overflow-hidden border-r border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_center,rgba(168,85,247,0.12),transparent_30%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] px-6 py-8 sm:px-10 lg:px-12">
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="relative flex h-full flex-col justify-between gap-12">
          <Link href="/">
            <Logo />
          </Link>
          <div className="max-w-xl space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/45">{eyebrow}</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
            <p className="text-lg leading-8 text-white/55">{description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Secure Supabase auth',
              'Prisma-backed persistence',
              'n8n workflow integration',
              'Dark-first responsive UI'
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-5 text-sm text-white/55 backdrop-blur-xl">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}