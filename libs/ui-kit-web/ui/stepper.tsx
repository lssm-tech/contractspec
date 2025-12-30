import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { HStack } from './stack';

const dotVariants = cva('h-2 w-2 rounded-full', {
  variants: {
    state: {
      active: 'bg-primary',
      inactive: 'bg-muted-foreground/20',
    },
    size: {
      sm: '',
      md: 'h-2.5 w-2.5',
    },
  },
  defaultVariants: {
    state: 'inactive',
    size: 'md',
  },
});

export interface StepperProps extends VariantProps<typeof dotVariants> {
  current: number;
  total: number;
  className?: string;
}

export function Stepper({ current, total, size, className }: StepperProps) {
  const items = Array.from({ length: Math.max(0, total) });
  return (
    <HStack className={cn('items-center gap-2', className)}>
      {items.map((_, idx) => (
        <span
          key={idx}
          className={cn(
            dotVariants({
              state: idx + 1 === current ? 'active' : 'inactive',
              size,
            })
          )}
        />
      ))}
    </HStack>
  );
}
