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
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090b10]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
          <Link href="/" aria-label="Friday home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href as Route} className="text-sm text-white/55 transition-colors hover:text-white">
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
      <footer className="border-t border-white/10 py-10 text-sm text-white/45">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:px-10 lg:px-12 md:flex-row md:items-center md:justify-between">
          <p>Friday is built for production AI SaaS teams.</p>
          <p>Secure auth, reliable storage, and an architecture ready for growth.</p>
        </div>
      </footer>
    </div>
  );
}