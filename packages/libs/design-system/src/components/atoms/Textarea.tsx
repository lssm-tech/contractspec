import * as React from 'react';
import {
  Textarea as WebTextarea,
  type TextareaProps as WebTextareaProps,
} from '@lssm/lib.ui-kit-web/ui/textarea';
import { type KeyboardOptions, mapKeyboardToWeb } from '../../lib/keyboard';

interface BaseFieldProps {
  value?: string;
  defaultValue?: string;
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
  rows?: number;
  keyboard?: KeyboardOptions;
}

export type TextareaProps = Omit<
  WebTextareaProps,
  'onChange' | 'value' | 'defaultValue'
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
  readOnly,
  maxLength,
  name,
  className,
  rows,
  keyboard,
  ...rest
}: TextareaProps) {
  const webKeyboard = mapKeyboardToWeb(keyboard);

  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLTextAreaElement>
  >((e) => onChange?.(e.target.value), [onChange]);

  const handleKeyDown = React.useCallback<
    React.KeyboardEventHandler<HTMLTextAreaElement>
  >(
    (e) => {
      if (e.key === 'Enter' && webKeyboard.type !== 'search') {
        // For textarea, Enter inserts newline; onSubmit could be used with modifier
        if (e.metaKey || e.ctrlKey) onSubmit?.();
      }
    },
    [onSubmit, webKeyboard.type]
  );

  return (
    <WebTextarea
      {...(rest as any)}
      className={className}
      value={value as any}
      defaultValue={defaultValue as any}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={onFocus as any}
      onBlur={onBlur as any}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      maxLength={maxLength}
      name={name}
      rows={rows}
      {...webKeyboard}
    />
  );
}

export default Textarea;
