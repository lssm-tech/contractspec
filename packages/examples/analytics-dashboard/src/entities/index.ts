import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';

// ============ Enums ============

export const DashboardStatusEnum = defineEntityEnum({
  name: 'DashboardStatus',
  values: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const,
  schema: 'analytics',
  description: 'Status of a dashboard.',
});

export const WidgetTypeEnum = defineEntityEnum({
  name: 'WidgetType',
  values: [
    'LINE_CHART',
    'BAR_CHART',
    'PIE_CHART',
    'AREA_CHART',
    'SCATTER_PLOT',
    'METRIC',
    'TABLE',
    'HEATMAP',
    'FUNNEL',
    'MAP',
    'TEXT',
    'EMBED',
  ] as const,
  schema: 'analytics',
  description: 'Type of widget visualization.',
});

export const QueryTypeEnum = defineEntityEnum({
  name: 'QueryType',
  values: ['SQL', 'METRIC', 'AGGREGATION', 'CUSTOM'] as const,
  schema: 'analytics',
  description: 'Type of data query.',
});

export const RefreshIntervalEnum = defineEntityEnum({
  name: 'RefreshInterval',
  values: ['NONE', 'MINUTE', 'FIVE_MINUTES', 'FIFTEEN_MINUTES', 'HOUR', 'DAY'] as const,
  schema: 'analytics',
  description: 'Auto-refresh interval.',
});

// ============ Entities ============

/**
 * Dashboard - a collection of widgets.
 */
export const DashboardEntity = defineEntity({
  name: 'Dashboard',
  description: 'An analytics dashboard with widgets.',
  schema: 'analytics',
  map: 'dashboard',
  fields: {
    id: field.id({ description: 'Unique dashboard ID' }),
    
    // Identity
    name: field.string({ description: 'Dashboard name' }),
    slug: field.string({ description: 'URL-friendly identifier' }),
    description: field.string({ isOptional: true }),
    
    // Status
    status: field.enum('DashboardStatus', { default: 'DRAFT' }),
    
    // Layout
    layout: field.json({ isOptional: true, description: 'Grid layout configuration' }),
    
    // Settings
    refreshInterval: field.enum('RefreshInterval', { default: 'NONE' }),
    dateRange: field.json({ isOptional: true, description: 'Default date range' }),
    filters: field.json({ isOptional: true, description: 'Global dashboard filters' }),
    
    // Sharing
    isPublic: field.boolean({ default: false }),
    shareToken: field.string({ isOptional: true }),
    
    // Ownership
    organizationId: field.foreignKey(),
    createdBy: field.foreignKey(),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    publishedAt: field.dateTime({ isOptional: true }),
    
    // Relations
    widgets: field.hasMany('Widget'),
  },
  indexes: [
    index.on(['organizationId', 'slug']).unique(),
    index.on(['organizationId', 'status']),
    index.on(['shareToken']),
    index.on(['createdBy']),
  ],
  enums: [DashboardStatusEnum, RefreshIntervalEnum],
});

/**
 * Widget - a visualization component on a dashboard.
 */
export const WidgetEntity = defineEntity({
  name: 'Widget',
  description: 'A visualization widget on a dashboard.',
  schema: 'analytics',
  map: 'widget',
  fields: {
    id: field.id(),
    dashboardId: field.foreignKey(),
    
    // Identity
    name: field.string({ description: 'Widget title' }),
    description: field.string({ isOptional: true }),
    
    // Type
    type: field.enum('WidgetType', { default: 'LINE_CHART' }),
    
    // Position in grid
    gridX: field.int({ default: 0 }),
    gridY: field.int({ default: 0 }),
    gridWidth: field.int({ default: 6 }),
    gridHeight: field.int({ default: 4 }),
    
    // Query
    queryId: field.string({ isOptional: true }),
    
    // Configuration
    config: field.json({ isOptional: true, description: 'Widget-specific configuration' }),
    
    // Styling
    styling: field.json({ isOptional: true }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    dashboard: field.belongsTo('Dashboard', ['dashboardId'], ['id'], { onDelete: 'Cascade' }),
    query: field.belongsTo('Query', ['queryId'], ['id']),
  },
  indexes: [
    index.on(['dashboardId']),
    index.on(['queryId']),
  ],
  enums: [WidgetTypeEnum],
});

/**
 * Query - a data query definition.
 */
export const QueryEntity = defineEntity({
  name: 'Query',
  description: 'A data query for analytics.',
  schema: 'analytics',
  map: 'query',
  fields: {
    id: field.id(),
    
    // Identity
    name: field.string({ description: 'Query name' }),
    description: field.string({ isOptional: true }),
    
    // Type
    type: field.enum('QueryType', { default: 'AGGREGATION' }),
    
    // Query definition
    definition: field.json({ description: 'Query definition' }),
    
    // SQL (for SQL type)
    sql: field.string({ isOptional: true }),
    
    // Metric references (for METRIC type)
    metricIds: field.string({ isArray: true }),
    
    // Caching
    cacheTtlSeconds: field.int({ default: 300 }),
    
    // Ownership
    organizationId: field.foreignKey(),
    createdBy: field.foreignKey(),
    
    // Sharing
    isShared: field.boolean({ default: false }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    widgets: field.hasMany('Widget'),
  },
  indexes: [
    index.on(['organizationId', 'isShared']),
    index.on(['createdBy']),
    index.on(['type']),
  ],
  enums: [QueryTypeEnum],
});

/**
 * SavedFilter - reusable filter configurations.
 */
export const SavedFilterEntity = defineEntity({
  name: 'SavedFilter',
  description: 'A saved filter configuration.',
  schema: 'analytics',
  map: 'saved_filter',
  fields: {
    id: field.id(),
    
    // Identity
    name: field.string(),
    description: field.string({ isOptional: true }),
    
    // Filter
    filterConfig: field.json({ description: 'Filter configuration' }),
    
    // Scope
    dashboardId: field.string({ isOptional: true }),
    isGlobal: field.boolean({ default: false }),
    
    // Ownership
    organizationId: field.foreignKey(),
    createdBy: field.foreignKey(),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    dashboard: field.belongsTo('Dashboard', ['dashboardId'], ['id']),
  },
  indexes: [
    index.on(['organizationId', 'isGlobal']),
    index.on(['dashboardId']),
    index.on(['createdBy']),
  ],
});

/**
 * Report - scheduled or on-demand reports.
 */
export const ReportEntity = defineEntity({
  name: 'Report',
  description: 'A scheduled or on-demand report.',
  schema: 'analytics',
  map: 'report',
  fields: {
    id: field.id(),
    
    // Identity
    name: field.string(),
    description: field.string({ isOptional: true }),
    
    // Source
    dashboardId: field.foreignKey({ isOptional: true }),
    queryIds: field.string({ isArray: true }),
    
    // Schedule
    scheduleEnabled: field.boolean({ default: false }),
    scheduleCron: field.string({ isOptional: true }),
    
    // Delivery
    recipients: field.string({ isArray: true }),
    format: field.string({ default: '"PDF"' }),
    
    // Status
    lastRunAt: field.dateTime({ isOptional: true }),
    lastRunStatus: field.string({ isOptional: true }),
    
    // Ownership
    organizationId: field.foreignKey(),
    createdBy: field.foreignKey(),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    dashboard: field.belongsTo('Dashboard', ['dashboardId'], ['id']),
    runs: field.hasMany('ReportRun'),
  },
  indexes: [
    index.on(['organizationId']),
    index.on(['dashboardId']),
    index.on(['scheduleEnabled']),
  ],
});

/**
 * ReportRun - a single report execution.
 */
export const ReportRunEntity = defineEntity({
  name: 'ReportRun',
  description: 'A report execution record.',
  schema: 'analytics',
  map: 'report_run',
  fields: {
    id: field.id(),
    reportId: field.foreignKey(),
    
    // Status
    status: field.string({ default: '"PENDING"' }),
    
    // Output
    fileId: field.string({ isOptional: true }),
    
    // Error
    errorMessage: field.string({ isOptional: true }),
    
    // Timing
    startedAt: field.dateTime({ isOptional: true }),
    completedAt: field.dateTime({ isOptional: true }),
    
    // Timestamps
    createdAt: field.createdAt(),
    
    // Relations
    report: field.belongsTo('Report', ['reportId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['reportId', 'createdAt']),
    index.on(['status']),
  ],
});

// ============ Schema Contribution ============

export const analyticsDashboardEntities = [
  DashboardEntity,
  WidgetEntity,
  QueryEntity,
  SavedFilterEntity,
  ReportEntity,
  ReportRunEntity,
];

export const analyticsDashboardSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/example.analytics-dashboard',
  entities: analyticsDashboardEntities,
  enums: [
    DashboardStatusEnum,
    WidgetTypeEnum,
    QueryTypeEnum,
    RefreshIntervalEnum,
  ],
};

