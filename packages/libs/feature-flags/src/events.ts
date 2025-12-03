import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '@contractspec/lib.contracts-spec';

// ============ Event Payloads ============

const FlagCreatedPayload = defineSchemaModel({
  name: 'FlagCreatedEventPayload',
  description: 'Payload when a feature flag is created',
  fields: {
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const FlagUpdatedPayload = defineSchemaModel({
  name: 'FlagUpdatedEventPayload',
  description: 'Payload when a feature flag is updated',
  fields: {
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changes: { type: ScalarTypeEnum.JSON(), isOptional: false },
    updatedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const FlagDeletedPayload = defineSchemaModel({
  name: 'FlagDeletedEventPayload',
  description: 'Payload when a feature flag is deleted',
  fields: {
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    deletedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    deletedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const FlagToggledPayload = defineSchemaModel({
  name: 'FlagToggledEventPayload',
  description: 'Payload when a feature flag status is toggled',
  fields: {
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousStatus: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    newStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toggledBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    toggledAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const RuleCreatedPayload = defineSchemaModel({
  name: 'RuleCreatedEventPayload',
  description: 'Payload when a targeting rule is created',
  fields: {
    ruleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    flagKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    attribute: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    operator: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const RuleDeletedPayload = defineSchemaModel({
  name: 'RuleDeletedEventPayload',
  description: 'Payload when a targeting rule is deleted',
  fields: {
    ruleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    flagKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    deletedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ExperimentCreatedPayload = defineSchemaModel({
  name: 'ExperimentCreatedEventPayload',
  description: 'Payload when an experiment is created',
  fields: {
    experimentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    variants: { type: ScalarTypeEnum.JSON(), isOptional: false },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ExperimentStartedPayload = defineSchemaModel({
  name: 'ExperimentStartedEventPayload',
  description: 'Payload when an experiment starts',
  fields: {
    experimentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    variants: { type: ScalarTypeEnum.JSON(), isOptional: false },
    audiencePercentage: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    startedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ExperimentStoppedPayload = defineSchemaModel({
  name: 'ExperimentStoppedEventPayload',
  description: 'Payload when an experiment stops',
  fields: {
    experimentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    winningVariant: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    stoppedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    stoppedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const FlagEvaluatedPayload = defineSchemaModel({
  name: 'FlagEvaluatedEventPayload',
  description: 'Payload when a flag is evaluated (for analytics)',
  fields: {
    flagId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    flagKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    result: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    variant: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    evaluatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const VariantAssignedPayload = defineSchemaModel({
  name: 'VariantAssignedEventPayload',
  description: 'Payload when a subject is assigned to an experiment variant',
  fields: {
    experimentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    experimentKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    subjectType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    subjectId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    variant: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    bucket: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    assignedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Events ============

/**
 * Emitted when a feature flag is created.
 */
export const FlagCreatedEvent = defineEvent({
  meta: {
    key: 'flag.created',
    version: '1.0.0',
    description: 'A feature flag has been created.',
    stability: 'stable',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'create'],
  },
  payload: FlagCreatedPayload,
});

/**
 * Emitted when a feature flag is updated.
 */
export const FlagUpdatedEvent = defineEvent({
  meta: {
    key: 'flag.updated',
    version: '1.0.0',
    description: 'A feature flag has been updated.',
    stability: 'stable',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'update'],
  },
  payload: FlagUpdatedPayload,
});

/**
 * Emitted when a feature flag is deleted.
 */
export const FlagDeletedEvent = defineEvent({
  meta: {
    key: 'flag.deleted',
    version: '1.0.0',
    description: 'A feature flag has been deleted.',
    stability: 'stable',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'delete'],
  },
  payload: FlagDeletedPayload,
});

/**
 * Emitted when a feature flag status is toggled.
 */
export const FlagToggledEvent = defineEvent({
  meta: {
    key: 'flag.toggled',
    version: '1.0.0',
    description: 'A feature flag status has been toggled.',
    stability: 'stable',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'toggle'],
  },
  payload: FlagToggledPayload,
});

/**
 * Emitted when a targeting rule is created.
 */
export const RuleCreatedEvent = defineEvent({
  meta: {
    key: 'flag.rule_created',
    version: '1.0.0',
    description: 'A targeting rule has been created.',
    stability: 'stable',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'rule', 'create'],
  },
  payload: RuleCreatedPayload,
});

/**
 * Emitted when a targeting rule is deleted.
 */
export const RuleDeletedEvent = defineEvent({
  meta: {
    key: 'flag.rule_deleted',
    version: '1.0.0',
    description: 'A targeting rule has been deleted.',
    stability: 'stable',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'rule', 'delete'],
  },
  payload: RuleDeletedPayload,
});

/**
 * Emitted when an experiment is created.
 */
export const ExperimentCreatedEvent = defineEvent({
  meta: {
    key: 'experiment.created',
    version: '1.0.0',
    description: 'An experiment has been created.',
    stability: 'stable',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'experiment', 'create'],
  },
  payload: ExperimentCreatedPayload,
});

/**
 * Emitted when an experiment starts.
 */
export const ExperimentStartedEvent = defineEvent({
  meta: {
    key: 'experiment.started',
    version: '1.0.0',
    description: 'An experiment has started.',
    stability: 'stable',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'experiment', 'start'],
  },
  payload: ExperimentStartedPayload,
});

/**
 * Emitted when an experiment stops.
 */
export const ExperimentStoppedEvent = defineEvent({
  meta: {
    key: 'experiment.stopped',
    version: '1.0.0',
    description: 'An experiment has stopped.',
    stability: 'stable',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'experiment', 'stop'],
  },
  payload: ExperimentStoppedPayload,
});

/**
 * Emitted when a flag is evaluated (for analytics).
 */
export const FlagEvaluatedEvent = defineEvent({
  meta: {
    key: 'flag.evaluated',
    version: '1.0.0',
    description: 'A feature flag has been evaluated.',
    stability: 'stable',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'evaluate'],
  },
  payload: FlagEvaluatedPayload,
});

/**
 * Emitted when a subject is assigned to an experiment variant.
 */
export const VariantAssignedEvent = defineEvent({
  meta: {
    key: 'experiment.variant_assigned',
    version: '1.0.0',
    description: 'A subject has been assigned to an experiment variant.',
    stability: 'stable',
    owners: ['@platform.feature-flags'],
    tags: ['feature-flags', 'experiment', 'variant'],
  },
  payload: VariantAssignedPayload,
});

/**
 * All feature flag events.
 */
export const FeatureFlagEvents = {
  FlagCreatedEvent,
  FlagUpdatedEvent,
  FlagDeletedEvent,
  FlagToggledEvent,
  RuleCreatedEvent,
  RuleDeletedEvent,
  ExperimentCreatedEvent,
  ExperimentStartedEvent,
  ExperimentStoppedEvent,
  FlagEvaluatedEvent,
  VariantAssignedEvent,
};


