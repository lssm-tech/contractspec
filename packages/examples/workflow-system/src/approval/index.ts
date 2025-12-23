/**
 * Approval domain - Approval request and decision management.
 */

// Enums
export { ApprovalStatusEnum, ApprovalDecisionEnum } from './approval.enum';

// Schema models
export { ApprovalRequestModel, ApprovalCommentModel } from './approval.schema';

// Contracts
export {
  SubmitDecisionContract,
  DelegateApprovalContract,
  AddApprovalCommentContract,
  ListMyApprovalsContract,
  GetApprovalContract,
} from './approval.contracts';

// Events
export {
  ApprovalRequestedEvent,
  ApprovalDecidedEvent,
  ApprovalDelegatedEvent,
  ApprovalEscalatedEvent,
} from './approval.event';
