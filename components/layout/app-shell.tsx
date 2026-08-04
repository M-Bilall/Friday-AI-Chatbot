"use client";

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Bot, History, LogOut, Menu, Settings, UserCircle2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { cn } from '@/lib/utils';
import { SidebarV2 } from '@/components/layout/sidebar-v2';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/chat', label: 'Chat', icon: Bot },
  { href: '/history', label: 'History', icon: History },
  { href: '/profile', label: 'Profile', icon: UserCircle2 },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export function AppShell({ children, user }: { children: ReactNode; user: { name: string; email: string; avatarUrl?: string | null } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  async function signOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/" as Route);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.1),transparent_28%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] text-foreground lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
      <SidebarV2 user={user} />

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen((value) => !value)} aria-label="Open navigation" className="rounded-full">
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-foreground">F</div>
              <div>
                <p className="text-sm font-medium text-foreground">Friday</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">AI workspace</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <AnimatePresence>
            {mobileNavOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                  className="border-t border-border/70 bg-background/95 px-4 py-4 backdrop-blur-xl"
              >
                <nav className="grid gap-2">
                  {navItems.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href as Route}
                        onClick={() => setMobileNavOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors',
                          active ? 'border-border bg-accent text-accent-foreground' : 'border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-4 flex items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
                  <Avatar className="h-10 w-10 border border-border">
                    {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" className="rounded-full">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </header>

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}