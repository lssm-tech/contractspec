import * as React from 'react';
import { Input as NativeInput } from '@contractspec/lib.ui-kit/ui/input';
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(rest as any)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      className={className as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={value as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValue={defaultValue as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChangeText={onChange as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmitEditing={onSubmit as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFocus={onFocus as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlur={onBlur as any}
      placeholder={placeholder}
      editable={!disabled}
      maxLength={maxLength}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(nativeKeyboard as any)}
    />
  );
}

export default Input;
