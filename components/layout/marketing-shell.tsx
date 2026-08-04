import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Route } from 'next';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

const nav = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
          <Link href="/dashboard" aria-label="Friday Dashboard">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href as Route} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-border/70 py-10 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:px-10 lg:px-12 md:flex-row md:items-center md:justify-between">
          <p>Friday is built for production AI SaaS teams.</p>
          <p>Secure auth, reliable storage, and an architecture ready for growth.</p>
        </div>
      </footer>
    </div>
  );
}