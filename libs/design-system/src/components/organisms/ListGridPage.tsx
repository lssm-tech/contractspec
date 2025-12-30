'use client';

import * as React from 'react';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cva, type VariantProps } from 'class-variance-authority';
import { useResponsive } from '../../platform/useResponsive';

const containerVariants = cva('', {
  variants: {
    density: {
      compact: 'gap-3',
      comfortable: 'gap-4 md:gap-5 lg:gap-6',
    },
  },
  defaultVariants: {
    density: 'comfortable',
  },
});

const gridGapVariants = cva('', {
  variants: {
    size: {
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface ListGridPageProps<T>
  extends
    VariantProps<typeof containerVariants>,
    VariantProps<typeof gridGapVariants> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  columns?: { mobile?: number; tablet?: number; desktop?: number };
}

export function ListGridPage<T>({
  title,
  subtitle,
  items,
  renderItem,
  className,
  columns,
  density,
  size,
}: ListGridPageProps<T>) {
  const { screen } = useResponsive();
  const cols =
    screen === 'desktop'
      ? (columns?.desktop ?? 3)
      : screen === 'tablet'
        ? (columns?.tablet ?? 2)
        : (columns?.mobile ?? 1);
  const gridClass = `grid ${gridGapVariants({ size })}`;
  // const colsClass = `grid-cols-${cols}`;
  // Tailwind can't generate dynamic classes reliably; provide common presets
  const presetColsClass =
    cols === 1
      ? 'grid-cols-1'
      : cols === 2
        ? 'grid-cols-2'
        : cols === 3
          ? 'grid-cols-3'
          : cols === 4
            ? 'grid-cols-4'
            : 'grid-cols-3';

  return (
    <VStack
      className={[containerVariants({ density }), className]
        .filter(Boolean)
        .join(' ')}
    >
      <VStack className="gap-1">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {subtitle ? (
          <p className="text-muted-foreground text-base">{subtitle}</p>
        ) : null}
      </VStack>
      <div className={`${gridClass} ${presetColsClass}`}>
        {items.map((item, idx) => (
          <div key={idx}>{renderItem(item, idx)}</div>
        ))}
      </div>
    </VStack>
  );
}
