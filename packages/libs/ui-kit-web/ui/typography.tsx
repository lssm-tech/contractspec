import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { Text, type TextProps } from './text';
import { cn } from './utils';

type TypographyProps = TextProps & {
  asChild?: boolean;
};

function H1({ className, asChild = false, ...props }: TypographyProps) {
  const Component = asChild ? Slot : 'h1';
  return (
    <Component
      role="heading"
      aria-level={1}
      className={cn(
        'text-foreground web:select-text web:scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        className
      )}
      {...props}
    />
  );
}

function H2({ className, asChild = false, ...props }: TypographyProps) {
  const Component = asChild ? Slot : 'h2';
  return (
    <Component
      role="heading"
      aria-level={2}
      className={cn(
        'border-border text-foreground web:select-text web:scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className
      )}
      {...props}
    />
  );
}

function H3({ className, asChild = false, ...props }: TypographyProps) {
  const Component = asChild ? Slot : 'h3';
  return (
    <Component
      role="heading"
      aria-level={3}
      className={cn(
        'text-foreground web:select-text web:scroll-m-20 text-2xl font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  );
}

function H4({ className, asChild = false, ...props }: TypographyProps) {
  const Component = asChild ? Slot : 'h4';
  return (
    <Component
      role="heading"
      aria-level={4}
      className={cn(
        'text-foreground web:select-text web:scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  );
}

function P({ className, asChild = false, ...props }: TypographyProps) {
  const Component = asChild ? Slot : Text;
  return (
    <Component
      className={cn('text-foreground web:select-text text-base', className)}
      {...props}
    />
  );
}

function BlockQuote({ className, asChild = false, ...props }: TypographyProps) {
  const Component = asChild ? Slot : Text;
  return (
    <Component
      role="blockquote"
      className={cn(
        'native:mt-4 native:pl-3 border-border text-foreground web:select-text mt-6 border-l-2 pl-6 text-base italic',
        className
      )}
      {...props}
    />
  );
}

function Code({ className, asChild = false, ...props }: TypographyProps) {
  const Component = asChild ? Slot : Text;
  return (
    <Component
      role="code"
      className={cn(
        'bg-muted text-foreground web:select-text relative rounded-md px-[0.3rem] py-[0.2rem] text-sm font-semibold',
        className
      )}
      {...props}
    />
  );
}

function Lead({ className, asChild = false, ...props }: TypographyProps) {
  const Component = asChild ? Slot : Text;
  return (
    <Component
      className={cn('text-muted-foreground web:select-text text-xl', className)}
      {...props}
    />
  );
}

function Large({ className, asChild = false, ...props }: TypographyProps) {
  const Component = asChild ? Slot : Text;
  return (
    <Component
      className={cn(
        'text-foreground web:select-text text-xl font-semibold',
        className
      )}
      {...props}
    />
  );
}

function Small({ className, asChild = false, ...props }: TypographyProps) {
  const Component = asChild ? Slot : Text;
  return (
    <Component
      className={cn(
        'text-foreground web:select-text text-sm leading-none font-medium',
        className
      )}
      {...props}
    />
  );
}

function Muted({ className, asChild = false, ...props }: TypographyProps) {
  const Component = asChild ? Slot : Text;
  return (
    <Component
      className={cn('text-muted-foreground web:select-text text-sm', className)}
      {...props}
    />
  );
}

export { BlockQuote, Code, H1, H2, H3, H4, Large, Lead, Muted, P, Small };
