"use client";

import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== 'light';

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-full"
    >
      {isDark ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
    </Button>
  );
}