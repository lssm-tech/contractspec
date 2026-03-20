'use client';

import {
  ComparisonView,
  TimelineView,
  VisualizationCard,
  VisualizationGrid,
} from '@contractspec/lib.design-system';
import type { ResolvedAnalyticsWidget } from '../visualizations';

export function AnalyticsWidgetBoard({
  dashboardName,
  widgets,
}: {
  dashboardName: string;
  widgets: ResolvedAnalyticsWidget[];
}) {
  if (!widgets.length) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-10 text-center">
        No visualization widgets configured for "{dashboardName}".
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Widgets in "{dashboardName}"</h3>
      <VisualizationGrid>
        {widgets.map((widget) => (
          <div key={widget.id} className={gridSpanClass(widget.gridWidth)}>
            {renderVisualizationWidget(widget)}
          </div>
        ))}
      </VisualizationGrid>
    </div>
  );
}

function renderVisualizationWidget(widget: ResolvedAnalyticsWidget) {
  const footer = (
    <span className="text-muted-foreground text-xs">
      Position: ({widget.gridX}, {widget.gridY}) • {widget.gridWidth}x
      {widget.gridHeight}
    </span>
  );

  if (widget.layout === 'comparison') {
    return (
      <ComparisonView
        description={widget.description}
        items={widget.bindings.map((binding) => ({ ...binding, footer }))}
        title={widget.name}
      />
    );
  }

  if (widget.layout === 'timeline') {
    return (
      <TimelineView
        description={widget.description}
        items={widget.bindings.map((binding) => ({ ...binding, footer }))}
        title={widget.name}
      />
    );
  }

  const binding = widget.bindings[0];
  if (!binding) return null;

  return (
    <VisualizationCard
      data={binding.data}
      description={widget.description ?? binding.description}
      footer={footer}
      height={binding.height}
      spec={binding.spec}
      title={widget.name}
    />
  );
}

function gridSpanClass(gridWidth: number) {
  if (gridWidth >= 12) return 'md:col-span-2 xl:col-span-3';
  if (gridWidth >= 8) return 'xl:col-span-2';
  if (gridWidth >= 6) return 'md:col-span-2';
  return '';
}
