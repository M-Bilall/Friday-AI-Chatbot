import * as React from 'react';

import { cn } from '@/lib/utils';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => {
  return (
    <label className={cn('relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full bg-muted transition-colors has-[:checked]:bg-primary', className)}>
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-full bg-background shadow transition-transform peer-checked:translate-x-5" />
    </label>
  );
});
Switch.displayName = 'Switch';

export { Switch };