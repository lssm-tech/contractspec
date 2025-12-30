import * as React from 'react';
import { View, Text } from 'react-native';
import { LoaderCircular } from '../atoms/LoaderCircular.mobile';

export interface LoaderBlockProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoaderBlock({
  label,
  description,
  className,
  size = 'md',
}: LoaderBlockProps) {
  return (
    <View
      className={['items-center justify-center p-6', className]
        .filter(Boolean)
        .join(' ')}
    >
      <View className="flex-row items-center gap-3">
        <LoaderCircular size={size} label={label} />
        {description ? (
          <Text className="text-muted-foreground text-base">{description}</Text>
        ) : null}
      </View>
    </View>
  );
}

export default LoaderBlock;
