import * as React from 'react';
import { Input as NativeInput } from '@lssm/lib.ui-kit/ui/input';
import { mapKeyboardToNative, type KeyboardOptions } from '../../lib/keyboard';

interface BaseFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (text: string) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
  keyboard?: KeyboardOptions;
}

type NativeInputComponentProps = React.ComponentProps<typeof NativeInput>;
export type InputProps = Omit<
  NativeInputComponentProps,
  'onChangeText' | 'value' | 'defaultValue'
> &
  BaseFieldProps;

export function Input({
  value,
  defaultValue,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  placeholder,
  disabled,
  maxLength,
  className,
  keyboard,
  ...rest
}: InputProps) {
  const nativeKeyboard = mapKeyboardToNative(keyboard);

  return (
    <NativeInput
      {...(rest as any)}
      className={className as any}
      value={value as any}
      defaultValue={defaultValue as any}
      onChangeText={onChange as any}
      onSubmitEditing={onSubmit as any}
      onFocus={onFocus as any}
      onBlur={onBlur as any}
      placeholder={placeholder}
      editable={!disabled}
      maxLength={maxLength}
      {...(nativeKeyboard as any)}
    />
  );
}

export default Input;
