import Link from 'next/link';
import type { Route } from 'next';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">The requested route does not exist or has moved.</p>
        <Button asChild className="mt-6">
          <Link href={"/" as Route}>Return home</Link>
        </Button>
      </div>
    </div>
  );
}