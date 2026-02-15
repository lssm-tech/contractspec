import { defineEvent } from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';

/**
 * Payload when approval is requested.
 */
const ApprovalRequestedPayload = defineSchemaModel({
  name: 'ApprovalRequestedEventPayload',
  description: 'Payload when approval is requested',
  fields: {
    requestId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    approverId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    approverRole: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dueAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Payload when approval decision is made.
 */
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

/**
 * Payload when approval is delegated.
 */
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

/**
 * Payload when approval is escalated.
 */
const ApprovalEscalatedPayload = defineSchemaModel({
  name: 'ApprovalEscalatedEventPayload',
  description: 'Payload when approval is escalated',
  fields: {
    requestId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    instanceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    escalationLevel: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    escalatedTo: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * ApprovalRequestedEvent - An approval has been requested.
 */
export const ApprovalRequestedEvent = defineEvent({
  meta: {
    key: 'workflow.approval.requested',
    version: '1.0.0',
    description: 'An approval has been requested.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'requested'],
  },
  payload: ApprovalRequestedPayload,
});

/**
 * ApprovalDecidedEvent - An approval decision has been made.
 */
export const ApprovalDecidedEvent = defineEvent({
  meta: {
    key: 'workflow.approval.decided',
    version: '1.0.0',
    description: 'An approval decision has been made.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'decided'],
  },
  payload: ApprovalDecidedPayload,
});

/**
 * ApprovalDelegatedEvent - An approval has been delegated.
 */
export const ApprovalDelegatedEvent = defineEvent({
  meta: {
    key: 'workflow.approval.delegated',
    version: '1.0.0',
    description: 'An approval has been delegated.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'delegated'],
  },
  payload: ApprovalDelegatedPayload,
});

/**
 * ApprovalEscalatedEvent - An approval has been escalated.
 */
export const ApprovalEscalatedEvent = defineEvent({
  meta: {
    key: 'workflow.approval.escalated',
    version: '1.0.0',
    description: 'An approval has been escalated.',
    stability: 'stable',
    owners: ['@workflow-team'],
    tags: ['workflow', 'approval', 'escalated'],
  },
  payload: ApprovalEscalatedPayload,
});
