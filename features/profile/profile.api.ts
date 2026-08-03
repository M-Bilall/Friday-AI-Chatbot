export async function updateProfileRequest(payload: { name: string; avatarUrl?: string | null; companyName?: string | null }) {
  const response = await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error?.message ?? 'Failed to update profile');
  }

  return body.data as { profile: unknown };
}