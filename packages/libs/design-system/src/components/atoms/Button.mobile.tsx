import * as React from 'react';
import {
  Button as NativeButton,
  type ButtonProps as NativeButtonProps,
} from '@lssm/lib.ui-kit/ui/button';
import { ActivityIndicator, type PressableProps } from 'react-native';
import { HStack } from '@lssm/lib.ui-kit/ui/stack';
import { Text } from '@lssm/lib.ui-kit/ui/text';

type SpinnerPlacement = 'start' | 'end';

export type ButtonProps = NativeButtonProps &
  Omit<PressableProps, 'disabled'> & {
    loading?: boolean;
    loadingText?: string;
    spinnerPlacement?: SpinnerPlacement;
  };

export function Button({
  children,
  loading,
  loadingText,
  spinnerPlacement = 'start',
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  const content = loading ? (
    <HStack className="items-center gap-x-2">
      {spinnerPlacement === 'start' ? (
        <ActivityIndicator
          size="small"
          color={props.variant === 'outline' ? '#6b7280' : '#ffffff'}
        />
      ) : null}
      <Text>{loadingText || 'Loading…'}</Text>
      {spinnerPlacement === 'end' ? (
        <ActivityIndicator
          size="small"
          color={props.variant === 'outline' ? '#6b7280' : '#ffffff'}
        />
      ) : null}
    </HStack>
  ) : (
    children
  );

  return (
    <NativeButton disabled={isDisabled} {...props}>
      {content as any}
    </NativeButton>
  );
}

export default Button;
