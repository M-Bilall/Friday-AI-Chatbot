import { errorResponse, successResponse } from '@/lib/api';
import { requireAuthenticatedUser } from '@/lib/auth';
import { settingsUpdateSchema } from '@/features/settings/settings.schema';
import { getSettings, updateSettings } from '@/services/settings.service';

export async function GET() {
  const user = await requireAuthenticatedUser();
  const settings = await getSettings(user.id);

  return successResponse({ settings });
}

export async function PATCH(request: Request) {
  const user = await requireAuthenticatedUser();
  const body = await request.json().catch(() => ({}));
  const parsed = settingsUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse('Invalid settings payload', 'VALIDATION_ERROR', 400, parsed.error.flatten());
  }

  const settings = await updateSettings(user.id, parsed.data);
  return successResponse({ settings });
}