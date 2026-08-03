import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import { getClientEnv } from '@/lib/env.client';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const clientEnv = getClientEnv();

  if (!clientEnv) {
    throw new Error('Missing public Supabase environment variables');
  }

  type CookieToSet = {
    name: string;
    value: string;
    options: Parameters<typeof cookieStore.set>[2];
  };

  return createServerClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component; session refresh is handled by middleware.
        }
      }
    }
  });
}