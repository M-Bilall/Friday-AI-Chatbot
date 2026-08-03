import 'server-only';

import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getAuthenticatedSupabaseUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function requireAuthenticatedUser() {
  const supabaseUser = await getAuthenticatedSupabaseUser();

  if (!supabaseUser) {
    redirect('/login');
  }

  const email = supabaseUser.email ?? `${supabaseUser.id}@example.local`;
  const name = supabaseUser.user_metadata?.full_name ?? supabaseUser.user_metadata?.name ?? supabaseUser.email?.split('@')[0] ?? 'Friday User';
  const avatarUrl = supabaseUser.user_metadata?.avatar_url ?? null;

  const user = await prisma.user.upsert({
    where: { supabaseUserId: supabaseUser.id },
    create: {
      supabaseUserId: supabaseUser.id,
      email,
      name,
      avatarUrl
    },
    update: {
      email,
      name,
      avatarUrl
    }
  });

  await prisma.userSettings.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {}
  });

  const personalWorkspaceSlug = `personal-${user.id.slice(0, 8)}`;
  const personalWorkspace = await prisma.workspace.upsert({
    where: { slug: personalWorkspaceSlug },
    create: {
      name: 'Personal Workspace',
      slug: personalWorkspaceSlug,
      ownerId: user.id,
      isPersonal: true
    },
    update: {}
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: personalWorkspace.id,
        userId: user.id
      }
    },
    create: {
      workspaceId: personalWorkspace.id,
      userId: user.id,
      role: 'OWNER'
    },
    update: {
      role: 'OWNER'
    }
  });

  return prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    include: { settings: true, ownedWorkspaces: true }
  });
}