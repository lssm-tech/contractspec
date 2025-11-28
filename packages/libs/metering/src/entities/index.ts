import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';

/**
 * Aggregation type enum.
 */
export const AggregationTypeEnum = defineEntityEnum({
  name: 'AggregationType',
  values: ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'LAST'] as const,
  schema: 'lssm_metering',
  description: 'How to aggregate metric values.',
});

/**
 * Reset period enum.
 */
export const ResetPeriodEnum = defineEntityEnum({
  name: 'ResetPeriod',
  values: ['NEVER', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const,
  schema: 'lssm_metering',
  description: 'When to reset metric counters.',
});

/**
 * Period type enum.
 */
export const PeriodTypeEnum = defineEntityEnum({
  name: 'PeriodType',
  values: ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const,
  schema: 'lssm_metering',
  description: 'Time period for aggregation.',
});

/**
 * Threshold action enum.
 */
export const ThresholdActionEnum = defineEntityEnum({
  name: 'ThresholdAction',
  values: ['NONE', 'ALERT', 'WARN', 'BLOCK', 'DOWNGRADE'] as const,
  schema: 'lssm_metering',
  description: 'Action to take when threshold is exceeded.',
});

/**
 * MetricDefinition entity - defines a trackable metric.
 */
export const MetricDefinitionEntity = defineEntity({
  name: 'MetricDefinition',
  description: 'Definition of a usage metric.',
  schema: 'lssm_metering',
  map: 'metric_definition',
  fields: {
    id: field.id({ description: 'Unique identifier' }),
    key: field.string({ isUnique: true, description: 'Metric key (e.g., api_calls, storage_gb)' }),
    name: field.string({ description: 'Human-readable name' }),
    description: field.string({ isOptional: true, description: 'Metric description' }),
    
    // Configuration
    unit: field.string({ description: 'Unit of measurement (calls, bytes, etc.)' }),
    aggregationType: field.enum('AggregationType', { default: 'SUM', description: 'How to aggregate values' }),
    resetPeriod: field.enum('ResetPeriod', { default: 'MONTHLY', description: 'When to reset counters' }),
    
    // Precision
    precision: field.int({ default: 2, description: 'Decimal precision' }),
    
    // Scope
    orgId: field.string({ isOptional: true, description: 'Organization scope (null = global metric)' }),
    
    // Display
    category: field.string({ isOptional: true, description: 'Category for grouping' }),
    displayOrder: field.int({ default: 0, description: 'Order for display' }),
    
    // Metadata
    metadata: field.json({ isOptional: true, description: 'Additional metadata' }),
    
    // Status
    isActive: field.boolean({ default: true, description: 'Whether metric is active' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    
    // Relations
    usageRecords: field.hasMany('UsageRecord'),
    usageSummaries: field.hasMany('UsageSummary'),
    thresholds: field.hasMany('UsageThreshold'),
  },
  indexes: [
    index.on(['orgId', 'key']),
    index.on(['category']),
    index.on(['isActive']),
  ],
  enums: [AggregationTypeEnum, ResetPeriodEnum],
});

/**
 * UsageRecord entity - individual usage event.
 */
export const UsageRecordEntity = defineEntity({
  name: 'UsageRecord',
  description: 'A single usage event.',
  schema: 'lssm_metering',
  map: 'usage_record',
  fields: {
    id: field.id({ description: 'Unique identifier' }),
    
    // Metric reference
    metricKey: field.string({ description: 'Metric being recorded' }),
    metricId: field.string({ isOptional: true, description: 'Metric ID (for FK)' }),
    
    // Subject
    subjectType: field.string({ description: 'Subject type (org, user, project)' }),
    subjectId: field.string({ description: 'Subject identifier' }),
    
    // Usage value
    quantity: field.decimal({ description: 'Usage quantity' }),
    
    // Context
    source: field.string({ isOptional: true, description: 'Source of usage (endpoint, feature, etc.)' }),
    resourceId: field.string({ isOptional: true, description: 'Related resource ID' }),
    resourceType: field.string({ isOptional: true, description: 'Related resource type' }),
    
    // Metadata
    metadata: field.json({ isOptional: true, description: 'Additional context' }),
    
    // Idempotency
    idempotencyKey: field.string({ isOptional: true, description: 'Idempotency key for deduplication' }),
    
    // Timestamps
    timestamp: field.dateTime({ description: 'When usage occurred' }),
    createdAt: field.createdAt(),
    
    // Aggregation status
    aggregated: field.boolean({ default: false, description: 'Whether included in summary' }),
    aggregatedAt: field.dateTime({ isOptional: true, description: 'When aggregated' }),
  },
  indexes: [
    index.on(['metricKey', 'subjectType', 'subjectId', 'timestamp']),
    index.on(['subjectType', 'subjectId', 'timestamp']),
    index.on(['timestamp']),
    index.on(['aggregated', 'timestamp']),
    index.unique(['idempotencyKey'], { name: 'usage_record_idempotency' }),
  ],
});

/**
 * UsageSummary entity - pre-aggregated usage.
 */
export const UsageSummaryEntity = defineEntity({
  name: 'UsageSummary',
  description: 'Pre-aggregated usage summary.',
  schema: 'lssm_metering',
  map: 'usage_summary',
  fields: {
    id: field.id({ description: 'Unique identifier' }),
    
    // Metric reference
    metricKey: field.string({ description: 'Metric key' }),
    metricId: field.string({ isOptional: true, description: 'Metric ID (for FK)' }),
    
    // Subject
    subjectType: field.string({ description: 'Subject type' }),
    subjectId: field.string({ description: 'Subject identifier' }),
    
    // Period
    periodType: field.enum('PeriodType', { description: 'Period type' }),
    periodStart: field.dateTime({ description: 'Period start time' }),
    periodEnd: field.dateTime({ description: 'Period end time' }),
    
    // Aggregated values
    totalQuantity: field.decimal({ description: 'Total/aggregated quantity' }),
    recordCount: field.int({ default: 0, description: 'Number of records aggregated' }),
    
    // Statistics (for AVG, MIN, MAX)
    minQuantity: field.decimal({ isOptional: true, description: 'Minimum value' }),
    maxQuantity: field.decimal({ isOptional: true, description: 'Maximum value' }),
    avgQuantity: field.decimal({ isOptional: true, description: 'Average value' }),
    
    // Metadata
    metadata: field.json({ isOptional: true, description: 'Additional metadata' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
  indexes: [
    index.unique(['metricKey', 'subjectType', 'subjectId', 'periodType', 'periodStart'], { name: 'usage_summary_unique' }),
    index.on(['subjectType', 'subjectId', 'periodType', 'periodStart']),
    index.on(['metricKey', 'periodType', 'periodStart']),
  ],
  enums: [PeriodTypeEnum],
});

/**
 * UsageThreshold entity - threshold configuration.
 */
export const UsageThresholdEntity = defineEntity({
  name: 'UsageThreshold',
  description: 'Usage threshold configuration.',
  schema: 'lssm_metering',
  map: 'usage_threshold',
  fields: {
    id: field.id({ description: 'Unique identifier' }),
    
    // Metric reference
    metricKey: field.string({ description: 'Metric to monitor' }),
    metricId: field.string({ isOptional: true, description: 'Metric ID (for FK)' }),
    
    // Subject (optional - can be global)
    subjectType: field.string({ isOptional: true, description: 'Subject type' }),
    subjectId: field.string({ isOptional: true, description: 'Subject identifier' }),
    
    // Threshold configuration
    name: field.string({ description: 'Threshold name' }),
    threshold: field.decimal({ description: 'Threshold value' }),
    warnThreshold: field.decimal({ isOptional: true, description: 'Warning threshold (e.g., 80%)' }),
    
    // Period
    periodType: field.enum('PeriodType', { default: 'MONTHLY', description: 'Period to evaluate' }),
    
    // Actions
    action: field.enum('ThresholdAction', { default: 'ALERT', description: 'Action when exceeded' }),
    notifyEmails: field.json({ isOptional: true, description: 'Email addresses to notify' }),
    notifyWebhook: field.string({ isOptional: true, description: 'Webhook URL to call' }),
    
    // Status tracking
    currentValue: field.decimal({ default: 0, description: 'Current usage value' }),
    lastCheckedAt: field.dateTime({ isOptional: true, description: 'Last threshold check' }),
    lastExceededAt: field.dateTime({ isOptional: true, description: 'Last time threshold was exceeded' }),
    
    // Status
    isActive: field.boolean({ default: true, description: 'Whether threshold is active' }),
    
    // Metadata
    metadata: field.json({ isOptional: true, description: 'Additional metadata' }),
    
    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
  indexes: [
    index.on(['metricKey']),
    index.on(['subjectType', 'subjectId']),
    index.on(['isActive', 'metricKey']),
  ],
  enums: [ThresholdActionEnum],
});

/**
 * UsageAlert entity - threshold violation alerts.
 */
export const UsageAlertEntity = defineEntity({
  name: 'UsageAlert',
  description: 'Alert generated when threshold is exceeded.',
  schema: 'lssm_metering',
  map: 'usage_alert',
  fields: {
    id: field.id({ description: 'Unique identifier' }),
    
    // Threshold reference
    thresholdId: field.foreignKey({ description: 'Threshold that triggered alert' }),
    
    // Context
    metricKey: field.string({ description: 'Metric key' }),
    subjectType: field.string({ isOptional: true, description: 'Subject type' }),
    subjectId: field.string({ isOptional: true, description: 'Subject identifier' }),
    
    // Alert details
    alertType: field.string({ description: 'Alert type (warn, exceed, etc.)' }),
    threshold: field.decimal({ description: 'Threshold value' }),
    actualValue: field.decimal({ description: 'Actual usage value' }),
    percentageUsed: field.decimal({ description: 'Percentage of threshold used' }),
    
    // Status
    status: field.string({ default: '"pending"', description: 'Alert status (pending, acknowledged, resolved)' }),
    acknowledgedBy: field.string({ isOptional: true, description: 'User who acknowledged' }),
    acknowledgedAt: field.dateTime({ isOptional: true, description: 'When acknowledged' }),
    resolvedAt: field.dateTime({ isOptional: true, description: 'When resolved' }),
    
    // Notifications
    notificationsSent: field.json({ isOptional: true, description: 'Notifications sent' }),
    
    // Timestamps
    triggeredAt: field.dateTime({ description: 'When alert was triggered' }),
    createdAt: field.createdAt(),
    
    // Relations
    threshold: field.belongsTo('UsageThreshold', ['thresholdId'], ['id'], { onDelete: 'Cascade' }),
  },
  indexes: [
    index.on(['thresholdId', 'status']),
    index.on(['metricKey', 'triggeredAt']),
    index.on(['status', 'triggeredAt']),
  ],
});

/**
 * All metering entities for schema composition.
 */
export const meteringEntities = [
  MetricDefinitionEntity,
  UsageRecordEntity,
  UsageSummaryEntity,
  UsageThresholdEntity,
  UsageAlertEntity,
];

/**
 * Module schema contribution for metering.
 */
export const meteringSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/lib.metering',
  entities: meteringEntities,
  enums: [AggregationTypeEnum, ResetPeriodEnum, PeriodTypeEnum, ThresholdActionEnum],
};

