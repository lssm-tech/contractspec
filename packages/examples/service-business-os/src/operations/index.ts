// Re-exports from domain modules for backward compatibility
export {
  ClientModel,
  CreateClientInputModel,
  CreateClientContract,
} from '../client';
export {
  QuoteModel,
  CreateQuoteInputModel,
  AcceptQuoteInputModel,
  CreateQuoteContract,
  AcceptQuoteContract,
} from '../quote';
export {
  JobModel,
  ScheduleJobInputModel,
  CompleteJobInputModel,
  ScheduleJobContract,
  CompleteJobContract,
} from '../job';
export {
  InvoiceModel,
  IssueInvoiceInputModel,
  IssueInvoiceContract,
} from '../invoice';
export {
  PaymentModel,
  RecordPaymentInputModel,
  RecordPaymentContract,
} from '../payment';
