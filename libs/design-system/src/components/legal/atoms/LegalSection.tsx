import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

const sectionVariants = cva('space-y-3', {
  variants: {
    spacing: {
      sm: 'py-3',
      md: 'py-4',
      lg: 'py-6',
    },
    border: {
      none: '',
      top: 'border-t',
      bottom: 'border-b',
      both: 'border-y',
    },
    tone: {
      plain: '',
      subtle: 'bg-muted/30',
    },
  },
  defaultVariants: {
    spacing: 'md',
    border: 'none',
    tone: 'plain',
  },
});

export type LegalSectionProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof sectionVariants>;

export function LegalSection({
  spacing,
  border,
  tone,
  className,
  ...props
}: LegalSectionProps) {
  return (
    <div
      className={cn(sectionVariants({ spacing, border, tone }), className)}
      {...props}
    />
  );
}

export { sectionVariants };
