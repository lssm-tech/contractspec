import * as React from 'react';
import { Skeleton } from '@contractspec/lib.ui-kit-web/ui/skeleton';
import type { SkeletonCircleProps } from './types';

export function SkeletonCircle({
  size = 32,
  sizeClass,
  className,
}: SkeletonCircleProps) {
  const classes = ['rounded-full', sizeClass || undefined, className]
    .filter(Boolean)
    .join(' ');
  return sizeClass ? (
    <Skeleton className={classes} />
  ) : (
    <Skeleton className={classes} style={{ width: size, height: size }} />
  );
}
