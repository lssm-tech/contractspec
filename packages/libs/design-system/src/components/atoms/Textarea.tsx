import * as React from 'react';
import {
  Textarea as WebTextarea,
  type TextareaProps as WebTextareaProps,
} from '@contractspec/lib.ui-kit-web/ui/textarea';
import { type KeyboardOptions, mapKeyboardToWeb } from '../../lib/keyboard';

interface BaseFieldProps {
  value?: string;
  defaultValue?: string;
  // onChange?: (text: string) => void;
  // onSubmit?: () => void;
  // onFocus?: () => void;
  // onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  name?: string;
  className?: string;
  rows?: number;
  keyboard?: KeyboardOptions;
}

export type TextareaProps = WebTextareaProps & BaseFieldProps;

// export type TextareaProps = Omit<
//   WebTextareaProps,
//   // 'onChange' | 'value' | 'defaultValue'
// > &
//   BaseFieldProps;

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
  >((e) => onChange?.(e), [onChange]);

  // const handleKeyDown = React.useCallback<
  //   React.KeyboardEventHandler<HTMLTextAreaElement>
  // >(
  //   (e) => {
  //     if (e.key === 'Enter' && webKeyboard.type !== 'search') {
  //       // For textarea, Enter inserts newline; onSubmit could be used with modifier
  //       if (e.metaKey || e.ctrlKey) onSubmit?.(e);
  //     }
  //   },
  //   [onSubmit, webKeyboard.type]
  // );

  return (
    <WebTextarea
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(rest as any)}
      className={className}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={value as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultValue={defaultValue as any}
      onChange={handleChange}
      // onKeyDown={handleKeyDown}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFocus={onFocus as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
