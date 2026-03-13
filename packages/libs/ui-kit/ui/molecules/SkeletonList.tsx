import * as React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../skeleton';

interface Props {
  count?: number;
  className?: string;
  itemClassName?: string;
}

export function SkeletonList({
  count = 6,
  className = '',
  itemClassName = '',
}: Props) {
  return (
    <View className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`h-20 rounded-md ${itemClassName}`} />
      ))}
    </View>
  );
}
