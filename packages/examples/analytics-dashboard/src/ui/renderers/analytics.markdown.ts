/**
 * Markdown renderers for Analytics Dashboard presentations
 */
import type { PresentationRenderer } from '@contractspec/lib.contracts-spec/presentations/transform-engine';
import { createExampleWidgets, resolveAnalyticsWidget } from '../../visualizations';

const mockDashboards = [
  {
    id: 'dash-1',
    name: 'Sales Overview',
    slug: 'sales-overview',
    status: 'PUBLISHED',
    widgetCount: 11,
    viewCount: 1250,
    lastViewedAt: '2026-03-18T12:00:00Z',
  },
  {
    id: 'dash-2',
    name: 'User Engagement',
    slug: 'user-engagement',
    status: 'PUBLISHED',
    widgetCount: 8,
    viewCount: 890,
    lastViewedAt: '2026-03-18T10:00:00Z',
  },
];

const mockQueries = [
  { id: 'q-1', name: 'Monthly Revenue', type: 'AGGREGATION', isShared: true, executionCount: 1500 },
  { id: 'q-2', name: 'User Growth', type: 'METRIC', isShared: true, executionCount: 890 },
  { id: 'q-3', name: 'Product Sales', type: 'SQL', isShared: false, executionCount: 340 },
  { id: 'q-4', name: 'Conversion Funnel', type: 'AGGREGATION', isShared: true, executionCount: 450 },
];

function dashboardWidgets(dashboardId: string) {
  return createExampleWidgets(dashboardId)
    .map((widget) => resolveAnalyticsWidget(widget))
    .filter((widget): widget is NonNullable<typeof widget> => Boolean(widget));
}

export const analyticsDashboardMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc) => {
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'AnalyticsDashboard'
    ) {
      throw new Error(
        'analyticsDashboardMarkdownRenderer: not AnalyticsDashboard'
      );
    }

    const dashboard = mockDashboards[0];
    if (!dashboard) {
      return {
        mimeType: 'text/markdown',
        body: '# No Dashboards\n\nNo dashboards available.',
      };
    }

    const widgets = dashboardWidgets(dashboard.id);
    const metricWidgets = widgets.filter(
      (widget) => widget.bindings[0]?.spec.visualization.kind === 'metric'
    );

    const lines: string[] = [
      `# ${dashboard.name}`,
      '',
      '> Contract-backed analytics dashboard overview.',
      '',
      '## Key Metrics',
      '',
    ];

    for (const widget of metricWidgets) {
      const binding = widget.bindings[0];
      if (!binding) continue;
      lines.push(`- **${widget.name}** via \`${binding.spec.meta.key}\``);
    }

    lines.push('');
    lines.push('## Visual Blocks');
    lines.push('');

    for (const widget of widgets) {
      const kinds = widget.bindings
        .map((binding) => binding.spec.visualization.kind)
        .join(', ');
      lines.push(`- **${widget.name}** (${widget.layout}) → ${kinds}`);
    }

    lines.push('');
    lines.push('## Dashboard Stats');
    lines.push('');
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Total Dashboards | ${mockDashboards.length} |`);
    lines.push(
      `| Published | ${mockDashboards.filter((item) => item.status === 'PUBLISHED').length} |`
    );
    lines.push(
      `| Shared Queries | ${mockQueries.filter((query) => query.isShared).length} |`
    );

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

export const dashboardListMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc) => {
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'DashboardList'
    ) {
      throw new Error('dashboardListMarkdownRenderer: not DashboardList');
    }

    const lines: string[] = [
      '# Dashboards',
      '',
      '> Browse and manage analytics dashboards',
      '',
      '| Dashboard | Widgets | Views | Status | Last Viewed |',
      '|-----------|---------|-------|--------|-------------|',
    ];

    for (const dashboard of mockDashboards) {
      const lastViewed = dashboard.lastViewedAt
        ? new Date(dashboard.lastViewedAt).toLocaleDateString()
        : 'Never';
      const statusIcon = dashboard.status === 'PUBLISHED' ? '🟢' : '⚫';
      lines.push(
        `| [${dashboard.name}](/dashboards/${dashboard.slug}) | ${dashboard.widgetCount} | ${dashboard.viewCount.toLocaleString()} | ${statusIcon} ${dashboard.status} | ${lastViewed} |`
      );
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

export const queryBuilderMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc) => {
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'QueryBuilder'
    ) {
      throw new Error('queryBuilderMarkdownRenderer: not QueryBuilder');
    }

    const lines: string[] = [
      '# Query Builder',
      '',
      '> Create and manage reusable data queries.',
      '',
      '| Query | Type | Shared | Executions |',
      '|-------|------|--------|------------|',
    ];

    for (const query of mockQueries) {
      lines.push(
        `| ${query.name} | ${query.type} | ${query.isShared ? '🌐' : '🔒'} | ${query.executionCount.toLocaleString()} |`
      );
    }

    lines.push('');
    lines.push('## Visualization Contracts');
    lines.push('');
    lines.push(
      'Widgets reference `VisualizationSpec` contracts instead of rendering ad-hoc widget types.'
    );

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};
