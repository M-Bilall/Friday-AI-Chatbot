import { Sparkles } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/20">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="leading-none">
        <div className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">Friday</div>
        <div className="text-xs text-muted-foreground">AI assistant platform</div>
      </div>
    </div>
  );
}