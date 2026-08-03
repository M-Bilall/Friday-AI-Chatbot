import { AppShell } from '@/components/layout/app-shell';
import { requireAuthenticatedUser } from '@/lib/auth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuthenticatedUser();

  return (
    <AppShell
      user={{
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      }}
    >
      {children}
    </AppShell>
  );
}