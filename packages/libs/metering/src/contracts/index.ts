import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineCommand, defineQuery } from '@contractspec/lib.contracts-spec';

const OWNERS = ['platform.metering'] as const;

// ============ Schema Models ============

export const MetricDefinitionModel = defineSchemaModel({
  name: 'MetricDefinition',
  description: 'Represents a metric definition',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    unit: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    aggregationType: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    resetPeriod: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isActive: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const UsageRecordModel = defineSchemaModel({
  name: 'UsageRecord',
  description: 'Represents a usage record',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quantity: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    source: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    resourceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    resourceType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const UsageSummaryModel = defineSchemaModel({
  name: 'UsageSummary',
  description: 'Represents aggregated usage',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    periodType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    periodStart: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    periodEnd: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    totalQuantity: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    recordCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    minQuantity: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    maxQuantity: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    avgQuantity: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
  },
});

export const UsageThresholdModel = defineSchemaModel({
  name: 'UsageThreshold',
  description: 'Represents a usage threshold',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    threshold: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    warnThreshold: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    periodType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    action: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    currentValue: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    isActive: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Input/Output Models ============

const DefineMetricInput = defineSchemaModel({
  name: 'DefineMetricInput',
  description: 'Input for defining a metric',
  fields: {
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    unit: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    aggregationType: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    resetPeriod: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

const UpdateMetricInput = defineSchemaModel({
  name: 'UpdateMetricInput',
  description: 'Input for updating a metric',
  fields: {
    metricId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isActive: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

const DeleteMetricInput = defineSchemaModel({
  name: 'DeleteMetricInput',
  description: 'Input for deleting a metric',
  fields: {
    metricId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const GetMetricInput = defineSchemaModel({
  name: 'GetMetricInput',
  description: 'Input for getting a metric',
  fields: {
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const ListMetricsInput = defineSchemaModel({
  name: 'ListMetricsInput',
  description: 'Input for listing metrics',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isActive: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const ListMetricsOutput = defineSchemaModel({
  name: 'ListMetricsOutput',
  description: 'Output for listing metrics',
  fields: {
    metrics: { type: MetricDefinitionModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const RecordUsageInput = defineSchemaModel({
  name: 'RecordUsageInput',
  description: 'Input for recording usage',
  fields: {
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quantity: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    source: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    resourceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    resourceType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
    idempotencyKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
  },
});

const RecordBatchUsageInput = defineSchemaModel({
  name: 'RecordBatchUsageInput',
  description: 'Input for recording batch usage',
  fields: {
    records: { type: RecordUsageInput, isArray: true, isOptional: false },
  },
});

const RecordBatchUsageOutput = defineSchemaModel({
  name: 'RecordBatchUsageOutput',
  description: 'Output for recording batch usage',
  fields: {
    recordedCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    skippedCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    recordIds: { type: ScalarTypeEnum.JSON(), isOptional: false },
  },
});

const GetUsageInput = defineSchemaModel({
  name: 'GetUsageInput',
  description: 'Input for getting usage',
  fields: {
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    startDate: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    endDate: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const GetUsageOutput = defineSchemaModel({
  name: 'GetUsageOutput',
  description: 'Output for getting usage',
  fields: {
    records: { type: UsageRecordModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    totalQuantity: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});

const GetUsageSummaryInput = defineSchemaModel({
  name: 'GetUsageSummaryInput',
  description: 'Input for getting usage summary',
  fields: {
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    periodType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    startDate: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    endDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

const GetUsageSummaryOutput = defineSchemaModel({
  name: 'GetUsageSummaryOutput',
  description: 'Output for getting usage summary',
  fields: {
    summaries: { type: UsageSummaryModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const CreateThresholdInput = defineSchemaModel({
  name: 'CreateThresholdInput',
  description: 'Input for creating a threshold',
  fields: {
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    threshold: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    warnThreshold: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    periodType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    action: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    notifyEmails: { type: ScalarTypeEnum.JSON(), isOptional: true },
    notifyWebhook: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const UpdateThresholdInput = defineSchemaModel({
  name: 'UpdateThresholdInput',
  description: 'Input for updating a threshold',
  fields: {
    thresholdId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    threshold: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    warnThreshold: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    action: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    notifyEmails: { type: ScalarTypeEnum.JSON(), isOptional: true },
    notifyWebhook: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isActive: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const DeleteThresholdInput = defineSchemaModel({
  name: 'DeleteThresholdInput',
  description: 'Input for deleting a threshold',
  fields: {
    thresholdId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const ListThresholdsInput = defineSchemaModel({
  name: 'ListThresholdsInput',
  description: 'Input for listing thresholds',
  fields: {
    metricKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isActive: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const ListThresholdsOutput = defineSchemaModel({
  name: 'ListThresholdsOutput',
  description: 'Output for listing thresholds',
  fields: {
    thresholds: { type: UsageThresholdModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

const SuccessOutput = defineSchemaModel({
  name: 'SuccessOutput',
  description: 'Generic success output',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * Define a metric.
 */
export const DefineMetricContract = defineCommand({
  meta: {
    key: 'metric.define',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'metric', 'define'],
    description: 'Define a new usage metric.',
    goal: 'Create a new metric for tracking usage.',
    context: 'Called when setting up metering.',
  },
  io: {
    input: DefineMetricInput,
    output: MetricDefinitionModel,
    errors: {
      METRIC_KEY_EXISTS: {
        description: 'Metric key already exists',
        http: 409,
        gqlCode: 'METRIC_KEY_EXISTS',
        when: 'A metric with this key already exists',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Update a metric.
 */
export const UpdateMetricContract = defineCommand({
  meta: {
    key: 'metric.update',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'metric', 'update'],
    description: 'Update a metric definition.',
    goal: 'Modify metric configuration.',
    context: 'Called when updating metric settings.',
  },
  io: {
    input: UpdateMetricInput,
    output: MetricDefinitionModel,
    errors: {
      METRIC_NOT_FOUND: {
        description: 'Metric does not exist',
        http: 404,
        gqlCode: 'METRIC_NOT_FOUND',
        when: 'Metric ID is invalid',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Delete a metric.
 */
export const DeleteMetricContract = defineCommand({
  meta: {
    key: 'metric.delete',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'metric', 'delete'],
    description: 'Delete a metric definition.',
    goal: 'Remove a metric and its data.',
    context: 'Called when removing a metric.',
  },
  io: {
    input: DeleteMetricInput,
    output: SuccessOutput,
    errors: {
      METRIC_NOT_FOUND: {
        description: 'Metric does not exist',
        http: 404,
        gqlCode: 'METRIC_NOT_FOUND',
        when: 'Metric ID is invalid',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Get a metric by key.
 */
export const GetMetricContract = defineQuery({
  meta: {
    key: 'metric.get',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'metric', 'get'],
    description: 'Get a metric by key.',
    goal: 'Retrieve metric definition.',
    context: 'Called to inspect metric details.',
  },
  io: {
    input: GetMetricInput,
    output: MetricDefinitionModel,
    errors: {
      METRIC_NOT_FOUND: {
        description: 'Metric does not exist',
        http: 404,
        gqlCode: 'METRIC_NOT_FOUND',
        when: 'Metric key is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});

/**
 * List metrics.
 */
export const ListMetricsContract = defineQuery({
  meta: {
    key: 'metric.list',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'metric', 'list'],
    description: 'List all metrics.',
    goal: 'View configured metrics.',
    context: 'Called to browse metrics.',
  },
  io: {
    input: ListMetricsInput,
    output: ListMetricsOutput,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Record usage.
 */
export const RecordUsageContract = defineCommand({
  meta: {
    key: 'usage.record',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'usage', 'record'],
    description: 'Record a usage event.',
    goal: 'Track usage for billing and monitoring.',
    context: 'Called when usage occurs.',
  },
  io: {
    input: RecordUsageInput,
    output: UsageRecordModel,
    errors: {
      METRIC_NOT_FOUND: {
        description: 'Metric does not exist',
        http: 404,
        gqlCode: 'METRIC_NOT_FOUND',
        when: 'Metric key is invalid',
      },
      DUPLICATE_RECORD: {
        description: 'Record already exists',
        http: 409,
        gqlCode: 'DUPLICATE_RECORD',
        when: 'Idempotency key already used',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Record batch usage.
 */
export const RecordBatchUsageContract = defineCommand({
  meta: {
    key: 'usage.recordBatch',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'usage', 'batch'],
    description: 'Record multiple usage events.',
    goal: 'Efficiently track bulk usage.',
    context: 'Called for batch processing.',
  },
  io: {
    input: RecordBatchUsageInput,
    output: RecordBatchUsageOutput,
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Get usage records.
 */
export const GetUsageContract = defineQuery({
  meta: {
    key: 'usage.get',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'usage', 'get'],
    description: 'Get usage records for a subject.',
    goal: 'View detailed usage history.',
    context: 'Called to analyze usage.',
  },
  io: {
    input: GetUsageInput,
    output: GetUsageOutput,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Get usage summary.
 */
export const GetUsageSummaryContract = defineQuery({
  meta: {
    key: 'usage.getSummary',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'usage', 'summary'],
    description: 'Get aggregated usage summary.',
    goal: 'View usage totals for billing.',
    context: 'Called for billing and reporting.',
  },
  io: {
    input: GetUsageSummaryInput,
    output: GetUsageSummaryOutput,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Create a threshold.
 */
export const CreateThresholdContract = defineCommand({
  meta: {
    key: 'threshold.create',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'threshold', 'create'],
    description: 'Create a usage threshold.',
    goal: 'Set up usage limits and alerts.',
    context: 'Called when configuring limits.',
  },
  io: {
    input: CreateThresholdInput,
    output: UsageThresholdModel,
    errors: {
      METRIC_NOT_FOUND: {
        description: 'Metric does not exist',
        http: 404,
        gqlCode: 'METRIC_NOT_FOUND',
        when: 'Metric key is invalid',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Update a threshold.
 */
export const UpdateThresholdContract = defineCommand({
  meta: {
    key: 'threshold.update',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'threshold', 'update'],
    description: 'Update a threshold.',
    goal: 'Modify threshold configuration.',
    context: 'Called when adjusting limits.',
  },
  io: {
    input: UpdateThresholdInput,
    output: UsageThresholdModel,
    errors: {
      THRESHOLD_NOT_FOUND: {
        description: 'Threshold does not exist',
        http: 404,
        gqlCode: 'THRESHOLD_NOT_FOUND',
        when: 'Threshold ID is invalid',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Delete a threshold.
 */
export const DeleteThresholdContract = defineCommand({
  meta: {
    key: 'threshold.delete',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'threshold', 'delete'],
    description: 'Delete a threshold.',
    goal: 'Remove a usage threshold.',
    context: 'Called when removing limits.',
  },
  io: {
    input: DeleteThresholdInput,
    output: SuccessOutput,
    errors: {
      THRESHOLD_NOT_FOUND: {
        description: 'Threshold does not exist',
        http: 404,
        gqlCode: 'THRESHOLD_NOT_FOUND',
        when: 'Threshold ID is invalid',
      },
    },
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * List thresholds.
 */
export const ListThresholdsContract = defineQuery({
  meta: {
    key: 'threshold.list',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['metering', 'threshold', 'list'],
    description: 'List usage thresholds.',
    goal: 'View configured limits.',
    context: 'Called to browse thresholds.',
  },
  io: {
    input: ListThresholdsInput,
    output: ListThresholdsOutput,
  },
  policy: {
    auth: 'user',
  },
});
