import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@lssm/lib.ui-kit-core/utils';

function Input({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & {
  ref?: React.RefObject<TextInput>;
}) {
  return (
    <TextInput
      className={cn(
        'native:h-12 native:text-lg native:leading-tight border-input bg-background text-foreground placeholder:text-muted-foreground web:flex web:w-full web:py-2 web:ring-offset-background web:focus-visible:outline-hidden web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 h-10 rounded-md border px-3 text-base file:border-0 file:bg-transparent file:font-medium lg:text-sm',
        props.editable === false && 'web:cursor-not-allowed opacity-50',
        className
      )}
      placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
      {...props}
    />
  );
}

export { Input };
