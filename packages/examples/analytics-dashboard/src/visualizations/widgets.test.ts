import { describe, expect, it } from 'bun:test';
import { createExampleWidgets, resolveAnalyticsWidget } from './widgets';

describe('analytics visualization widgets', () => {
  it('creates example widgets that reference visualization contracts', () => {
    const widgets = createExampleWidgets('dash_1');
    const metric = widgets.find((widget) => widget.id === 'widget_revenue_metric');

    expect(metric?.config).toMatchObject({
      layout: 'single',
      bindings: [
        {
          ref: {
            key: 'analytics.visualization.revenue-metric',
            version: '1.0.0',
          },
        },
      ],
    });
  });

  it('resolves comparison and timeline widgets through visualization specs', () => {
    const widgets = createExampleWidgets('dash_1');
    const comparison = widgets.find((widget) => widget.id === 'widget_comparison');
    const timeline = widgets.find((widget) => widget.id === 'widget_timeline');

    const resolvedComparison = resolveAnalyticsWidget(comparison!);
    const resolvedTimeline = resolveAnalyticsWidget(timeline!);

    expect(resolvedComparison?.layout).toBe('comparison');
    expect(
      resolvedComparison?.bindings.map((binding) => binding.spec.meta.key)
    ).toEqual([
      'analytics.visualization.regional-revenue',
      'analytics.visualization.channel-mix',
      'analytics.visualization.conversion-funnel',
    ]);
    expect(resolvedTimeline?.layout).toBe('timeline');
    expect(
      resolvedTimeline?.bindings.map((binding) => binding.spec.meta.key)
    ).toEqual([
      'analytics.visualization.revenue-trend',
      'analytics.visualization.retention-area',
    ]);
  });
});
