'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-base font-medium',
  {
    variants: {
      tone: {
        neutral: 'bg-muted/40 text-foreground',
        info: 'bg-accent/15 text-accent',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-warning/10 text-warning',
        danger: 'bg-destructive/10 text-destructive',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  }
);

export type StatusChipProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof chipVariants> & {
    icon?: React.ReactNode;
    label?: React.ReactNode;
    hoverContent?: React.ReactNode;
  };

export function StatusChip({
  tone,
  size,
  icon,
  label,
  className,
  hoverContent,
  ...props
}: StatusChipProps) {
  const content = (
    <span className={cn(chipVariants({ tone, size }), className)} {...props}>
      {icon && (
        <span className="inline-flex h-4 w-4 items-center justify-center">
          {icon}
        </span>
      )}
      {label}
    </span>
  );
  if (!hoverContent) return content;
  try {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { HoverPreview } =
      require('./HoverPreview') as typeof import('./HoverPreview');
    /* eslint-enable @typescript-eslint/no-require-imports */
    return <HoverPreview trigger={content} content={hoverContent} />;
  } catch {
    return content;
  }
}
