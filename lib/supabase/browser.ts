import { createBrowserClient } from '@supabase/ssr';

import { getClientEnv } from '@/lib/env.client';

export function createSupabaseBrowserClient() {
  const env = getClientEnv();

  if (!env) {
    return null;
  }

  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}