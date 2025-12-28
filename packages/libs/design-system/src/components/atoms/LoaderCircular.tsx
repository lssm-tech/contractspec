import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
    },
  },
  defaultVariants: { size: 'md', tone: 'muted' },
});

export type LoaderCircularProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof spinnerVariants> & {
    label?: React.ReactNode;
  };

export function LoaderCircular({
  size,
  tone,
  label,
  className,
  ...props
}: LoaderCircularProps) {
  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      role="status"
      aria-live="polite"
      aria-busy
      {...props}
    >
      <Loader2 className={cn(spinnerVariants({ size, tone }))} />
      {label ? (
        <span className="text-muted-foreground text-base">{label}</span>
      ) : null}
    </div>
  );
}
