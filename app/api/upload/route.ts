import { errorResponse, successResponse } from '@/lib/api';
import { requireAuthenticatedUser } from '@/lib/auth';
import { uploadQuerySchema } from '@/features/upload/upload.schema';
import { uploadFile } from '@/services/upload.service';

export async function POST(request: Request) {
  const user = await requireAuthenticatedUser();
  const formData = await request.formData();
  const file = formData.get('file');
  const parsed = uploadQuerySchema.safeParse({
    conversationId: formData.get('conversationId') ?? undefined,
    purpose: formData.get('purpose') ?? 'conversation'
  });

  if (!parsed.success) {
    return errorResponse('Invalid upload metadata', 'VALIDATION_ERROR', 400, parsed.error.flatten());
  }

  if (!(file instanceof File)) {
    return errorResponse('A file is required', 'VALIDATION_ERROR', 400);
  }

  const attachment = await uploadFile({
    userId: user.id,
    file,
    conversationId: parsed.data.conversationId,
    purpose: parsed.data.purpose
  });

  return successResponse({ attachment }, { status: 201 });
}