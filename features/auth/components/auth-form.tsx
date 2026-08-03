"use client";

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github, Mail, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { authEmailSchema, forgotPasswordSchema, signInSchema, signUpSchema } from '@/features/auth/auth.schema';

type Mode = 'login' | 'signup' | 'forgot';
type AuthFormValues = {
  name?: string;
  email: string;
  password?: string;
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';
  const [formError, setFormError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | null>(null);
  const supabase = createSupabaseBrowserClient();

  const schema = mode === 'signup' ? signUpSchema : mode === 'forgot' ? forgotPasswordSchema : signInSchema;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === 'signup'
        ? { name: '', email: '', password: '' }
        : { email: '', password: '' }
  });

  async function handleProviderLogin(provider: 'google' | 'github') {
    if (!supabase) {
      setFormError('Supabase auth is not configured yet. Set the public Supabase variables in .env.local.');
      return;
    }

    setFormError(null);
    setLoadingProvider(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      setFormError(error.message);
      setLoadingProvider(null);
    }
  }

  async function onSubmit(values: AuthFormValues) {
    if (!supabase) {
      setFormError('Supabase auth is not configured yet. Set the public Supabase variables in .env.local.');
      return;
    }

    setFormError(null);

    if (mode === 'login') {
      const parsed = signInSchema.safeParse(values);
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? 'Please check your details');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      if (error) {
        setFormError(error.message);
        return;
      }

      router.push(redirectTo as Route);
      router.refresh();
      return;
    }

    if (mode === 'signup') {
      const parsed = signUpSchema.safeParse(values);
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? 'Please check your details');
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: {
            full_name: parsed.data.name
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      router.push(`/login?registered=${encodeURIComponent(parsed.data.email)}` as Route);
      return;
    }

    const parsed = authEmailSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please enter your email');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${window.location.origin}/login`
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    router.push('/login?reset=sent' as Route);
  }

  return (
    <Card className="glass-panel border-white/10 bg-[hsl(var(--card)/0.86)]">
      <CardHeader>
        <CardTitle className="font-[family-name:var(--font-display)] text-3xl">
          {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password'}
        </CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Sign in to continue to your Friday workspace.'
            : mode === 'signup'
              ? 'Start a secure workspace backed by Supabase and Prisma.'
              : 'We will send a password reset link to your email.'}
        </CardDescription>
        {!supabase ? (
          <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            Supabase public variables are missing, so auth actions are disabled until .env.local is configured.
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        {mode !== 'forgot' ? (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" onClick={() => handleProviderLogin('google')} disabled={loadingProvider !== null || !supabase}>
              {loadingProvider === 'google' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Google
            </Button>
            <Button variant="outline" type="button" onClick={() => handleProviderLogin('github')} disabled={loadingProvider !== null || !supabase}>
              {loadingProvider === 'github' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
              GitHub
            </Button>
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          {mode === 'signup' ? (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Friday Operator" {...form.register('name')} />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...form.register('email')} />
          </div>

          {mode !== 'forgot' ? (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="••••••••" {...form.register('password')} />
            </div>
          ) : null}

          {formError ? <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{formError}</p> : null}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !supabase}>
            {form.formState.isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
          </Button>
        </form>

        <div className="flex flex-col gap-3 text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              <Link href="/forgot-password" className="text-primary transition-colors hover:underline">
                Forgot your password?
              </Link>
              <p>
                New to Friday?{' '}
                <Link href="/signup" className="text-primary transition-colors hover:underline">
                  Create an account
                </Link>
              </p>
            </>
          ) : mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-primary transition-colors hover:underline">
                Sign in
              </Link>
            </p>
          ) : (
            <p>
              Remembered your password?{' '}
              <Link href="/login" className="text-primary transition-colors hover:underline">
                Return to login
              </Link>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}