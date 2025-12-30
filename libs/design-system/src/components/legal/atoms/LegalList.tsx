import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

const listVariants = cva('', {
  variants: {
    type: {
      unordered: 'list-disc pl-6',
      ordered: 'list-decimal pl-6',
      none: 'pl-0',
    },
    spacing: {
      sm: 'space-y-1',
      md: 'space-y-2',
      lg: 'space-y-3',
    },
  },
  defaultVariants: {
    type: 'unordered',
    spacing: 'md',
  },
});

export type LegalListProps = React.HTMLAttributes<
  HTMLUListElement | HTMLOListElement
> &
  VariantProps<typeof listVariants>;

export function LegalList({
  type,
  spacing,
  className,
  children,
  ...props
}: LegalListProps) {
  const Comp = (type === 'ordered' ? 'ol' : 'ul') as React.ElementType;
  return (
    <Comp className={cn(listVariants({ type, spacing }), className)} {...props}>
      {children}
    </Comp>
  );
}

export { listVariants };
