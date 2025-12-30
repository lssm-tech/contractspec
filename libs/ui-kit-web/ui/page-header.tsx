import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import { HStack, VStack } from './stack';

const headerVariants = cva('', {
  variants: {
    spacing: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    spacing: 'md',
  },
});

export interface PageHeaderProps extends VariantProps<typeof headerVariants> {
  breadcrumb?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  breadcrumb,
  title,
  subtitle,
  actions,
  spacing,
  className,
}: PageHeaderProps) {
  return (
    <VStack className={cn(headerVariants({ spacing }), className)}>
      {breadcrumb}
      <HStack className="flex-col items-start justify-between md:flex-row">
        <VStack className="gap-1">
          <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
          {subtitle ? (
            <p className="text-muted-foreground text-base">{subtitle}</p>
          ) : null}
        </VStack>
        {actions ? (
          <div className="flex items-center gap-2">{actions}</div>
        ) : null}
      </HStack>
    </VStack>
  );
}
