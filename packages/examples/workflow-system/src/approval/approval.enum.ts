import { defineEnum } from '@lssm/lib.schema';

/**
 * Approval status enum.
 */
export const ApprovalStatusEnum = defineEnum('ApprovalStatus', [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'DELEGATED',
  'ESCALATED',
  'WITHDRAWN',
  'EXPIRED',
]);

/**
 * Approval decision enum.
 */
export const ApprovalDecisionEnum = defineEnum('ApprovalDecision', [
  'APPROVE',
  'REJECT',
  'REQUEST_CHANGES',
  'DELEGATE',
  'ABSTAIN',
]);


