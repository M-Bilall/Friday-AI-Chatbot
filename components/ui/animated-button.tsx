"use client";

import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AnimatedButton({ className, ...props }: ButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={cn('inline-block', className)}>
      <Button {...props} />
    </motion.div>
  );
}
