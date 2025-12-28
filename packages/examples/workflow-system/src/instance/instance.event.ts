import { defineEvent, defineSchemaModel } from '@contractspec/lib.contracts';
import { ScalarTypeEnum } from '@contractspec/lib.schema';

/**
 * Base payload for instance events.
 */
const InstanceEventPayload = defineSchemaModel({
  name: 'InstanceEventPayload',
  description: 'Base payload for instance events',
  fields: {
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    referenceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    referenceType: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    triggeredBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Payload for step transition events.
 */
const StepTransitionPayload = defineSchemaModel({
  name: 'StepTransitionEventPayload',
  description: 'Payload for step transition events',
  fields: {
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fromStepKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    toStepKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    action: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    executedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Payload when instance completes.
 */
const InstanceCompletedPayload = defineSchemaModel({
  name: 'InstanceCompletedEventPayload',
  description: 'Payload when instance completes',
  fields: {
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    outcome: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    referenceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    referenceType: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    duration: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * InstanceStartedEvent - A new workflow instance has been started.
 */
export const InstanceStartedEvent = defineEvent({
  meta: {
    key: 'workflow.instance.started',
    version: 1,
    description: 'A new workflow instance has been started.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'instance', 'started'],
  },
  payload: InstanceEventPayload,
});

/**
 * StepEnteredEvent - A workflow instance has entered a new step.
 */
export const StepEnteredEvent = defineEvent({
  meta: {
    key: 'workflow.step.entered',
    version: 1,
    description: 'A workflow instance has entered a new step.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'step', 'entered'],
  },
  payload: StepTransitionPayload,
});

/**
 * StepExitedEvent - A workflow instance has exited a step.
 */
export const StepExitedEvent = defineEvent({
  meta: {
    key: 'workflow.step.exited',
    version: 1,
    description: 'A workflow instance has exited a step.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'step', 'exited'],
  },
  payload: StepTransitionPayload,
});

/**
 * InstanceCompletedEvent - A workflow instance has completed.
 */
export const InstanceCompletedEvent = defineEvent({
  meta: {
    key: 'workflow.instance.completed',
    version: 1,
    description: 'A workflow instance has completed.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'instance', 'completed'],
  },
  payload: InstanceCompletedPayload,
});

/**
 * InstanceCancelledEvent - A workflow instance has been cancelled.
 */
export const InstanceCancelledEvent = defineEvent({
  meta: {
    key: 'workflow.instance.cancelled',
    version: 1,
    description: 'A workflow instance has been cancelled.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'instance', 'cancelled'],
  },
  payload: InstanceEventPayload,
});

/**
 * InstancePausedEvent - A workflow instance has been paused.
 */
export const InstancePausedEvent = defineEvent({
  meta: {
    key: 'workflow.instance.paused',
    version: 1,
    description: 'A workflow instance has been paused.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'instance', 'paused'],
  },
  payload: InstanceEventPayload,
});

/**
 * InstanceResumedEvent - A workflow instance has been resumed.
 */
export const InstanceResumedEvent = defineEvent({
  meta: {
    key: 'workflow.instance.resumed',
    version: 1,
    description: 'A workflow instance has been resumed.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'instance', 'resumed'],
  },
  payload: InstanceEventPayload,
});

/**
 * InstanceFailedEvent - A workflow instance has failed.
 */
export const InstanceFailedEvent = defineEvent({
  meta: {
    key: 'workflow.instance.failed',
    version: 1,
    description: 'A workflow instance has failed.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'instance', 'failed'],
  },
  payload: InstanceEventPayload,
});

/**
 * InstanceTimedOutEvent - A workflow instance has timed out.
 */
export const InstanceTimedOutEvent = defineEvent({
  meta: {
    key: 'workflow.instance.timedOut',
    version: 1,
    description: 'A workflow instance has timed out.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'instance', 'timeout'],
  },
  payload: InstanceEventPayload,
});
