import * as React from 'react';
import { Skeleton } from '@contractspec/lib.ui-kit-web/ui/skeleton';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { SkeletonBlockProps } from './types';

export function SkeletonBlock({
  w = 'w-full',
  h = 'h-4',
  rounded = 'md',
  className,
}: SkeletonBlockProps) {
  const radius =
    rounded === 'full'
      ? 'rounded-full'
      : rounded === 'lg'
        ? 'rounded-lg'
        : rounded === 'sm'
          ? 'rounded-xs'
          : 'rounded-md';
  return <Skeleton className={cn(w, h, radius, className)} />;
}
