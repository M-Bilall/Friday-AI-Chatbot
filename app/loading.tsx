export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="rounded-[2rem] border border-border bg-card/90 px-8 py-7 text-center shadow-[var(--shadow-soft)] backdrop-blur-xl">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-border border-t-primary" />
        <p className="mt-4 text-sm font-medium text-foreground">Loading Friday</p>
        <p className="mt-1 text-xs text-muted-foreground">Preparing your workspace</p>
      </div>
    </div>
  );
}