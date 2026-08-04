"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { settingsUpdateSchema } from '@/features/settings/settings.schema';
import { updateSettingsRequest } from '@/features/settings/settings.api';

type SettingsFormValues = {
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  defaultModel: string;
  language: string;
  timezone: string;
  compactMode: boolean;
  sendReadReceipts: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
};

export function SettingsForm({ initialValues }: { initialValues: SettingsFormValues }) {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsUpdateSchema),
    defaultValues: initialValues
  });

  async function onSubmit(values: SettingsFormValues) {
    setMessage(null);
    await updateSettingsRequest(values);
    setMessage('Settings saved successfully.');
  }

  return (
    <Card className="overflow-hidden bg-card/80 backdrop-blur-xl">
      <CardHeader className="border-b border-border bg-background/40">
        <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-foreground">Preferences</CardTitle>
        <CardDescription>Control appearance, defaults, and future notification behavior.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <select id="theme" className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-ring" {...form.register('theme')}>
              <option value="DARK">Dark</option>
              <option value="LIGHT">Light</option>
              <option value="SYSTEM">System</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultModel">Default model</Label>
            <Input id="defaultModel" className="rounded-2xl" {...form.register('defaultModel')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input id="language" className="rounded-2xl" {...form.register('language')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" className="rounded-2xl" {...form.register('timezone')} />
          </div>

          {[
            { title: 'Compact mode', description: 'Reduce spacing for denser dashboards.', name: 'compactMode' as const },
            { title: 'Read receipts', description: 'Store delivery/read metadata for future collaboration features.', name: 'sendReadReceipts' as const },
            { title: 'Email notifications', description: 'Future automated notifications and digests.', name: 'emailNotifications' as const },
            { title: 'Marketing emails', description: 'Opt into product updates and release notes.', name: 'marketingEmails' as const }
          ].map((option) => (
            <div key={option.name} className="flex items-center justify-between rounded-3xl border border-border bg-background/70 px-4 py-4 md:col-span-2">
              <div>
                <p className="text-sm font-medium text-foreground">{option.title}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              <Switch checked={form.watch(option.name)} onChange={(event) => form.setValue(option.name, event.currentTarget.checked)} />
            </div>
          ))}

          {message ? <p className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-foreground md:col-span-2">{message}</p> : null}

          <Button type="submit" disabled={form.formState.isSubmitting} className="md:col-span-2 rounded-full px-5">
            {form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Save settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}