import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

const calloutVariants = cva('rounded-md border p-4', {
  variants: {
    tone: {
      info: 'border-border bg-muted/30',
      warning: 'border-warning/50 bg-warning/10',
      danger: 'border-destructive/50 bg-destructive/10',
    },
  },
  defaultVariants: {
    tone: 'info',
  },
});

export type LegalCalloutProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof calloutVariants>;

export function LegalCallout({ tone, className, ...props }: LegalCalloutProps) {
  return (
    <div className={cn(calloutVariants({ tone }), className)} {...props} />
  );
}

export { calloutVariants };
