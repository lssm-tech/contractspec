import { defineCommand, defineQuery } from '@lssm/lib.contracts/spec';
import {
  defineSchemaModel,
  ScalarTypeEnum,
  defineEnum,
} from '@lssm/lib.schema';

const OWNERS = ['example.workflow-system'] as const;

// ============ Enums ============

const ApprovalStatusSchemaEnum = defineEnum('ApprovalStatus', [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'DELEGATED',
  'ESCALATED',
  'WITHDRAWN',
  'EXPIRED',
]);
const ApprovalDecisionSchemaEnum = defineEnum('ApprovalDecision', [
  'APPROVE',
  'REJECT',
  'REQUEST_CHANGES',
  'DELEGATE',
  'ABSTAIN',
]);

// ============ Schemas ============

export const ApprovalRequestModel = defineSchemaModel({
  name: 'ApprovalRequestModel',
  description: 'An approval request',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    workflowInstanceId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    stepExecutionId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    approverId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    approverRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ApprovalStatusSchemaEnum, isOptional: false },
    decision: { type: ApprovalDecisionSchemaEnum, isOptional: true },
    decisionComment: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    decidedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    dueAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    contextSnapshot: { type: ScalarTypeEnum.JSON(), isOptional: true },
    sequenceOrder: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ApproveRejectInputModel = defineSchemaModel({
  name: 'ApproveRejectInput',
  description: 'Input for approving or rejecting a request',
  fields: {
    requestId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    decision: { type: ApprovalDecisionSchemaEnum, isOptional: false },
    comment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    data: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

export const DelegateInputModel = defineSchemaModel({
  name: 'DelegateInput',
  description: 'Input for delegating an approval',
  fields: {
    requestId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    delegateTo: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const AddCommentInputModel = defineSchemaModel({
  name: 'AddCommentInput',
  description: 'Input for adding a comment to an approval',
  fields: {
    requestId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    content: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    isInternal: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

export const ApprovalCommentModel = defineSchemaModel({
  name: 'ApprovalCommentModel',
  description: 'A comment on an approval',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    approvalRequestId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    authorId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    isInternal: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ListMyApprovalsInputModel = defineSchemaModel({
  name: 'ListMyApprovalsInput',
  description: 'Input for listing approvals assigned to current user',
  fields: {
    status: { type: ApprovalStatusSchemaEnum, isOptional: true },
    limit: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 20,
    },
    offset: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 0,
    },
  },
});

export const ListMyApprovalsOutputModel = defineSchemaModel({
  name: 'ListMyApprovalsOutput',
  description: 'Output for listing approvals',
  fields: {
    requests: { type: ApprovalRequestModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    pendingCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * Approve or reject an approval request.
 */
export const SubmitDecisionContract = defineCommand({
  meta: {
    name: 'workflow.approval.decide',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'approval', 'decision'],
    description: 'Submit an approval decision (approve/reject).',
    goal: 'Allow approvers to make decisions on requests.',
    context: 'Approval inbox, workflow detail.',
  },
  io: {
    input: ApproveRejectInputModel,
    output: ApprovalRequestModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.approval.decided',
        version: 1,
        when: 'Decision is made',
        payload: ApprovalRequestModel,
      },
    ],
    audit: ['workflow.approval.decided'],
  },
});

/**
 * Delegate an approval to another user.
 */
export const DelegateApprovalContract = defineCommand({
  meta: {
    name: 'workflow.approval.delegate',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'approval', 'delegate'],
    description: 'Delegate an approval request to another user.',
    goal: 'Allow approvers to pass approval to others.',
    context: 'Approval inbox.',
  },
  io: {
    input: DelegateInputModel,
    output: ApprovalRequestModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.approval.delegated',
        version: 1,
        when: 'Approval is delegated',
        payload: ApprovalRequestModel,
      },
    ],
    audit: ['workflow.approval.delegated'],
  },
});

/**
 * Add a comment to an approval request.
 */
export const AddApprovalCommentContract = defineCommand({
  meta: {
    name: 'workflow.approval.comment.add',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'approval', 'comment'],
    description: 'Add a comment to an approval request.',
    goal: 'Allow discussion on approval requests.',
    context: 'Approval detail view.',
  },
  io: {
    input: AddCommentInputModel,
    output: ApprovalCommentModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'workflow.approval.comment.added',
        version: 1,
        when: 'Comment is added',
        payload: ApprovalCommentModel,
      },
    ],
  },
});

/**
 * List approvals assigned to the current user.
 */
export const ListMyApprovalsContract = defineQuery({
  meta: {
    name: 'workflow.approval.list.mine',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'approval', 'list', 'inbox'],
    description: 'List approval requests assigned to current user.',
    goal: 'Show pending approvals in user inbox.',
    context: 'Approval inbox, dashboard widget.',
  },
  io: {
    input: ListMyApprovalsInputModel,
    output: ListMyApprovalsOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Get a single approval request.
 */
export const GetApprovalInputModel = defineSchemaModel({
  name: 'GetApprovalInput',
  fields: {
    requestId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const GetApprovalContract = defineQuery({
  meta: {
    name: 'workflow.approval.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'approval', 'get'],
    description: 'Get an approval request with details.',
    goal: 'View approval request details.',
    context: 'Approval detail view.',
  },
  io: {
    input: GetApprovalInputModel,
    output: ApprovalRequestModel,
  },
  policy: {
    auth: 'user',
  },
});
