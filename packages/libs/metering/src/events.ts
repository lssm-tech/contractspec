import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

// ============ Event Payloads ============

const MetricDefinedPayload = defineSchemaModel({
  name: 'MetricDefinedEventPayload',
  description: 'Payload when a metric is defined',
  fields: {
    metricId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    unit: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    aggregationType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const MetricUpdatedPayload = defineSchemaModel({
  name: 'MetricUpdatedEventPayload',
  description: 'Payload when a metric is updated',
  fields: {
    metricId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changes: { type: ScalarTypeEnum.JSON(), isOptional: false },
    updatedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const UsageRecordedPayload = defineSchemaModel({
  name: 'UsageRecordedEventPayload',
  description: 'Payload when usage is recorded',
  fields: {
    recordId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quantity: { type: ScalarTypeEnum.Float(), isOptional: false },
    source: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const UsageBatchRecordedPayload = defineSchemaModel({
  name: 'UsageBatchRecordedEventPayload',
  description: 'Payload when a batch of usage is recorded',
  fields: {
    recordCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    metricKeys: { type: ScalarTypeEnum.JSON(), isOptional: false },
    totalQuantity: { type: ScalarTypeEnum.Float(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const UsageAggregatedPayload = defineSchemaModel({
  name: 'UsageAggregatedEventPayload',
  description: 'Payload when usage is aggregated',
  fields: {
    summaryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    periodType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    periodStart: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    periodEnd: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    totalQuantity: { type: ScalarTypeEnum.Float(), isOptional: false },
    recordCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    aggregatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ThresholdCreatedPayload = defineSchemaModel({
  name: 'ThresholdCreatedEventPayload',
  description: 'Payload when a threshold is created',
  fields: {
    thresholdId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    threshold: { type: ScalarTypeEnum.Float(), isOptional: false },
    action: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ThresholdExceededPayload = defineSchemaModel({
  name: 'ThresholdExceededEventPayload',
  description: 'Payload when a threshold is exceeded',
  fields: {
    alertId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    thresholdId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    threshold: { type: ScalarTypeEnum.Float(), isOptional: false },
    actualValue: { type: ScalarTypeEnum.Float(), isOptional: false },
    percentageUsed: { type: ScalarTypeEnum.Float(), isOptional: false },
    action: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    triggeredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ThresholdApproachingPayload = defineSchemaModel({
  name: 'ThresholdApproachingEventPayload',
  description: 'Payload when usage is approaching a threshold',
  fields: {
    thresholdId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    threshold: { type: ScalarTypeEnum.Float(), isOptional: false },
    currentValue: { type: ScalarTypeEnum.Float(), isOptional: false },
    percentageUsed: { type: ScalarTypeEnum.Float(), isOptional: false },
    triggeredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Events ============

/**
 * Emitted when a metric is defined.
 */
export const MetricDefinedEvent = defineEvent({
  name: 'metric.defined',
  version: 1,
  description: 'A metric has been defined.',
  payload: MetricDefinedPayload,
});

/**
 * Emitted when a metric is updated.
 */
export const MetricUpdatedEvent = defineEvent({
  name: 'metric.updated',
  version: 1,
  description: 'A metric has been updated.',
  payload: MetricUpdatedPayload,
});

/**
 * Emitted when usage is recorded.
 */
export const UsageRecordedEvent = defineEvent({
  name: 'usage.recorded',
  version: 1,
  description: 'Usage has been recorded.',
  payload: UsageRecordedPayload,
});

/**
 * Emitted when a batch of usage is recorded.
 */
export const UsageBatchRecordedEvent = defineEvent({
  name: 'usage.batch_recorded',
  version: 1,
  description: 'A batch of usage has been recorded.',
  payload: UsageBatchRecordedPayload,
});

/**
 * Emitted when usage is aggregated.
 */
export const UsageAggregatedEvent = defineEvent({
  name: 'usage.aggregated',
  version: 1,
  description: 'Usage has been aggregated into a summary.',
  payload: UsageAggregatedPayload,
});

/**
 * Emitted when a threshold is created.
 */
export const ThresholdCreatedEvent = defineEvent({
  name: 'threshold.created',
  version: 1,
  description: 'A usage threshold has been created.',
  payload: ThresholdCreatedPayload,
});

/**
 * Emitted when a threshold is exceeded.
 */
export const ThresholdExceededEvent = defineEvent({
  name: 'threshold.exceeded',
  version: 1,
  description: 'Usage has exceeded a threshold.',
  payload: ThresholdExceededPayload,
});

/**
 * Emitted when usage is approaching a threshold.
 */
export const ThresholdApproachingEvent = defineEvent({
  name: 'threshold.approaching',
  version: 1,
  description: 'Usage is approaching a threshold.',
  payload: ThresholdApproachingPayload,
});

/**
 * All metering events.
 */
export const MeteringEvents = {
  MetricDefinedEvent,
  MetricUpdatedEvent,
  UsageRecordedEvent,
  UsageBatchRecordedEvent,
  UsageAggregatedEvent,
  ThresholdCreatedEvent,
  ThresholdExceededEvent,
  ThresholdApproachingEvent,
};

