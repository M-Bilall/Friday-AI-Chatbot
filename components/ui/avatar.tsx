import * as React from 'react';

import { cn } from '@/lib/utils';

function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted', className)} {...props} />;
}

import Image from 'next/image';

type AvatarImageProps = {
  src: string;
  alt: string;
  className?: string;
};

function AvatarImage({ src, alt, className }: AvatarImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn('aspect-square h-full w-full object-cover', className)}
    />
  );
}

function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium', className)} {...props} />;
}

export { Avatar, AvatarImage, AvatarFallback };