import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

// ============ Workflow Definition Event Payloads ============

const WorkflowDefinitionPayload = defineSchemaModel({
  name: 'WorkflowDefinitionEventPayload',
  description: 'Payload for workflow definition events',
  fields: {
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const StepAddedPayload = defineSchemaModel({
  name: 'StepAddedEventPayload',
  description: 'Payload when a step is added',
  fields: {
    stepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    position: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Workflow Instance Event Payloads ============

const InstanceEventPayload = defineSchemaModel({
  name: 'InstanceEventPayload',
  description: 'Base payload for instance events',
  fields: {
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    referenceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    referenceType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    triggeredBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

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

const InstanceCompletedPayload = defineSchemaModel({
  name: 'InstanceCompletedEventPayload',
  description: 'Payload when instance completes',
  fields: {
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    outcome: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    referenceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    referenceType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    duration: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Approval Event Payloads ============

const ApprovalRequestedPayload = defineSchemaModel({
  name: 'ApprovalRequestedEventPayload',
  description: 'Payload when approval is requested',
  fields: {
    requestId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    approverId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    approverRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dueAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ApprovalDecidedPayload = defineSchemaModel({
  name: 'ApprovalDecidedEventPayload',
  description: 'Payload when approval decision is made',
  fields: {
    requestId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    decision: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    decidedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    comment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ApprovalDelegatedPayload = defineSchemaModel({
  name: 'ApprovalDelegatedEventPayload',
  description: 'Payload when approval is delegated',
  fields: {
    requestId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fromUserId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toUserId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ApprovalEscalatedPayload = defineSchemaModel({
  name: 'ApprovalEscalatedEventPayload',
  description: 'Payload when approval is escalated',
  fields: {
    requestId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    escalationLevel: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    escalatedTo: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Events ============

// Workflow Definition Events
export const WorkflowCreatedEvent = defineEvent({
  name: 'workflow.definition.created',
  version: 1,
  description: 'A new workflow definition has been created.',
  payload: WorkflowDefinitionPayload,
});

export const WorkflowUpdatedEvent = defineEvent({
  name: 'workflow.definition.updated',
  version: 1,
  description: 'A workflow definition has been updated.',
  payload: WorkflowDefinitionPayload,
});

export const WorkflowPublishedEvent = defineEvent({
  name: 'workflow.definition.published',
  version: 1,
  description: 'A workflow definition has been published and is now active.',
  payload: WorkflowDefinitionPayload,
});

export const StepAddedEvent = defineEvent({
  name: 'workflow.step.added',
  version: 1,
  description: 'A step has been added to a workflow definition.',
  payload: StepAddedPayload,
});

// Workflow Instance Events
export const InstanceStartedEvent = defineEvent({
  name: 'workflow.instance.started',
  version: 1,
  description: 'A new workflow instance has been started.',
  payload: InstanceEventPayload,
});

export const StepEnteredEvent = defineEvent({
  name: 'workflow.step.entered',
  version: 1,
  description: 'A workflow instance has entered a new step.',
  payload: StepTransitionPayload,
});

export const StepExitedEvent = defineEvent({
  name: 'workflow.step.exited',
  version: 1,
  description: 'A workflow instance has exited a step.',
  payload: StepTransitionPayload,
});

export const InstanceCompletedEvent = defineEvent({
  name: 'workflow.instance.completed',
  version: 1,
  description: 'A workflow instance has completed.',
  payload: InstanceCompletedPayload,
});

export const InstanceCancelledEvent = defineEvent({
  name: 'workflow.instance.cancelled',
  version: 1,
  description: 'A workflow instance has been cancelled.',
  payload: InstanceEventPayload,
});

export const InstancePausedEvent = defineEvent({
  name: 'workflow.instance.paused',
  version: 1,
  description: 'A workflow instance has been paused.',
  payload: InstanceEventPayload,
});

export const InstanceResumedEvent = defineEvent({
  name: 'workflow.instance.resumed',
  version: 1,
  description: 'A workflow instance has been resumed.',
  payload: InstanceEventPayload,
});

export const InstanceFailedEvent = defineEvent({
  name: 'workflow.instance.failed',
  version: 1,
  description: 'A workflow instance has failed.',
  payload: InstanceEventPayload,
});

export const InstanceTimedOutEvent = defineEvent({
  name: 'workflow.instance.timeout',
  version: 1,
  description: 'A workflow instance has timed out.',
  payload: InstanceEventPayload,
});

// Approval Events
export const ApprovalRequestedEvent = defineEvent({
  name: 'workflow.approval.requested',
  version: 1,
  description: 'An approval has been requested.',
  payload: ApprovalRequestedPayload,
});

export const ApprovalDecidedEvent = defineEvent({
  name: 'workflow.approval.decided',
  version: 1,
  description: 'An approval decision has been made.',
  payload: ApprovalDecidedPayload,
});

export const ApprovalDelegatedEvent = defineEvent({
  name: 'workflow.approval.delegated',
  version: 1,
  description: 'An approval has been delegated.',
  payload: ApprovalDelegatedPayload,
});

export const ApprovalEscalatedEvent = defineEvent({
  name: 'workflow.approval.escalated',
  version: 1,
  description: 'An approval has been escalated.',
  payload: ApprovalEscalatedPayload,
});

// ============ All Events ============

export const WorkflowSystemEvents = {
  // Definition events
  WorkflowCreatedEvent,
  WorkflowUpdatedEvent,
  WorkflowPublishedEvent,
  StepAddedEvent,

  // Instance events
  InstanceStartedEvent,
  StepEnteredEvent,
  StepExitedEvent,
  InstanceCompletedEvent,
  InstanceCancelledEvent,
  InstancePausedEvent,
  InstanceResumedEvent,
  InstanceFailedEvent,
  InstanceTimedOutEvent,

  // Approval events
  ApprovalRequestedEvent,
  ApprovalDecidedEvent,
  ApprovalDelegatedEvent,
  ApprovalEscalatedEvent,
};


