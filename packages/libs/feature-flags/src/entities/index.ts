import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';

/**
 * Feature flag status enum.
 */
export const FlagStatusEnum = defineEntityEnum({
  name: 'FlagStatus',
  values: ['OFF', 'ON', 'GRADUAL'] as const,
  schema: 'lssm_feature_flags',
  description: 'Status of a feature flag.',
});

/**
 * Targeting rule operator enum.
 */
export const RuleOperatorEnum = defineEntityEnum({
  name: 'RuleOperator',
  values: [
    'EQ',
    'NEQ',
    'IN',
    'NIN',
    'CONTAINS',
    'NOT_CONTAINS',
    'GT',
    'GTE',
    'LT',
    'LTE',
    'PERCENTAGE',
  ] as const,
  schema: 'lssm_feature_flags',
  description: 'Operator for targeting rule conditions.',
});

/**
 * Experiment status enum.
 */
export const ExperimentStatusEnum = defineEntityEnum({
  name: 'ExperimentStatus',
  values: ['DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELLED'] as const,
  schema: 'lssm_feature_flags',
  description: 'Status of an experiment.',
});

/**
 * FeatureFlag entity - defines a feature flag.
 */
export const FeatureFlagEntity = defineEntity({
  name: 'FeatureFlag',
  description: 'A feature flag for controlling feature availability.',
  schema: 'lssm_feature_flags',
  map: 'feature_flag',
  fields: {
    id: field.id({ description: 'Unique flag identifier' }),
    key: field.string({
      isUnique: true,
      description: 'Flag key (e.g., new_dashboard)',
    }),
    name: field.string({ description: 'Human-readable name' }),
    description: field.string({
      isOptional: true,
      description: 'Description of the flag',
    }),

    // Status and default value
    status: field.enum('FlagStatus', {
      default: 'OFF',
      description: 'Flag status',
    }),
    defaultValue: field.boolean({
      default: false,
      description: 'Default value when no rules match',
    }),

    // Multivariate support
    variants: field.json({
      isOptional: true,
      description: 'Variant definitions for multivariate flags',
    }),

    // Scope
    orgId: field.string({
      isOptional: true,
      description: 'Organization scope (null = global)',
    }),

    // Metadata
    tags: field.json({
      isOptional: true,
      description: 'Tags for categorization',
    }),
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    targetingRules: field.hasMany('FlagTargetingRule'),
    experiments: field.hasMany('Experiment'),
    evaluations: field.hasMany('FlagEvaluation'),
  },
  indexes: [index.on(['orgId', 'key']), index.on(['status'])],
  enums: [FlagStatusEnum],
});

/**
 * FlagTargetingRule entity - conditions for targeting.
 */
export const FlagTargetingRuleEntity = defineEntity({
  name: 'FlagTargetingRule',
  description: 'A targeting rule for conditional flag evaluation.',
  schema: 'lssm_feature_flags',
  map: 'flag_targeting_rule',
  fields: {
    id: field.id({ description: 'Unique rule identifier' }),
    flagId: field.foreignKey({ description: 'Parent feature flag' }),

    // Rule definition
    name: field.string({
      isOptional: true,
      description: 'Rule name for debugging',
    }),
    priority: field.int({
      default: 0,
      description: 'Rule priority (lower = higher priority)',
    }),
    enabled: field.boolean({
      default: true,
      description: 'Whether rule is active',
    }),

    // Condition
    attribute: field.string({
      description: 'Target attribute (userId, orgId, plan, segment, etc.)',
    }),
    operator: field.enum('RuleOperator', {
      description: 'Comparison operator',
    }),
    value: field.json({ description: 'Target value(s)' }),

    // Result
    rolloutPercentage: field.int({
      isOptional: true,
      description: 'Percentage for gradual rollout (0-100)',
    }),
    serveValue: field.boolean({
      isOptional: true,
      description: 'Boolean value to serve',
    }),
    serveVariant: field.string({
      isOptional: true,
      description: 'Variant key to serve (for multivariate)',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    flag: field.belongsTo('FeatureFlag', ['flagId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [index.on(['flagId', 'priority']), index.on(['attribute'])],
  enums: [RuleOperatorEnum],
});

/**
 * Experiment entity - A/B test configuration.
 */
export const ExperimentEntity = defineEntity({
  name: 'Experiment',
  description: 'An A/B test experiment.',
  schema: 'lssm_feature_flags',
  map: 'experiment',
  fields: {
    id: field.id({ description: 'Unique experiment identifier' }),
    key: field.string({ isUnique: true, description: 'Experiment key' }),
    name: field.string({ description: 'Human-readable name' }),
    description: field.string({
      isOptional: true,
      description: 'Experiment description',
    }),
    hypothesis: field.string({
      isOptional: true,
      description: 'Experiment hypothesis',
    }),

    // Associated flag
    flagId: field.foreignKey({ description: 'Associated feature flag' }),

    // Configuration
    status: field.enum('ExperimentStatus', {
      default: 'DRAFT',
      description: 'Experiment status',
    }),
    variants: field.json({
      description: 'Variant definitions with split ratios',
    }),
    metrics: field.json({ isOptional: true, description: 'Metrics to track' }),

    // Targeting
    audiencePercentage: field.int({
      default: 100,
      description: 'Percentage of audience to include',
    }),
    audienceFilter: field.json({
      isOptional: true,
      description: 'Audience filter criteria',
    }),

    // Timeline
    scheduledStartAt: field.dateTime({
      isOptional: true,
      description: 'Scheduled start time',
    }),
    scheduledEndAt: field.dateTime({
      isOptional: true,
      description: 'Scheduled end time',
    }),
    startedAt: field.dateTime({
      isOptional: true,
      description: 'Actual start time',
    }),
    endedAt: field.dateTime({
      isOptional: true,
      description: 'Actual end time',
    }),

    // Results
    winningVariant: field.string({
      isOptional: true,
      description: 'Declared winning variant',
    }),
    results: field.json({
      isOptional: true,
      description: 'Experiment results summary',
    }),

    // Scope
    orgId: field.string({
      isOptional: true,
      description: 'Organization scope',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    flag: field.belongsTo('FeatureFlag', ['flagId'], ['id'], {
      onDelete: 'Cascade',
    }),
    assignments: field.hasMany('ExperimentAssignment'),
  },
  indexes: [
    index.on(['status']),
    index.on(['orgId', 'status']),
    index.on(['flagId']),
  ],
  enums: [ExperimentStatusEnum],
});

/**
 * ExperimentAssignment entity - tracks which variant a subject is assigned to.
 */
export const ExperimentAssignmentEntity = defineEntity({
  name: 'ExperimentAssignment',
  description: 'Tracks experiment variant assignments.',
  schema: 'lssm_feature_flags',
  map: 'experiment_assignment',
  fields: {
    id: field.id({ description: 'Unique assignment identifier' }),
    experimentId: field.foreignKey({ description: 'Parent experiment' }),

    // Subject
    subjectType: field.string({
      description: 'Subject type (user, org, session)',
    }),
    subjectId: field.string({ description: 'Subject identifier' }),

    // Assignment
    variant: field.string({ description: 'Assigned variant key' }),
    bucket: field.int({ description: 'Hash bucket (0-99)' }),

    // Context
    context: field.json({
      isOptional: true,
      description: 'Context at assignment time',
    }),

    // Timestamps
    assignedAt: field.dateTime({ description: 'Assignment timestamp' }),

    // Relations
    experiment: field.belongsTo('Experiment', ['experimentId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.unique(['experimentId', 'subjectType', 'subjectId'], {
      name: 'experiment_assignment_unique',
    }),
    index.on(['subjectType', 'subjectId']),
  ],
});

/**
 * FlagEvaluation entity - evaluation log for analytics.
 */
export const FlagEvaluationEntity = defineEntity({
  name: 'FlagEvaluation',
  description: 'Log of flag evaluations for debugging and analytics.',
  schema: 'lssm_feature_flags',
  map: 'flag_evaluation',
  fields: {
    id: field.id({ description: 'Unique evaluation identifier' }),
    flagId: field.foreignKey({ description: 'Evaluated flag' }),
    flagKey: field.string({
      description: 'Flag key (denormalized for queries)',
    }),

    // Subject
    subjectType: field.string({
      description: 'Subject type (user, org, anonymous)',
    }),
    subjectId: field.string({ description: 'Subject identifier' }),

    // Result
    result: field.boolean({ description: 'Evaluation result' }),
    variant: field.string({
      isOptional: true,
      description: 'Served variant (for multivariate)',
    }),

    // Match info
    matchedRuleId: field.string({
      isOptional: true,
      description: 'Rule that matched (if any)',
    }),
    reason: field.string({
      description: 'Evaluation reason (default, rule, experiment, etc.)',
    }),

    // Context
    context: field.json({
      isOptional: true,
      description: 'Evaluation context',
    }),

    // Timestamps
    evaluatedAt: field.dateTime({ description: 'Evaluation timestamp' }),

    // Relations
    flag: field.belongsTo('FeatureFlag', ['flagId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.on(['flagKey', 'evaluatedAt']),
    index.on(['subjectType', 'subjectId', 'evaluatedAt']),
    index.on(['flagId', 'evaluatedAt']),
  ],
});

/**
 * All feature flag entities for schema composition.
 */
export const featureFlagEntities = [
  FeatureFlagEntity,
  FlagTargetingRuleEntity,
  ExperimentEntity,
  ExperimentAssignmentEntity,
  FlagEvaluationEntity,
];

/**
 * Module schema contribution for feature flags.
 */
export const featureFlagsSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/lib.feature-flags',
  entities: featureFlagEntities,
  enums: [FlagStatusEnum, RuleOperatorEnum, ExperimentStatusEnum],
};

