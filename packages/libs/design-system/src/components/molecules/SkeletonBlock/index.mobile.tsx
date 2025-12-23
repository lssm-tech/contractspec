import * as React from 'react';
import { View } from 'react-native';
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
  return (
    <View
      className={[w, h, radius, 'bg-muted', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

export default SkeletonBlock;
