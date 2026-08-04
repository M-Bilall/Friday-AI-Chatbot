"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Bot, History, LogOut, Settings, UserCircle2, X, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { cn } from '@/lib/utils';

// Nav items definition (same as original)
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/chat', label: 'Chat', icon: Bot },
  { href: '/history', label: 'History', icon: History },
  { href: '/profile', label: 'Profile', icon: UserCircle2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarV2({ user }: { user: { name: string; email: string; avatarUrl?: string | null } }) {
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

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05 } })
  };

  return (
    <aside className="hidden lg:flex lg:flex-col border-r border-border/70 bg-card/80 shadow-[var(--shadow-soft)] backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-6">
        <div>
          <div className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground">Friday</div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">AI workspace</p>
        </div>
        <ThemeToggle />
      </div>
      <nav className="flex-1 space-y-1 px-3 pb-6">
        {navItems.map((item, idx) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <motion.div
              key={item.href}
              custom={idx}
              initial="hidden"
              animate="visible"
              variants={navItemVariants}
            >
              <Link
                href={item.href as Route}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors',
                  active ? 'border border-border bg-accent text-accent-foreground' : 'border border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
      {/* User Card */}
      <div className="border-t border-border/70 p-4">
        <div className="flex items-center gap-3 rounded-3xl border border-border bg-background/80 p-3 shadow-[var(--shadow-soft)]">
          <Avatar>
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.name} />
            ) : (
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
