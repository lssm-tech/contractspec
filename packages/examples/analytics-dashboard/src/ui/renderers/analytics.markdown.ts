/**
 * Markdown renderers for Analytics Dashboard presentations
 */
import type { PresentationRenderer } from '@contractspec/lib.contracts-spec/presentations/transform-engine';

// Mock data for analytics rendering
const mockDashboards = [
  {
    id: 'dash-1',
    name: 'Sales Overview',
    slug: 'sales-overview',
    status: 'PUBLISHED',
    widgetCount: 8,
    viewCount: 1250,
    lastViewedAt: '2024-01-16T12:00:00Z',
  },
  {
    id: 'dash-2',
    name: 'User Engagement',
    slug: 'user-engagement',
    status: 'PUBLISHED',
    widgetCount: 6,
    viewCount: 890,
    lastViewedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'dash-3',
    name: 'Product Analytics',
    slug: 'product-analytics',
    status: 'PUBLISHED',
    widgetCount: 10,
    viewCount: 560,
    lastViewedAt: '2024-01-15T14:00:00Z',
  },
  {
    id: 'dash-4',
    name: 'Finance Report',
    slug: 'finance-report',
    status: 'DRAFT',
    widgetCount: 4,
    viewCount: 0,
    lastViewedAt: null,
  },
];

const mockWidgets = [
  {
    id: 'w-1',
    dashboardId: 'dash-1',
    name: 'Total Revenue',
    type: 'METRIC',
    value: 125000,
    change: 12.5,
  },
  {
    id: 'w-2',
    dashboardId: 'dash-1',
    name: 'Active Users',
    type: 'METRIC',
    value: 4500,
    change: 8.2,
  },
  {
    id: 'w-3',
    dashboardId: 'dash-1',
    name: 'Revenue Trend',
    type: 'LINE_CHART',
    dataPoints: 30,
  },
  {
    id: 'w-4',
    dashboardId: 'dash-1',
    name: 'Top Products',
    type: 'BAR_CHART',
    dataPoints: 10,
  },
  {
    id: 'w-5',
    dashboardId: 'dash-2',
    name: 'Daily Active Users',
    type: 'LINE_CHART',
    dataPoints: 30,
  },
  {
    id: 'w-6',
    dashboardId: 'dash-2',
    name: 'Session Duration',
    type: 'METRIC',
    value: 245,
    change: -3.1,
  },
];

const mockQueries = [
  {
    id: 'q-1',
    name: 'Monthly Revenue',
    type: 'AGGREGATION',
    isShared: true,
    executionCount: 1500,
  },
  {
    id: 'q-2',
    name: 'User Growth',
    type: 'METRIC',
    isShared: true,
    executionCount: 890,
  },
  {
    id: 'q-3',
    name: 'Product Sales',
    type: 'SQL',
    isShared: false,
    executionCount: 340,
  },
  {
    id: 'q-4',
    name: 'Conversion Funnel',
    type: 'AGGREGATION',
    isShared: true,
    executionCount: 450,
  },
];

function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

function formatChange(change: number): string {
  const icon = change >= 0 ? '📈' : '📉';
  const sign = change >= 0 ? '+' : '';
  return `${icon} ${sign}${change.toFixed(1)}%`;
}

/**
 * Markdown renderer for Analytics Dashboard Overview
 */
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

    const dashboards = mockDashboards;
    const widgets = mockWidgets;
    const queries = mockQueries;

    // Get the first dashboard for detailed view
    const dashboard = dashboards[0];
    if (!dashboard) {
      return {
        mimeType: 'text/markdown',
        body: '# No Dashboards\n\nNo dashboards available.',
      };
    }
    const dashboardWidgets = widgets.filter(
      (w) => w.dashboardId === dashboard.id
    );

    // Calculate stats
    const publishedDashboards = dashboards.filter(
      (d) => d.status === 'PUBLISHED'
    );
    const totalViews = dashboards.reduce((sum, d) => sum + d.viewCount, 0);
    const sharedQueries = queries.filter((q) => q.isShared);

    const lines: string[] = [
      `# ${dashboard.name}`,
      '',
      '> Analytics dashboard overview',
      '',
      '## Key Metrics',
      '',
    ];

    // Show metric widgets
    const metricWidgets = dashboardWidgets.filter((w) => w.type === 'METRIC');
    for (const widget of metricWidgets) {
      const w = widget as { name: string; value: number; change: number };
      lines.push(`### ${w.name}`);
      lines.push(`**${formatNumber(w.value)}** ${formatChange(w.change)}`);
      lines.push('');
    }

    lines.push('## Visualizations');
    lines.push('');

    // List chart widgets
    const chartWidgets = dashboardWidgets.filter((w) => w.type !== 'METRIC');
    for (const widget of chartWidgets) {
      const w = widget as { name: string; type: string; dataPoints: number };
      lines.push(
        `- **${w.name}** (${w.type.replace('_', ' ')}) - ${w.dataPoints} data points`
      );
    }

    lines.push('');
    lines.push('## Dashboard Stats');
    lines.push('');
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Total Dashboards | ${dashboards.length} |`);
    lines.push(`| Published | ${publishedDashboards.length} |`);
    lines.push(`| Total Views | ${totalViews.toLocaleString()} |`);
    lines.push(`| Shared Queries | ${sharedQueries.length} |`);

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

/**
 * Markdown renderer for Dashboard List
 */
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

    const dashboards = mockDashboards;

    const lines: string[] = [
      '# Dashboards',
      '',
      '> Browse and manage analytics dashboards',
      '',
      '| Dashboard | Widgets | Views | Status | Last Viewed |',
      '|-----------|---------|-------|--------|-------------|',
    ];

    for (const dashboard of dashboards) {
      const lastViewed = dashboard.lastViewedAt
        ? new Date(dashboard.lastViewedAt).toLocaleDateString()
        : 'Never';
      const statusIcon = dashboard.status === 'PUBLISHED' ? '🟢' : '⚫';
      lines.push(
        `| [${dashboard.name}](/dashboards/${dashboard.slug}) | ${dashboard.widgetCount} | ${dashboard.viewCount.toLocaleString()} | ${statusIcon} ${dashboard.status} | ${lastViewed} |`
      );
    }

    lines.push('');
    lines.push('## Quick Actions');
    lines.push('');
    lines.push('- **Create Dashboard** - Start with a blank canvas');
    lines.push('- **Import Template** - Use a pre-built template');
    lines.push('- **Clone Dashboard** - Duplicate an existing dashboard');

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

/**
 * Markdown renderer for Query Builder
 */
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

    const queries = mockQueries;

    const lines: string[] = [
      '# Query Builder',
      '',
      '> Create and manage data queries',
      '',
      '## Saved Queries',
      '',
      '| Query | Type | Shared | Executions |',
      '|-------|------|--------|------------|',
    ];

    for (const query of queries) {
      const sharedIcon = query.isShared ? '🌐' : '🔒';
      lines.push(
        `| ${query.name} | ${query.type} | ${sharedIcon} | ${query.executionCount.toLocaleString()} |`
      );
    }

    lines.push('');
    lines.push('## Query Types');
    lines.push('');
    lines.push('### METRIC');
    lines.push('Query usage metrics from the metering system.');
    lines.push('');
    lines.push('### AGGREGATION');
    lines.push(
      'Build aggregations with measures and dimensions without writing SQL.'
    );
    lines.push('');
    lines.push('### SQL');
    lines.push('Write custom SQL queries for advanced analysis.');
    lines.push('');
    lines.push('## Features');
    lines.push('');
    lines.push('- Visual query builder');
    lines.push('- Auto-complete for fields and functions');
    lines.push('- Query validation and optimization');
    lines.push('- Result caching');
    lines.push('- Query sharing and collaboration');

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};
