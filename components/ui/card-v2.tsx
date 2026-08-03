"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CardV2({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn('glass-panel', className)}
    >
      {children}
    </motion.div>
  );
}
