import { AuthShell } from '@/components/layout/auth-shell';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell eyebrow="Secure access" title="Sign in to Friday" description="Use email, Google, or GitHub authentication to access your AI workspace." >{children}</AuthShell>;
}