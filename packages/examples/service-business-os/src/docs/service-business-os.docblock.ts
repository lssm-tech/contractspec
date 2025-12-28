import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

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
  {
    id: 'docs.examples.service-business-os.goal',
    title: 'Service Business OS — Goal',
    summary: 'Why this field-service OS exists and outcomes it targets.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/service-business-os/goal',
    tags: ['services', 'goal'],
    body: `## Why it matters
- Provides a regenerable, end-to-end service lifecycle (client → quote → job → invoice → payment).
- Keeps pricing, scheduling, invoicing, and payments consistent across surfaces.

## Business/Product goal
- Deliver auditable quotes/jobs/invoices with notifications and reminders.
- Support attachments and PII-safe flows; stage new payment rules via feature flags.

## Success criteria
- Spec changes regenerate UI/API/events cleanly across lifecycle steps.
- Audit/Notifications/Jobs remain wired for every mutation.`,
  },
  {
    id: 'docs.examples.service-business-os.usage',
    title: 'Service Business OS — Usage',
    summary: 'How to operate, extend, and regenerate the service OS safely.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/service-business-os/usage',
    tags: ['services', 'usage'],
    body: `## Setup
1) Seed (if provided) or create client → quote → job → invoice → payment via UI.
2) Configure Files for attachments and Notifications for quote/job/invoice events.

## Extend & regenerate
1) Adjust schemas: quote line items, job statuses, invoice terms, payment methods.
2) Regenerate to sync UI/API/events; mark PII paths in policy.
3) Use Feature Flags to trial new payment rules or reminder cadences.

## Guardrails
- Emit events for quote accepted/rejected, job scheduled/completed, invoice overdue, payment recorded.
- Keep pricing/tax rules explicit in spec; avoid implicit handler math.
- Use Audit Trail for lifecycle mutations; schedule reminders via Jobs.`,
  },
  {
    id: 'docs.examples.service-business-os.constraints',
    title: 'Service Business OS — Constraints & Safety',
    summary:
      'Internal guardrails for quotes/jobs/invoices/payments and regeneration safety.',
    kind: 'reference',
    visibility: 'internal',
    route: '/docs/examples/service-business-os/constraints',
    tags: ['services', 'constraints', 'internal'],
    body: `## Constraints
- Commission/tax/payment rules must be explicit in spec; no hidden handler math.
- Events to emit: quote.sent/accepted/rejected, job.scheduled/completed, invoice.issued/overdue, payment.recorded.
- Regeneration must not alter payment semantics without reviewed spec changes.

## PII & Attachments
- Mark PII paths (client contact, address); redact in markdown/JSON.
- Files (quotes, receipts) should use presigned URLs with scoped access.

## Verification
- Add fixtures for quote/job/invoice state transitions.
- Ensure Notifications/Audit/Jobs wiring persists after regeneration.
- Use Feature Flags to trial new payment rules/reminder cadences; default safe/off.`,
  },
];

registerDocBlocks(serviceBusinessDocBlocks);
