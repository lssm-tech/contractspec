'use client';

import * as React from 'react';
import { VStack } from '@contractspec/lib.ui-kit/ui/stack';

export interface VisualizationGridProps {
  children: React.ReactNode;
  className?: string;
}

export function VisualizationGrid({
  children,
  className,
}: VisualizationGridProps) {
  return (
    <VStack gap="md" className={className}>
      {children}
    </VStack>
  );
}
