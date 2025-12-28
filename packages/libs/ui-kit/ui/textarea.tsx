import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@contractspec/lib.ui-kit-core/utils';

const Textarea = React.forwardRef<
  TextInput,
  TextInputProps & {
    ref?: React.RefObject<TextInput>;
  }
>(({ className, placeholderClassName, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'native:text-lg native:leading-tight border-input bg-background text-foreground placeholder:text-muted-foreground web:flex web:ring-offset-background web:focus-visible:outline-hidden web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 min-h-[80px] w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:font-medium lg:text-sm',
        props.editable === false && 'web:cursor-not-allowed opacity-50',
        className
      )}
      placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
      multiline
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
