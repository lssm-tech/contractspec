'use client';

import * as React from 'react';
import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

const statVariants = cva('', {
  variants: {
    emphasis: {
      default: '',
      subtle: 'bg-muted/20',
      strong: 'bg-primary/5',
    },
    density: {
      compact: 'p-3',
      comfortable: 'p-4 md:p-5',
    },
  },
  defaultVariants: { emphasis: 'default', density: 'comfortable' },
});

export type StatCardProps = React.ComponentProps<typeof Card> &
  VariantProps<typeof statVariants> & {
    label: React.ReactNode;
    value: React.ReactNode;
    hint?: React.ReactNode;
    icon?: React.ReactNode;
  };

export function StatCard({
  label,
  value,
  hint,
  icon,
  emphasis,
  density,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card className={className} {...props}>
      <CardContent
        className={cn(
          'flex items-center gap-3',
          statVariants({ emphasis, density })
        )}
      >
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="min-w-0">
          <div className="text-muted-foreground text-base">{label}</div>
          <div className="truncate text-2xl font-semibold">{value}</div>
          {hint && (
            <div className="text-muted-foreground text-base">{hint}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  );
}
