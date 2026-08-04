import { Badge } from '@/components/ui/badge';
import { requireAuthenticatedUser } from '@/lib/auth';
import { getProfile } from '@/services/profile.service';
import { ProfileForm } from '@/features/profile/components/profile-form';

export default async function ProfilePage() {
  const user = await requireAuthenticatedUser();
  const profile = await getProfile(user.id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="outline">Profile</Badge>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-foreground">Identity and account details.</h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">Keep your account identity, avatar, and company metadata consistent across Friday.</p>
      </div>
      <ProfileForm
        initialValues={{
          name: profile?.name ?? '',
          avatarUrl: profile?.avatarUrl ?? '',
          companyName: profile?.settings?.companyName ?? ''
        }}
      />
    </div>
  );
}