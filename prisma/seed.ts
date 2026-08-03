import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { supabaseUserId: 'seed-user' },
    update: {},
    create: {
      supabaseUserId: 'seed-user',
      email: 'friday@example.com',
      name: 'Friday User',
      avatarUrl: null,
      settings: {
        create: {
          theme: 'DARK',
          defaultModel: 'friday-default'
        }
      }
    }
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: 'friday-personal' },
    update: {},
    create: {
      name: 'Personal Workspace',
      slug: 'friday-personal',
      ownerId: user.id,
      isPersonal: true,
      members: {
        create: {
          userId: user.id,
          role: 'OWNER'
        }
      }
    }
  });

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      workspaceId: workspace.id,
      title: 'Welcome to Friday',
      summary: 'Starter conversation for the seeded workspace.',
      model: 'friday-default',
      isPinned: true,
      isFavorite: true,
      messages: {
        create: [
          {
            role: 'SYSTEM',
            content: 'You are Friday, a concise, proactive AI assistant.',
            status: 'SENT'
          },
          {
            role: 'ASSISTANT',
            content: 'I am ready to help manage conversations, settings, and workflows.',
            status: 'SENT'
          }
        ]
      }
    }
  });

  await prisma.subscription.upsert({
    where: { workspaceId: workspace.id },
    update: {},
    create: {
      workspaceId: workspace.id,
      provider: 'MANUAL',
      status: 'TRIALING'
    }
  });

  console.log({ user: user.id, workspace: workspace.id, conversation: conversation.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });