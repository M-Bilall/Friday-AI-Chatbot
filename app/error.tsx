"use client";

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.24em] text-white/40">Application error</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Something went wrong</h1>
        <p className="mt-3 text-sm leading-7 text-white/55">Friday hit an unexpected error. Try reloading the view or refresh the page if the issue persists.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset} className="rounded-full px-5">Try again</Button>
          <Button variant="outline" onClick={() => window.location.reload()} className="rounded-full border-white/10 bg-white/[0.03] px-5 text-white hover:bg-white/[0.06]">
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}