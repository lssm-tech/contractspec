import { defineCommand } from '@lssm/lib.contracts';
import { InvoiceModel, IssueInvoiceInputModel } from './invoice.schema';

const OWNERS = ['@examples.service-business-os'] as const;

/**
 * Issue an invoice.
 */
export const IssueInvoiceContract = defineCommand({
  meta: {
    key: 'service.invoice.issue',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-business-os', 'invoice', 'issue'],
    description: 'Issue an invoice for a job.',
    goal: 'Bill clients.',
    context: 'Billing.',
  },
  io: {
    input: IssueInvoiceInputModel,
    output: InvoiceModel,
  },
  policy: { auth: 'user' },
});
