'use client';

import * as React from 'react';
import { HStack, VStack } from '@contractspec/lib.ui-kit/ui/stack';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { useResponsive } from '../../platform/useResponsive.mobile';

interface Props {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PageHeaderResponsive({
  title,
  subtitle,
  actions,
  breadcrumb,
  spacing,
  className,
}: Props) {
  const { screen } = useResponsive();
  const resolvedSpacing =
    spacing ??
    (screen === 'desktop' ? 'lg' : screen === 'tablet' ? 'md' : 'sm');
  const gapClass =
    resolvedSpacing === 'lg'
      ? 'gap-4'
      : resolvedSpacing === 'md'
        ? 'gap-3'
        : 'gap-2';

  return (
    <VStack className={[gapClass, className].filter(Boolean).join(' ')}>
      {breadcrumb}
      <HStack className="items-start justify-between">
        <VStack className="gap-1">
          {typeof title === 'string' ? (
            <Text className="text-2xl font-bold">{title}</Text>
          ) : (
            title
          )}
          {subtitle ? (
            typeof subtitle === 'string' ? (
              <Text className="text-muted-foreground text-base">
                {subtitle}
              </Text>
            ) : (
              subtitle
            )
          ) : null}
        </VStack>

        {actions}
      </HStack>
    </VStack>
  );
}
