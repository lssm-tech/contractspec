import type { LocalDatabase } from '../../database/sqlite-wasm';

export async function seedAnalyticsDashboard(params: {
  projectId: string;
  db: LocalDatabase;
}): Promise<void> {
  const { projectId, db } = params;
  const existing = await db.exec(
    `SELECT COUNT(*) as count FROM analytics_dashboard WHERE projectId = ?`,
    [projectId]
  );
  if ((existing[0]?.count as number) > 0) return;

  const organizationId = 'ad_org_1';

  const queries = [
    {
      id: 'ad_query_1',
      name: 'Daily Active Users',
      type: 'METRIC',
      definition: { metric: 'dau', aggregation: 'count', interval: 'day' },
      sql: null,
    },
    {
      id: 'ad_query_2',
      name: 'Revenue by Product',
      type: 'AGGREGATION',
      definition: {
        dimension: 'product',
        metric: 'revenue',
        aggregation: 'sum',
      },
      sql: null,
    },
    {
      id: 'ad_query_3',
      name: 'User Signups Over Time',
      type: 'SQL',
      definition: {},
      sql: 'SELECT DATE(created_at) as date, COUNT(*) as signups FROM users GROUP BY DATE(created_at)',
    },
    {
      id: 'ad_query_4',
      name: 'Top Countries',
      type: 'AGGREGATION',
      definition: {
        dimension: 'country',
        metric: 'users',
        aggregation: 'count',
        limit: 10,
      },
      sql: null,
    },
  ] as const;

  for (const query of queries) {
    await db.run(
      `INSERT INTO analytics_query (id, projectId, organizationId, name, type, definition, sql, cacheTtlSeconds, isShared)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        query.id,
        projectId,
        organizationId,
        query.name,
        query.type,
        JSON.stringify(query.definition),
        query.sql,
        300,
        1,
      ]
    );
  }

  const dashboards = [
    {
      id: 'ad_dash_1',
      name: 'Executive Overview',
      slug: 'executive-overview',
      description: 'High-level KPIs for leadership',
      status: 'PUBLISHED',
      refreshInterval: 'FIFTEEN_MINUTES',
      isPublic: 1,
      shareToken: 'ad_share_1',
    },
    {
      id: 'ad_dash_2',
      name: 'Product Analytics',
      slug: 'product-analytics',
      description: 'Deep dive into product metrics',
      status: 'PUBLISHED',
      refreshInterval: 'HOUR',
      isPublic: 0,
      shareToken: null,
    },
    {
      id: 'ad_dash_3',
      name: 'Marketing Dashboard',
      slug: 'marketing-dashboard',
      description: 'Campaign performance and attribution',
      status: 'DRAFT',
      refreshInterval: 'NONE',
      isPublic: 0,
      shareToken: null,
    },
  ] as const;

  for (const dash of dashboards) {
    await db.run(
      `INSERT INTO analytics_dashboard (id, projectId, organizationId, name, slug, description, status, refreshInterval, isPublic, shareToken)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dash.id,
        projectId,
        organizationId,
        dash.name,
        dash.slug,
        dash.description,
        dash.status,
        dash.refreshInterval,
        dash.isPublic,
        dash.shareToken,
      ]
    );
  }

  const widgets = [
    {
      id: 'ad_widget_1',
      dashboardId: 'ad_dash_1',
      name: 'Daily Active Users',
      type: 'METRIC',
      gridX: 0,
      gridY: 0,
      gridWidth: 3,
      gridHeight: 2,
      queryId: 'ad_query_1',
    },
    {
      id: 'ad_widget_2',
      dashboardId: 'ad_dash_1',
      name: 'Revenue Trend',
      type: 'LINE_CHART',
      gridX: 3,
      gridY: 0,
      gridWidth: 6,
      gridHeight: 4,
      queryId: 'ad_query_2',
    },
    {
      id: 'ad_widget_3',
      dashboardId: 'ad_dash_1',
      name: 'User Growth',
      type: 'AREA_CHART',
      gridX: 0,
      gridY: 2,
      gridWidth: 3,
      gridHeight: 4,
      queryId: 'ad_query_3',
    },
    {
      id: 'ad_widget_4',
      dashboardId: 'ad_dash_1',
      name: 'Top Countries',
      type: 'BAR_CHART',
      gridX: 9,
      gridY: 0,
      gridWidth: 3,
      gridHeight: 4,
      queryId: 'ad_query_4',
    },
  ] as const;

  for (const widget of widgets) {
    await db.run(
      `INSERT INTO analytics_widget (id, dashboardId, name, type, gridX, gridY, gridWidth, gridHeight, queryId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        widget.id,
        widget.dashboardId,
        widget.name,
        widget.type,
        widget.gridX,
        widget.gridY,
        widget.gridWidth,
        widget.gridHeight,
        widget.queryId,
      ]
    );
  }
}
