"use client";

import { cn } from '@/lib/utils';

export function GlassPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('glass-panel', className)}>
      {children}
    </div>
  );
}
