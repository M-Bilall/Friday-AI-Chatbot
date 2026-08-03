import { errorResponse, successResponse } from '@/lib/api';
import { requireAuthenticatedUser } from '@/lib/auth';
import { profileUpdateSchema } from '@/features/profile/profile.schema';
import { getProfile, updateProfile } from '@/services/profile.service';

export async function GET() {
  const user = await requireAuthenticatedUser();
  const profile = await getProfile(user.id);

  return successResponse({ profile });
}

export async function PATCH(request: Request) {
  const user = await requireAuthenticatedUser();
  const body = await request.json().catch(() => ({}));
  const parsed = profileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse('Invalid profile payload', 'VALIDATION_ERROR', 400, parsed.error.flatten());
  }

  const profile = await updateProfile(user.id, parsed.data);
  return successResponse({ profile });
}