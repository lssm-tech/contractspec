import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { useResponsive } from '../../platform/useResponsive';

const gridVariants = cva('grid', {
  variants: {
    gap: {
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
    },
  },
  defaultVariants: { gap: 'md' },
});

export function GridLayout({
  children,
  className,
  columns,
  gap,
}: {
  children: React.ReactNode;
  className?: string;
  columns?: { mobile?: number; tablet?: number; desktop?: number };
} & VariantProps<typeof gridVariants>) {
  const { screen } = useResponsive();
  const cols =
    screen === 'desktop'
      ? (columns?.desktop ?? 1)
      : screen === 'tablet'
        ? (columns?.tablet ?? 1)
        : (columns?.mobile ?? 1);
  const presetColsClass =
    cols === 1
      ? 'grid-cols-1'
      : cols === 2
        ? 'grid-cols-2'
        : cols === 3
          ? 'grid-cols-3'
          : cols === 4
            ? 'grid-cols-4'
            : 'grid-cols-1';
  return (
    <div className={cn(gridVariants({ gap }), presetColsClass, className)}>
      {children}
    </div>
  );
}

export default GridLayout;
