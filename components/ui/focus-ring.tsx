"use client";

import { cn } from '@/lib/utils';

export function FocusRing({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary', className)}>
      {children}
    </div>
  );
}
