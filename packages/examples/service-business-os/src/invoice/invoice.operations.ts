import { defineCommand } from '@contractspec/lib.contracts';
import { InvoiceModel, IssueInvoiceInputModel } from './invoice.schema';

const OWNERS = ['@examples.service-business-os'] as const;

/**
 * Issue an invoice.
 */
export const IssueInvoiceContract = defineCommand({
  meta: {
    key: 'service.invoice.issue',
    version: '1.0.0',
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
  acceptance: {
    scenarios: [
      {
        key: 'issue-invoice-happy-path',
        given: ['Job is complete'],
        when: ['User issues invoice'],
        then: ['Invoice is created and sent'],
      },
    ],
    examples: [
      {
        key: 'issue-standard',
        input: {
          jobId: 'job-123',
          dueDate: '2025-02-01',
          items: [{ description: 'Service', amount: 100 }],
        },
        output: { id: 'inv-456', status: 'issued', total: 100 },
      },
    ],
  },
});
