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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_28%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] text-foreground lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
      <SidebarV2 user={user} />

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090b10]/80 backdrop-blur-xl lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen((value) => !value)} aria-label="Open navigation" className="rounded-full text-white/80 hover:bg-white/8 hover:text-white">
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/6 text-sm font-semibold">F</div>
              <div>
                <p className="text-sm font-medium text-white">Friday</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">AI workspace</p>
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
                className="border-t border-white/10 bg-[#0d1016]/96 px-4 py-4 backdrop-blur-xl"
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
                          active ? 'border-white/10 bg-white/10 text-white' : 'border-transparent bg-transparent text-white/60 hover:bg-white/6 hover:text-white'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="mt-4 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-3">
                  <Avatar className="h-10 w-10 border border-white/10">
                    {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{user.name}</p>
                    <p className="truncate text-xs text-white/45">{user.email}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" className="rounded-full text-white/70 hover:bg-white/8 hover:text-white">
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