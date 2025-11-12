import * as React from 'react';
import {
  Input as WebInput,
  type InputProps as WebInputProps,
} from '@lssm/lib.ui-kit-web/ui/input';
import { type KeyboardOptions, mapKeyboardToWeb } from '../../lib/keyboard';

interface BaseFieldProps {
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (text: string) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  name?: string;
  className?: string;
  keyboard?: KeyboardOptions;
}

export type InputProps = Omit<
  WebInputProps,
  'onChange' | 'value' | 'defaultValue' | 'input'
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
  readOnly,
  maxLength,
  name,
  className,
  keyboard,
  ...rest
}: InputProps) {
  const webKeyboard = mapKeyboardToWeb(keyboard);

  return (
    <WebInput
      {...rest}
      className={className}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange ? (e) => onChange?.(e.target.value) : undefined}
      // onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      maxLength={maxLength}
      name={name}
      {...webKeyboard}
    />
  );
}

export default Input;
