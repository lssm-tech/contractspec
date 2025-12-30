import {
  defineCommand,
  defineQuery,
} from '@contractspec/lib.contracts/operations';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { ApprovalDecisionEnum, ApprovalStatusEnum } from './approval.enum';
import { ApprovalCommentModel, ApprovalRequestModel } from './approval.schema';

const OWNERS = ['@example.workflow-system'] as const;

/**
 * Approve or reject an approval request.
 */
export const SubmitDecisionContract = defineCommand({
  meta: {
    key: 'workflow.approval.decide',
    version: '1.0.0',
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
        version: '1.0.0',
        when: 'Decision is made',
        payload: ApprovalRequestModel,
      },
    ],
    audit: ['workflow.approval.decided'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'approve-request-happy-path',
        given: ['Approval request is pending', 'User is assignee'],
        when: ['User approves request'],
        then: ['Request is approved', 'ApprovalDecided event is emitted'],
      },
    ],
    examples: [
      {
        key: 'approve-basic',
        input: {
          requestId: 'req-123',
          decision: 'approve',
          comment: 'Looks good',
        },
        output: { id: 'req-123', status: 'approved' },
      },
    ],
  },
});

/**
 * Delegate an approval to another user.
 */
export const DelegateApprovalContract = defineCommand({
  meta: {
    key: 'workflow.approval.delegate',
    version: '1.0.0',
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
        version: '1.0.0',
        when: 'Approval is delegated',
        payload: ApprovalRequestModel,
      },
    ],
    audit: ['workflow.approval.delegated'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'delegate-approval-happy-path',
        given: ['Approval request is pending', 'User is assignee'],
        when: ['User delegates to another user'],
        then: ['Assignee is updated', 'ApprovalDelegated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'delegate-to-manager',
        input: {
          requestId: 'req-123',
          delegateTo: 'user-456',
          reason: 'Out of office',
        },
        output: { id: 'req-123', assigneeId: 'user-456' },
      },
    ],
  },
});

/**
 * Add a comment to an approval request.
 */
export const AddApprovalCommentContract = defineCommand({
  meta: {
    key: 'workflow.approval.comment.add',
    version: '1.0.0',
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
        version: '1.0.0',
        when: 'Comment is added',
        payload: ApprovalCommentModel,
      },
    ],
  },
  acceptance: {
    scenarios: [
      {
        key: 'add-comment-happy-path',
        given: ['Approval request exists'],
        when: ['User adds a comment'],
        then: ['Comment is added', 'CommentAdded event is emitted'],
      },
    ],
    examples: [
      {
        key: 'add-question',
        input: {
          requestId: 'req-123',
          content: 'Can you clarify budget?',
          isInternal: false,
        },
        output: { id: 'com-789', content: 'Can you clarify budget?' },
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
    version: '1.0.0',
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
  acceptance: {
    scenarios: [
      {
        key: 'list-approvals-happy-path',
        given: ['User has assigned approvals'],
        when: ['User lists approvals'],
        then: ['List of requests is returned'],
      },
    ],
    examples: [
      {
        key: 'list-pending',
        input: { status: 'pending', limit: 10 },
        output: { requests: [], total: 2, pendingCount: 2 },
      },
    ],
  },
});

/**
 * Get a single approval request.
 */
export const GetApprovalContract = defineQuery({
  meta: {
    key: 'workflow.approval.get',
    version: '1.0.0',
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
  acceptance: {
    scenarios: [
      {
        key: 'get-approval-happy-path',
        given: ['Approval request exists'],
        when: ['User requests approval details'],
        then: ['Approval details are returned'],
      },
    ],
    examples: [
      {
        key: 'get-basic',
        input: { requestId: 'req-123' },
        output: { id: 'req-123', status: 'pending' },
      },
    ],
  },
});
