import * as React from 'react';
import { View } from 'react-native';
import type { SkeletonListProps } from './types';
import { SkeletonBlock } from '../SkeletonBlock';

export function SkeletonList({ count = 10, className }: SkeletonListProps) {
  return (
    <View className={className}>
      {Array.from({ length: Math.max(1, count) }).map((_, i) => (
        <View key={i} className="mb-2">
          <SkeletonBlock h="h-5" rounded="md" />
        </View>
      ))}
    </View>
  );
}

export default SkeletonList;
