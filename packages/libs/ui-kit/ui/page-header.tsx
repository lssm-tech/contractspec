import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@lssm/lib.ui-kit-core/utils';
import { HStack, VStack } from './stack';
import { H1, P } from './typography';

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
      <HStack className="items-start justify-between">
        <VStack className="gap-1">
          <H1 className="text-2xl font-semibold md:text-3xl">{title}</H1>
          {subtitle ? (
            <P className="text-muted-foreground text-base">{subtitle}</P>
          ) : null}
        </VStack>
        {actions ? (
          <HStack className="flex items-center gap-2">{actions}</HStack>
        ) : null}
      </HStack>
    </VStack>
  );
}
