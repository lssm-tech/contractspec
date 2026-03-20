// Re-exports from domain modules for backward compatibility
export {
	ClientModel,
	CreateClientContract,
	CreateClientInputModel,
} from '../client';
export {
	InvoiceModel,
	IssueInvoiceContract,
	IssueInvoiceInputModel,
} from '../invoice';
export {
	CompleteJobContract,
	CompleteJobInputModel,
	JobModel,
	ScheduleJobContract,
	ScheduleJobInputModel,
} from '../job';
export {
	PaymentModel,
	RecordPaymentContract,
	RecordPaymentInputModel,
} from '../payment';
export {
	AcceptQuoteContract,
	AcceptQuoteInputModel,
	CreateQuoteContract,
	CreateQuoteInputModel,
	QuoteModel,
} from '../quote';
