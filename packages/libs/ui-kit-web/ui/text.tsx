import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from './utils';

export type TextProps = React.HTMLProps<HTMLParagraphElement> & {
  ref?: React.RefObject<React.HTMLProps<HTMLParagraphElement>>;
  asChild?: boolean;
};

function Text({ className, asChild = false, ...props }: TextProps) {
  const Component = asChild ? Slot : 'p';
  return (
    <Component
      className={cn('text-foreground web:select-text text-base', className)}
      {...props}
    />
  );
}

export { Text };
