import * as React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../atoms/Button.mobile';
import { Linking } from 'react-native';

export interface ErrorStateProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: React.ReactNode;
  supportHref?: string;
  onContactSupport?: () => void;
  supportLabel?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  icon,
  onRetry,
  retryLabel = 'Retry',
  supportHref,
  onContactSupport,
  supportLabel = 'Contact support',
  className,
}: ErrorStateProps) {
  const onSupport = React.useCallback(() => {
    if (supportHref) Linking.openURL(supportHref).catch(() => {});
    else onContactSupport?.();
  }, [supportHref, onContactSupport]);

  return (
    <View className={['items-center p-6', className].filter(Boolean).join(' ')}>
      {icon}
      <Text className="text-lg font-medium">{title as any}</Text>
      {description ? (
        <Text className="text-muted-foreground mt-1 text-base">
          {description as any}
        </Text>
      ) : null}
      <View className="mt-3 flex-row items-center gap-2">
        {onRetry ? <Button onPress={onRetry}>{retryLabel}</Button> : null}
        <Button variant="ghost" onPress={onSupport}>
          {supportLabel}
        </Button>
      </View>
    </View>
  );
}

export default ErrorState;
