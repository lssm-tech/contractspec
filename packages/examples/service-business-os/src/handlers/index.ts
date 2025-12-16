/**
 * Placeholder handlers for Service Business OS.
 * Implementations would persist to DB and integrate with Files, Notifications, and Jobs.
 */
import type { CreateClientContract } from '../client';
import type { CreateQuoteContract, AcceptQuoteContract } from '../quote';
import type { ScheduleJobContract, CompleteJobContract } from '../job';
import type { IssueInvoiceContract } from '../invoice';
import type { RecordPaymentContract } from '../payment';

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
  | typeof RecordPaymentContract;
