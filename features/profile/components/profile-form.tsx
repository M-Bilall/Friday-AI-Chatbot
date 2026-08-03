"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { profileUpdateSchema } from '@/features/profile/profile.schema';
import { updateProfileRequest } from '@/features/profile/profile.api';

type ProfileFormValues = {
  name: string;
  avatarUrl: string;
  companyName: string;
};

export function ProfileForm({ initialValues }: { initialValues: ProfileFormValues }) {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: initialValues
  });

  async function onSubmit(values: ProfileFormValues) {
    setMessage(null);
    await updateProfileRequest({
      name: values.name,
      avatarUrl: values.avatarUrl || null,
      companyName: values.companyName || null
    });
    setMessage('Profile updated successfully.');
  }

  return (
    <Card className="overflow-hidden border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <CardHeader className="border-b border-white/10 bg-white/[0.02]">
        <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-white">Profile details</CardTitle>
        <CardDescription className="text-white/50">Update how Friday identifies you across the app.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/75">Name</Label>
              <Input id="name" className="rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-white/35" {...form.register('name')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white/75">Company</Label>
              <Input id="companyName" className="rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-white/35" {...form.register('companyName')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl" className="text-white/75">Avatar URL</Label>
            <Input id="avatarUrl" placeholder="https://..." className="rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-white/35" {...form.register('avatarUrl')} />
          </div>
          {message ? <p className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p> : null}
          <Button type="submit" disabled={form.formState.isSubmitting} className="rounded-full px-5">
            {form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Save profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}