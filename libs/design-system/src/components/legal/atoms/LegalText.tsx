import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

const textVariants = cva('text-base leading-relaxed', {
  variants: {
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      danger: 'text-destructive',
    },
    size: {
      base: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
    },
    spacing: {
      none: '',
      sm: 'mt-2',
      md: 'mt-3',
      lg: 'mt-4',
    },
  },
  defaultVariants: {
    tone: 'default',
    size: 'base',
    spacing: 'sm',
  },
});

export type LegalTextProps = React.HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof textVariants> & { as?: 'p' | 'div' | 'span' };

export function LegalText({
  as = 'p',
  tone,
  size,
  spacing,
  className,
  ...props
}: LegalTextProps) {
  const Comp = as as React.ElementType;
  return (
    <Comp
      className={cn(textVariants({ tone, size, spacing }), className)}
      {...props}
    />
  );
}

export { textVariants };
