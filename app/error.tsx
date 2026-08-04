"use client";

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg rounded-[2rem] border border-border bg-card/90 p-8 text-center shadow-[var(--shadow-soft)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Application error</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Something went wrong</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">Friday hit an unexpected error. Try reloading the view or refresh the page if the issue persists.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset} className="rounded-full px-5">Try again</Button>
          <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full px-5">
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}