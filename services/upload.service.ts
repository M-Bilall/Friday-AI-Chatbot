import 'server-only';

import { randomUUID } from 'crypto';

import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { serverEnv } from '@/lib/env.server';

export async function uploadFile(params: {
  userId: string;
  file: File;
  conversationId?: string;
  purpose: 'conversation' | 'profile' | 'knowledge-base';
}) {
  const arrayBuffer = await params.file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${params.userId}/${params.purpose}/${randomUUID()}-${fileName}`;

  const { error } = await supabaseAdmin.storage.from(serverEnv.SUPABASE_STORAGE_BUCKET).upload(path, buffer, {
    contentType: params.file.type,
    cacheControl: '3600',
    upsert: false
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage.from(serverEnv.SUPABASE_STORAGE_BUCKET).getPublicUrl(path);

  return prisma.attachment.create({
    data: {
      userId: params.userId,
      conversationId: params.conversationId,
      bucket: serverEnv.SUPABASE_STORAGE_BUCKET,
      path,
      url: data.publicUrl,
      name: params.file.name,
      mimeType: params.file.type || 'application/octet-stream',
      size: params.file.size,
      kind: params.file.type.startsWith('image/') ? 'IMAGE' : params.file.type.includes('pdf') ? 'DOCUMENT' : 'FILE'
    }
  });
}