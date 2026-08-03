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
    router.push('/');
    router.refresh();
  }

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05 } })
  };

  return (
    <aside className="hidden lg:flex lg:flex-col border-r border-white/10 bg-[#0d1016]/85 shadow-[0_20px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-6">
        <div>
          <div className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">Friday</div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">AI workspace</p>
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
                  active ? 'border border-white/10 bg-white/10 text-white' : 'border border-transparent text-white/55 hover:border-white/10 hover:bg-white/6 hover:text-white'
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
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
          <Avatar>
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.name} />
            ) : (
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-white/45">{user.email}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" className="text-white/70 hover:bg-white/8 hover:text-white">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
