import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

import { getClientEnv } from '@/lib/env.client';

const protectedPaths = ['/dashboard', '/chat', '/history', '/profile', '/settings', '/api/chat', '/api/conversations', '/api/messages', '/api/profile', '/api/settings', '/api/upload'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const clientEnv = getClientEnv();

  if (!clientEnv) {
    return response;
  }

  type CookieToSet = {
    name: string;
    value: string;
    options: Parameters<NextResponse['cookies']['set']>[2];
  };

  const supabase = createServerClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const { data } = await supabase.auth.getUser();
  const isProtectedRoute = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtectedRoute && !data.user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*', '/history/:path*', '/profile/:path*', '/settings/:path*', '/api/chat/:path*', '/api/conversations/:path*', '/api/messages/:path*', '/api/profile/:path*', '/api/settings/:path*', '/api/upload/:path*']
};