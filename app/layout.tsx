import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Manrope, Space_Grotesk } from 'next/font/google';

import { QueryProviders } from '@/components/query-providers';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

import './globals.css';

const displayFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  metadataBase: new URL('https://friday.local'),
  title: {
    default: 'Friday',
    template: '%s | Friday'
  },
  description: 'Friday is a premium AI assistant platform with secure chat, history, and settings built for production.',
  applicationName: 'Friday',
  manifest: '/manifest.webmanifest'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(displayFont.variable, bodyFont.variable, 'bg-background font-[family-name:var(--font-body)] text-foreground antialiased')}>
        <ThemeProvider>
          <QueryProviders>{children}</QueryProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}