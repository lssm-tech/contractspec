# @lssm/example.analytics-dashboard

> Analytics Dashboard Example - Comprehensive data visualization and reporting solution

## Overview

This example demonstrates a full-featured analytics and dashboarding system built with ContractSpec, showcasing:

- **Customizable Dashboards** - Drag-and-drop widget layouts
- **Visual Query Builder** - Build queries without writing SQL
- **Multiple Widget Types** - Charts, metrics, tables, maps
- **Scheduled Reports** - Automated report generation and delivery
- **Public Sharing** - Share dashboards with external stakeholders

## Entities

### Dashboard

Main container for widgets and visualizations.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| organizationId | string | Organization owner |
| name | string | Dashboard name |
| slug | string | URL-friendly identifier |
| description | string? | Dashboard description |
| status | DashboardStatus | DRAFT, PUBLISHED, ARCHIVED |
| refreshInterval | RefreshInterval | Auto-refresh frequency |
| defaultDateRange | TimeRange | Default time filter |
| isPublic | boolean | Public visibility |
| shareToken | string? | Public access token |

### Widget

Individual visualization component on a dashboard.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| dashboardId | string | Parent dashboard |
| name | string | Widget title |
| type | WidgetType | LINE_CHART, BAR_CHART, PIE_CHART, METRIC, TABLE, etc. |
| gridX, gridY | number | Grid position |
| gridWidth, gridHeight | number | Grid dimensions |
| queryId | string? | Linked query |
| config | JSON | Widget-specific configuration |

### Query

Reusable data query definition.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Query name |
| type | QueryType | SQL, METRIC, AGGREGATION, CUSTOM |
| definition | JSON | Query definition |
| sql | string? | Raw SQL for SQL type |
| metricIds | string[] | Metrics for METRIC type |
| cacheTtlSeconds | number | Cache duration |
| isShared | boolean | Shared across org |

### Report

Scheduled report definition.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| dashboardId | string | Source dashboard |
| name | string | Report name |
| schedule | string | Cron expression |
| format | ReportFormat | PDF, PNG, CSV |
| recipients | string[] | Email addresses |
| lastRunAt | DateTime? | Last execution time |

## Contracts

### Dashboard Management

```typescript
// Create a new dashboard
CreateDashboardContract
Input: { name, slug, description?, refreshInterval? }
Output: Dashboard

// Add widget to dashboard
AddWidgetContract
Input: { dashboardId, name, type, gridX?, gridY?, queryId?, config? }
Output: Widget

// Get dashboard with widgets
GetDashboardContract
Input: { dashboardId? | slug? | shareToken? }
Output: Dashboard (with widgets)

// List user's dashboards
ListDashboardsContract
Input: { status?, search?, limit?, offset? }
Output: { dashboards, total }
```

### Query Management

```typescript
// Create a query
CreateQueryContract
Input: { name, type, definition, sql?, metricIds?, cacheTtlSeconds? }
Output: Query

// Execute query
ExecuteQueryContract
Input: { queryId, parameters?, dateRange?, filters?, forceRefresh? }
Output: { data, columns, rowCount, executionTimeMs, cached }
```

## Events

| Event | Description |
|-------|-------------|
| `analytics.dashboard.created` | Dashboard created |
| `analytics.dashboard.published` | Dashboard published |
| `analytics.widget.added` | Widget added to dashboard |
| `analytics.query.created` | Query created |
| `analytics.query.executed` | Query executed |
| `analytics.dashboard.viewed` | Dashboard viewed |
| `analytics.report.generated` | Scheduled report generated |

## Widget Types

- **Line Chart** - Time series data
- **Bar Chart** - Categorical comparisons
- **Pie Chart** - Part-to-whole relationships
- **Area Chart** - Stacked time series
- **Scatter Plot** - Correlation analysis
- **Metric** - Single KPI display
- **Table** - Tabular data
- **Heatmap** - Density visualization
- **Funnel** - Conversion analysis
- **Map** - Geographic data
- **Text** - Markdown content
- **Embed** - External iframe

## Query Types

### Metric Query

Query usage metrics from the metering system.

```json
{
  "type": "METRIC",
  "metricIds": ["active_users", "api_calls", "storage_used"]
}
```

### Aggregation Query

Build aggregations with measures and dimensions.

```json
{
  "type": "AGGREGATION",
  "source": "events",
  "measures": [
    { "name": "total_count", "field": "id", "aggregation": "COUNT" }
  ],
  "dimensions": [
    { "name": "date", "field": "created_at", "type": "TIME", "granularity": "DAY" }
  ],
  "filters": [
    { "field": "event_type", "operator": "eq", "value": "page_view" }
  ]
}
```

### SQL Query

Write custom SQL (requires feature flag).

```json
{
  "type": "SQL",
  "sql": "SELECT date_trunc('day', created_at) as day, count(*) FROM events GROUP BY 1"
}
```

## Usage

```typescript
import {
  AnalyticsDashboardFeature,
  CreateDashboardContract,
  AddWidgetContract,
  createQueryEngine,
} from '@lssm/example.analytics-dashboard';

// Create a dashboard
const dashboard = await execute(CreateDashboardContract, {
  name: 'Sales Overview',
  slug: 'sales-overview',
  description: 'Key sales metrics and trends',
  refreshInterval: 'FIFTEEN_MINUTES',
});

// Add a metric widget
const widget = await execute(AddWidgetContract, {
  dashboardId: dashboard.id,
  name: 'Total Revenue',
  type: 'METRIC',
  gridX: 0,
  gridY: 0,
  gridWidth: 3,
  gridHeight: 2,
  queryId: revenueQueryId,
  config: {
    format: 'currency',
    prefix: '$',
    showChange: true,
  },
});

// Execute a query
const queryEngine = createQueryEngine();
const result = await queryEngine.execute(
  { type: 'METRIC', metricIds: ['daily_revenue'] },
  { dateRange: { start: new Date('2024-01-01'), end: new Date() } }
);
```

## Dependencies

- `@lssm/lib.schema` - Entity definitions
- `@lssm/lib.contracts` - Contract definitions
- `@lssm/lib.identity-rbac` - Access control
- `@lssm/lib.metering` - Usage metrics integration
- `@lssm/modules.audit-trail` - Change tracking
- `@lssm/modules.notifications` - Report delivery

## Feature Flags

| Flag | Description | Default |
|------|-------------|---------|
| `ANALYTICS_SQL_QUERIES` | Enable SQL query support | false |
| `ANALYTICS_SCHEDULED_REPORTS` | Enable scheduled reports | true |
| `ANALYTICS_PUBLIC_DASHBOARDS` | Allow public sharing | false |
| `ANALYTICS_ADVANCED_WIDGETS` | Enable maps, funnels | true |
| `ANALYTICS_QUERY_CACHING` | Enable result caching | true |

## Permissions

| Permission | Description | Default Roles |
|------------|-------------|---------------|
| `dashboard:view` | View dashboards | viewer, analyst, admin |
| `dashboard:create` | Create dashboards | analyst, admin |
| `dashboard:edit` | Edit dashboards | analyst, admin |
| `dashboard:delete` | Delete dashboards | admin |
| `dashboard:share` | Share externally | analyst, admin |
| `query:create` | Create queries | analyst, admin |
| `query:execute` | Execute queries | viewer, analyst, admin |
| `report:schedule` | Schedule reports | analyst, admin |




