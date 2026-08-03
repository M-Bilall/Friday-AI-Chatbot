import { successResponse } from '@/lib/api';
import { getAuthenticatedSupabaseUser, requireAuthenticatedUser } from '@/lib/auth';
import { getProfile } from '@/services/profile.service';

export async function GET() {
  const supabaseUser = await getAuthenticatedSupabaseUser();

  if (!supabaseUser) {
    return successResponse({ authenticated: false, user: null });
  }

  const user = await requireAuthenticatedUser();
  const profile = await getProfile(user.id).catch(() => null);

  return successResponse({
    authenticated: true,
    user: {
      id: supabaseUser.id,
      email: supabaseUser.email,
      profile,
      appUser: user
    }
  });
}