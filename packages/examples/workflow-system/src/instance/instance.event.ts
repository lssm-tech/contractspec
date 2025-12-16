import { defineEvent, defineSchemaModel } from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';

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
  name: 'workflow.instance.started',
  version: 1,
  description: 'A new workflow instance has been started.',
  payload: InstanceEventPayload,
});

/**
 * StepEnteredEvent - A workflow instance has entered a new step.
 */
export const StepEnteredEvent = defineEvent({
  name: 'workflow.step.entered',
  version: 1,
  description: 'A workflow instance has entered a new step.',
  payload: StepTransitionPayload,
});

/**
 * StepExitedEvent - A workflow instance has exited a step.
 */
export const StepExitedEvent = defineEvent({
  name: 'workflow.step.exited',
  version: 1,
  description: 'A workflow instance has exited a step.',
  payload: StepTransitionPayload,
});

/**
 * InstanceCompletedEvent - A workflow instance has completed.
 */
export const InstanceCompletedEvent = defineEvent({
  name: 'workflow.instance.completed',
  version: 1,
  description: 'A workflow instance has completed.',
  payload: InstanceCompletedPayload,
});

/**
 * InstanceCancelledEvent - A workflow instance has been cancelled.
 */
export const InstanceCancelledEvent = defineEvent({
  name: 'workflow.instance.cancelled',
  version: 1,
  description: 'A workflow instance has been cancelled.',
  payload: InstanceEventPayload,
});

/**
 * InstancePausedEvent - A workflow instance has been paused.
 */
export const InstancePausedEvent = defineEvent({
  name: 'workflow.instance.paused',
  version: 1,
  description: 'A workflow instance has been paused.',
  payload: InstanceEventPayload,
});

/**
 * InstanceResumedEvent - A workflow instance has been resumed.
 */
export const InstanceResumedEvent = defineEvent({
  name: 'workflow.instance.resumed',
  version: 1,
  description: 'A workflow instance has been resumed.',
  payload: InstanceEventPayload,
});

/**
 * InstanceFailedEvent - A workflow instance has failed.
 */
export const InstanceFailedEvent = defineEvent({
  name: 'workflow.instance.failed',
  version: 1,
  description: 'A workflow instance has failed.',
  payload: InstanceEventPayload,
});

/**
 * InstanceTimedOutEvent - A workflow instance has timed out.
 */
export const InstanceTimedOutEvent = defineEvent({
  name: 'workflow.instance.timeout',
  version: 1,
  description: 'A workflow instance has timed out.',
  payload: InstanceEventPayload,
});


