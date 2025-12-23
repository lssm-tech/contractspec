import * as React from 'react';
import { View } from 'react-native';
import type { SkeletonCircleProps } from './types';

export function SkeletonCircle({
  size = 32,
  sizeClass,
  className,
}: SkeletonCircleProps) {
  if (sizeClass) {
    return (
      <View
        className={['bg-muted rounded-full', sizeClass, className]
          .filter(Boolean)
          .join(' ')}
      />
    );
  }
  return (
    <View
      className={['bg-muted rounded-full', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
    />
  );
}

export default SkeletonCircle;
