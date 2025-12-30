'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export function FormSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('space-y-4', className)}>{children}</div>;
}

export function FormRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}>
      {children}
    </div>
  );
}

export function FormGrid({
  children,
  cols = 2,
  className,
}: {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const preset =
    cols === 1
      ? 'grid-cols-1'
      : cols === 2
        ? 'grid-cols-2'
        : cols === 3
          ? 'grid-cols-3'
          : 'grid-cols-4';
  return <div className={cn('grid gap-4', preset, className)}>{children}</div>;
}
