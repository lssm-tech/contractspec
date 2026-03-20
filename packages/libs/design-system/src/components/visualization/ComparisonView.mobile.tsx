'use client';

import * as React from 'react';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { VStack } from '@contractspec/lib.ui-kit/ui/stack';
import { VisualizationCard } from './VisualizationCard.mobile';
import type { VisualizationSurfaceItem } from './types';

export interface ComparisonViewProps {
  items: VisualizationSurfaceItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export function ComparisonView({
  items,
  title = 'Comparison',
  description,
  className,
}: ComparisonViewProps) {
  return (
    <VStack gap="md" className={className}>
      <VStack gap="xs">
        <Text className="text-xl font-semibold">{title}</Text>
        {description ? (
          <Text className="text-muted-foreground text-sm">{description}</Text>
        ) : null}
      </VStack>
      {items.map((item) => (
        <VisualizationCard
          key={item.key}
          className={item.className}
          data={item.data}
          description={item.description}
          footer={item.footer}
          height={item.height}
          spec={item.spec}
          title={item.title}
        />
      ))}
    </VStack>
  );
}
