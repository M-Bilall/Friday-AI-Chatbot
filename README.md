# Friday

Friday is a production-ready AI SaaS frontend and backend shell built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, Supabase, Prisma, Zod, TanStack Query, React Hook Form, Framer Motion, and pnpm.

## Setup

1. Copy `.env.example` to `.env.local` and fill in the values.
2. Install dependencies with `corepack pnpm install`.
3. Run Prisma migrations with `corepack pnpm db:migrate`.
4. Seed the database with `corepack pnpm db:seed`.
5. Start the app with `corepack pnpm dev`.

## Required Environment Variables

- `DATABASE_URL`
- `APP_URL`
- `N8N_WEBHOOK_URL`
- `N8N_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Commands

- `corepack pnpm install`
- `corepack pnpm dev`
- `corepack pnpm build`
- `corepack pnpm start`
- `corepack pnpm lint`
- `corepack pnpm typecheck`
- `corepack pnpm db:generate`
- `corepack pnpm db:migrate`
- `corepack pnpm db:deploy`
- `corepack pnpm db:seed`

## Notes

- The frontend never calls n8n directly. All agent communication goes through the `/api/chat` route.
- Supabase Authentication is used for email, Google, and GitHub sign-in.
- Prisma persists users, conversations, messages, settings, attachments, workspaces, and subscriptions in Supabase PostgreSQL.
