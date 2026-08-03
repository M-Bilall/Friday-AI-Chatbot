export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-8 py-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-sky-400" />
        <p className="mt-4 text-sm font-medium text-white">Loading Friday</p>
        <p className="mt-1 text-xs text-white/45">Preparing your workspace</p>
      </div>
    </div>
  );
}