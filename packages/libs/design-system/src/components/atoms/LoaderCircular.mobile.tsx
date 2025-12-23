import * as React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

export interface LoaderCircularProps {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted';
  label?: React.ReactNode;
  className?: string;
}

function toNativeSize(size?: 'sm' | 'md' | 'lg'): number | 'small' | 'large' {
  switch (size) {
    case 'sm':
      return 'small';
    case 'lg':
      return 'large';
    case 'md':
    default:
      return 'small';
  }
}

export function LoaderCircular({
  size = 'md',
  label,
  className,
}: LoaderCircularProps) {
  return (
    <View
      className={['inline-flex flex-row items-center gap-2', className]
        .filter(Boolean)
        .join(' ')}
    >
      <ActivityIndicator size={toNativeSize(size)} />
      {label ? (
        <Text className="text-muted-foreground text-base">{label}</Text>
      ) : null}
    </View>
  );
}

export default LoaderCircular;
