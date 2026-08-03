import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requireAuthenticatedUser } from '@/lib/auth';
import { getSettings } from '@/services/settings.service';
import { SettingsForm } from '@/features/settings/components/settings-form';

export default async function SettingsPage() {
  const user = await requireAuthenticatedUser();
  const settings = await getSettings(user.id);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-white/70">Settings</Badge>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">Configure how Friday works for you.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">Tune the assistant, notification preferences, and UI density without leaving the workspace.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <Card className="overflow-hidden border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <CardHeader className="border-b border-white/10 bg-white/[0.02]">
            <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-white">Workspace snapshot</CardTitle>
            <CardDescription className="text-white/50">Your current defaults and system state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 text-sm text-white/60">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/35">Theme</p>
              <p className="mt-2 text-base text-white">{settings?.theme ?? 'DARK'}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/35">Default model</p>
              <p className="mt-2 text-base text-white">{settings?.defaultModel ?? 'friday-default'}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/35">Notifications</p>
              <p className="mt-2 text-base text-white">{settings?.emailNotifications ? 'Enabled' : 'Disabled'}</p>
            </div>
          </CardContent>
        </Card>
        <SettingsForm
          initialValues={{
            theme: settings?.theme ?? 'DARK',
            defaultModel: settings?.defaultModel ?? 'friday-default',
            language: settings?.language ?? 'en',
            timezone: settings?.timezone ?? 'UTC',
            compactMode: settings?.compactMode ?? false,
            sendReadReceipts: settings?.sendReadReceipts ?? true,
            emailNotifications: settings?.emailNotifications ?? true,
            marketingEmails: settings?.marketingEmails ?? false
          }}
        />
      </div>
    </div>
  );
}