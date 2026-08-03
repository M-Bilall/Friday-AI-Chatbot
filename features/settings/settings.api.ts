export async function updateSettingsRequest(payload: {
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  defaultModel: string;
  language: string;
  timezone: string;
  compactMode: boolean;
  sendReadReceipts: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
}) {
  const response = await fetch('/api/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error?.message ?? 'Failed to update settings');
  }

  return body.data as { settings: unknown };
}