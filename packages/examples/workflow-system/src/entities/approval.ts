import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';

/**
 * Approval status enum.
 */
export const ApprovalStatusEnum = defineEntityEnum({
  name: 'ApprovalStatus',
  values: [
    'PENDING', // Awaiting decision
    'APPROVED', // Approved
    'REJECTED', // Rejected
    'DELEGATED', // Delegated to another user
    'ESCALATED', // Escalated due to timeout
    'WITHDRAWN', // Request withdrawn
    'EXPIRED', // Request expired
  ] as const,
  schema: 'workflow',
  description: 'Status of an approval request.',
});

/**
 * Approval decision enum.
 */
export const ApprovalDecisionEnum = defineEntityEnum({
  name: 'ApprovalDecision',
  values: [
    'APPROVE',
    'REJECT',
    'REQUEST_CHANGES',
    'DELEGATE',
    'ABSTAIN',
  ] as const,
  schema: 'workflow',
  description: 'Possible approval decisions.',
});

/**
 * ApprovalRequest entity - a request for approval from a user.
 *
 * Created when a workflow reaches an APPROVAL step. Multiple requests
 * may be created depending on the approval mode.
 */
export const ApprovalRequestEntity = defineEntity({
  name: 'ApprovalRequest',
  description: 'A pending approval request for a workflow step.',
  schema: 'workflow',
  map: 'approval_request',
  fields: {
    id: field.id({ description: 'Unique approval request ID' }),

    // Parent
    workflowInstanceId: field.foreignKey(),
    stepExecutionId: field.foreignKey(),

    // Approver
    approverId: field.foreignKey({ description: 'User requested to approve' }),
    approverRole: field.string({
      isOptional: true,
      description: 'Role of the approver',
    }),

    // Request details
    title: field.string({ description: 'Approval request title' }),
    description: field.string({ isOptional: true }),

    // Status
    status: field.enum('ApprovalStatus', { default: 'PENDING' }),

    // Decision
    decision: field.enum('ApprovalDecision', { isOptional: true }),
    decisionComment: field.string({
      isOptional: true,
      description: 'Comment explaining decision',
    }),
    decidedAt: field.dateTime({ isOptional: true }),

    // Delegation
    delegatedTo: field.string({
      isOptional: true,
      description: 'User delegated to',
    }),
    delegationReason: field.string({ isOptional: true }),

    // Escalation
    escalationLevel: field.int({
      default: 0,
      description: 'Current escalation level',
    }),
    escalatedAt: field.dateTime({ isOptional: true }),

    // Deadlines
    dueAt: field.dateTime({
      isOptional: true,
      description: 'When approval is due',
    }),
    reminderSentAt: field.dateTime({ isOptional: true }),

    // Context - data to display for approval
    contextSnapshot: field.json({
      isOptional: true,
      description: 'Snapshot of relevant data for review',
    }),

    // Order (for sequential approvals)
    sequenceOrder: field.int({
      default: 0,
      description: 'Order in approval chain',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    workflowInstance: field.belongsTo(
      'WorkflowInstance',
      ['workflowInstanceId'],
      ['id'],
      { onDelete: 'Cascade' }
    ),
    stepExecution: field.belongsTo(
      'StepExecution',
      ['stepExecutionId'],
      ['id']
    ),
  },
  indexes: [
    index.on(['approverId', 'status']),
    index.on(['workflowInstanceId', 'status']),
    index.on(['stepExecutionId']),
    index.on(['status', 'dueAt']),
    index.on(['createdAt']),
  ],
  enums: [ApprovalStatusEnum, ApprovalDecisionEnum],
});

/**
 * ApprovalComment entity - comments on approval requests.
 */
export const ApprovalCommentEntity = defineEntity({
  name: 'ApprovalComment',
  description: 'A comment on an approval request.',
  schema: 'workflow',
  map: 'approval_comment',
  fields: {
    id: field.id(),

    approvalRequestId: field.foreignKey(),

    // Author
    authorId: field.foreignKey(),

    // Content
    content: field.string({ description: 'Comment text' }),

    // Type
    isInternal: field.boolean({
      default: false,
      description: 'Internal note vs public comment',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    approvalRequest: field.belongsTo(
      'ApprovalRequest',
      ['approvalRequestId'],
      ['id'],
      { onDelete: 'Cascade' }
    ),
  },
  indexes: [index.on(['approvalRequestId', 'createdAt'])],
});

