import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Friday',
    short_name: 'Friday',
    description: 'Friday is a production AI assistant SaaS built on Next.js, Supabase, Prisma, and n8n.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#3b82f6',
    icons: []
  };
}