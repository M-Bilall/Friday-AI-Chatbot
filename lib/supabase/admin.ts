import 'server-only';

import { createClient } from '@supabase/supabase-js';

import { getClientEnv } from '@/lib/env.client';
import { serverEnv } from '@/lib/env.server';

const clientEnv = getClientEnv();

if (!clientEnv) {
  throw new Error('Missing public Supabase environment variables');
}

export const supabaseAdmin = createClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});