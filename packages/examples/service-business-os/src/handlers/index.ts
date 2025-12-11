/**
 * Placeholder handlers for Service Business OS.
 * Implementations would persist to DB and integrate with Files, Notifications, and Jobs.
 */
import type {
  AcceptQuoteContract,
  CreateClientContract,
  CreateQuoteContract,
  ScheduleJobContract,
  CompleteJobContract,
  IssueInvoiceContract,
  RecordPaymentContract,
  ListJobsContract,
} from '../contracts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function registerServiceBusinessHandlers() {
  // Wire contract names to runtime handlers in the host app.
  // Example:
  // registry.command(CreateQuoteContract.meta.name, handleCreateQuote);
}

export type ServiceBusinessHandlers =
  | typeof AcceptQuoteContract
  | typeof CreateClientContract
  | typeof CreateQuoteContract
  | typeof ScheduleJobContract
  | typeof CompleteJobContract
  | typeof IssueInvoiceContract
  | typeof RecordPaymentContract
  | typeof ListJobsContract;
