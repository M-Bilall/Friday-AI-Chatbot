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
      <div className="rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_34%),linear-gradient(180deg,hsl(var(--card)/0.96),hsl(var(--card)/0.9))] p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
        <Badge variant="outline">Settings</Badge>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Configure how Friday works for you.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">Tune the assistant, notification preferences, and UI density without leaving the workspace.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <Card className="overflow-hidden bg-card/80 backdrop-blur-xl">
          <CardHeader className="border-b border-border bg-background/40">
            <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-foreground">Workspace snapshot</CardTitle>
            <CardDescription>Your current defaults and system state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
            <div className="rounded-3xl border border-border bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Theme</p>
              <p className="mt-2 text-base text-foreground">{settings?.theme ?? 'DARK'}</p>
            </div>
            <div className="rounded-3xl border border-border bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Default model</p>
              <p className="mt-2 text-base text-foreground">{settings?.defaultModel ?? 'friday-default'}</p>
            </div>
            <div className="rounded-3xl border border-border bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Notifications</p>
              <p className="mt-2 text-base text-foreground">{settings?.emailNotifications ? 'Enabled' : 'Disabled'}</p>
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