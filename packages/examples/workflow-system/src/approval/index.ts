/**
 * Approval domain - Approval request and decision management.
 */

// Enums
export { ApprovalDecisionEnum, ApprovalStatusEnum } from './approval.enum';
// Events
export {
	ApprovalDecidedEvent,
	ApprovalDelegatedEvent,
	ApprovalEscalatedEvent,
	ApprovalRequestedEvent,
} from './approval.event';

// Contracts
export {
	AddApprovalCommentContract,
	DelegateApprovalContract,
	GetApprovalContract,
	ListMyApprovalsContract,
	SubmitDecisionContract,
} from './approval.operations';
// Schema models
export { ApprovalCommentModel, ApprovalRequestModel } from './approval.schema';
