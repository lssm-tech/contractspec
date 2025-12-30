import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { ApprovalStatusEnum, ApprovalDecisionEnum } from './approval.enum';

/**
 * An approval request.
 */
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
    approverRole: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ApprovalStatusEnum, isOptional: false },
    decision: { type: ApprovalDecisionEnum, isOptional: true },
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

/**
 * A comment on an approval.
 */
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
