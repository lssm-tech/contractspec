import { defineEnum } from '@lssm/lib.schema';

/**
 * Dashboard status enum.
 */
export const DashboardStatusEnum = defineEnum('DashboardStatus', [
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED',
]);

/**
 * Widget type enum.
 */
export const WidgetTypeEnum = defineEnum('WidgetType', [
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
]);

/**
 * Refresh interval enum.
 */
export const RefreshIntervalEnum = defineEnum('RefreshInterval', [
  'NONE',
  'MINUTE',
  'FIVE_MINUTES',
  'FIFTEEN_MINUTES',
  'HOUR',
  'DAY',
]);
