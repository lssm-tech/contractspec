import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const serviceBusinessDocBlocks: DocBlock[] = [
  {
    id: 'docs.examples.service-business-os',
    title: 'Service Business OS',
    summary:
      'Field/service business flow from client intake to quote, job scheduling, invoicing, and payments with notifications and audit trail.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/service-business-os',
    tags: ['services', 'quotes', 'jobs', 'invoices', 'payments'],
    body: `## Flows

1) **Client intake** → create client, capture contact + owner.
2) **Quote** → draft, send, accept/reject (events + notifications).
3) **Job** → schedule, assign technician, complete with notes and attachments.
4) **Invoice** → issue after completion, track status.
5) **Payment** → record payment and emit analytics/audit.

## Modules reused
- Identity/RBAC for org + roles
- Files for attachments (proposals, receipts)
- Notifications for quote sent/accepted, job reminders, overdue invoices
- Jobs for reminder/schedule tasks
- Audit trail for all lifecycle changes

## Presentations
- Dashboard, client list, quote list/detail, job board, invoice list, payment list (React + Markdown targets).
`,
  },
];

registerDocBlocks(serviceBusinessDocBlocks);
