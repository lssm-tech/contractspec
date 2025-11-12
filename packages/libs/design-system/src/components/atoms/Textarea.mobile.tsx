import * as React from 'react';
import { Textarea as NativeTextarea } from '@lssm/lib.ui-kit/ui/textarea';
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

type NativeTextareaComponentProps = React.ComponentProps<typeof NativeTextarea>;
export type TextareaProps = Omit<
  NativeTextareaComponentProps,
  'onChangeText' | 'value' | 'defaultValue'
> &
  BaseFieldProps;

export function Textarea({
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
}: TextareaProps) {
  const nativeKeyboard = mapKeyboardToNative(keyboard);

  return (
    <NativeTextarea
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

export default Textarea;
