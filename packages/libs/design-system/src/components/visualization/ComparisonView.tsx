'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { VisualizationCard } from './VisualizationCard';
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
    <section className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
      </div>
    </section>
  );
}
