import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

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
  name: 'flag.created',
  version: 1,
  description: 'A feature flag has been created.',
  payload: FlagCreatedPayload,
});

/**
 * Emitted when a feature flag is updated.
 */
export const FlagUpdatedEvent = defineEvent({
  name: 'flag.updated',
  version: 1,
  description: 'A feature flag has been updated.',
  payload: FlagUpdatedPayload,
});

/**
 * Emitted when a feature flag is deleted.
 */
export const FlagDeletedEvent = defineEvent({
  name: 'flag.deleted',
  version: 1,
  description: 'A feature flag has been deleted.',
  payload: FlagDeletedPayload,
});

/**
 * Emitted when a feature flag status is toggled.
 */
export const FlagToggledEvent = defineEvent({
  name: 'flag.toggled',
  version: 1,
  description: 'A feature flag status has been toggled.',
  payload: FlagToggledPayload,
});

/**
 * Emitted when a targeting rule is created.
 */
export const RuleCreatedEvent = defineEvent({
  name: 'flag.rule_created',
  version: 1,
  description: 'A targeting rule has been created.',
  payload: RuleCreatedPayload,
});

/**
 * Emitted when a targeting rule is deleted.
 */
export const RuleDeletedEvent = defineEvent({
  name: 'flag.rule_deleted',
  version: 1,
  description: 'A targeting rule has been deleted.',
  payload: RuleDeletedPayload,
});

/**
 * Emitted when an experiment is created.
 */
export const ExperimentCreatedEvent = defineEvent({
  name: 'experiment.created',
  version: 1,
  description: 'An experiment has been created.',
  payload: ExperimentCreatedPayload,
});

/**
 * Emitted when an experiment starts.
 */
export const ExperimentStartedEvent = defineEvent({
  name: 'experiment.started',
  version: 1,
  description: 'An experiment has started.',
  payload: ExperimentStartedPayload,
});

/**
 * Emitted when an experiment stops.
 */
export const ExperimentStoppedEvent = defineEvent({
  name: 'experiment.stopped',
  version: 1,
  description: 'An experiment has stopped.',
  payload: ExperimentStoppedPayload,
});

/**
 * Emitted when a flag is evaluated (for analytics).
 */
export const FlagEvaluatedEvent = defineEvent({
  name: 'flag.evaluated',
  version: 1,
  description: 'A feature flag has been evaluated.',
  payload: FlagEvaluatedPayload,
});

/**
 * Emitted when a subject is assigned to an experiment variant.
 */
export const VariantAssignedEvent = defineEvent({
  name: 'experiment.variant_assigned',
  version: 1,
  description: 'A subject has been assigned to an experiment variant.',
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
