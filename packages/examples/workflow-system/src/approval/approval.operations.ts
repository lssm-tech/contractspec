import { defineCommand, defineQuery } from '@lssm/lib.contracts/operations';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { ApprovalDecisionEnum, ApprovalStatusEnum } from './approval.enum';
import { ApprovalCommentModel, ApprovalRequestModel } from './approval.schema';

const OWNERS = ['@example.workflow-system'] as const;

/**
 * Approve or reject an approval request.
 */
export const SubmitDecisionContract = defineCommand({
  meta: {
    key: 'workflow.approval.decide',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'approval', 'decision'],
    description: 'Submit an approval decision (approve/reject).',
    goal: 'Allow approvers to make decisions on requests.',
    context: 'Approval inbox, workflow detail.',
  },
  io: {
    input: defineSchemaModel({
      name: 'ApproveRejectInput',
      fields: {
        requestId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
        decision: { type: ApprovalDecisionEnum, isOptional: false },
        comment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
        data: { type: ScalarTypeEnum.JSON(), isOptional: true },
      },
    }),
    output: ApprovalRequestModel,
  },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'workflow.approval.decided',
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
    key: 'workflow.approval.delegate',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'approval', 'delegate'],
    description: 'Delegate an approval request to another user.',
    goal: 'Allow approvers to pass approval to others.',
    context: 'Approval inbox.',
  },
  io: {
    input: defineSchemaModel({
      name: 'DelegateInput',
      fields: {
        requestId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
        delegateTo: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
        reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
      },
    }),
    output: ApprovalRequestModel,
  },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'workflow.approval.delegated',
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
    key: 'workflow.approval.comment.add',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'approval', 'comment'],
    description: 'Add a comment to an approval request.',
    goal: 'Allow discussion on approval requests.',
    context: 'Approval detail view.',
  },
  io: {
    input: defineSchemaModel({
      name: 'AddCommentInput',
      fields: {
        requestId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
        content: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
        isInternal: { type: ScalarTypeEnum.Boolean(), isOptional: true },
      },
    }),
    output: ApprovalCommentModel,
  },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'workflow.approval.comment.added',
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
    key: 'workflow.approval.list.mine',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'approval', 'list', 'inbox'],
    description: 'List approval requests assigned to current user.',
    goal: 'Show pending approvals in user inbox.',
    context: 'Approval inbox, dashboard widget.',
  },
  io: {
    input: defineSchemaModel({
      name: 'ListMyApprovalsInput',
      fields: {
        status: { type: ApprovalStatusEnum, isOptional: true },
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
    }),
    output: defineSchemaModel({
      name: 'ListMyApprovalsOutput',
      fields: {
        requests: {
          type: ApprovalRequestModel,
          isArray: true,
          isOptional: false,
        },
        total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
        pendingCount: {
          type: ScalarTypeEnum.Int_unsecure(),
          isOptional: false,
        },
      },
    }),
  },
  policy: { auth: 'user' },
});

/**
 * Get a single approval request.
 */
export const GetApprovalContract = defineQuery({
  meta: {
    key: 'workflow.approval.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['workflow', 'approval', 'get'],
    description: 'Get an approval request with details.',
    goal: 'View approval request details.',
    context: 'Approval detail view.',
  },
  io: {
    input: defineSchemaModel({
      name: 'GetApprovalInput',
      fields: {
        requestId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
      },
    }),
    output: ApprovalRequestModel,
  },
  policy: { auth: 'user' },
});
