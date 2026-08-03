export async function uploadAttachmentRequest(file: File, options: { conversationId?: string; purpose?: 'conversation' | 'profile' | 'knowledge-base' } = {}) {
  const formData = new FormData();
  formData.set('file', file);

  if (options.conversationId) {
    formData.set('conversationId', options.conversationId);
  }

  if (options.purpose) {
    formData.set('purpose', options.purpose);
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error?.message ?? 'Failed to upload file');
  }

  return body.data as {
    attachment: {
      id: string;
      name: string;
      url: string;
      bucket: string;
      path: string;
      mimeType: string;
      size: number;
    };
  };
}