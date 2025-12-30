import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

const marketplaceDocBlocks: DocBlock[] = [
  {
    id: 'docs.examples.marketplace',
    title: 'Marketplace (2-sided)',
    summary:
      'Two-sided marketplace with stores, products, orders, payouts, and reviews. Demonstrates multi-actor flows, payments, and attachments.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/marketplace',
    tags: ['marketplace', 'orders', 'payouts', 'reviews'],
    body: `## Entities

- Store, Product, Order, OrderItem, Payout, Review.
- Uses Files module for product media and receipt attachments.

## Contracts

- \`marketplace.store.create\`, \`marketplace.product.add\`, \`marketplace.order.place\`, \`marketplace.payout.process\`, \`marketplace.review.submit\`.
- Policy guards via Identity/RBAC for provider vs client actions.

## Events

- order.created/completed/cancelled, payout.queued/completed, review.submitted.
- Hooked into Notifications and Audit Trail modules.

## UI / Presentations

- Dashboard, product catalog, order list/detail, store management.
- Templates registered under \`marketplace\` in Studio Template Registry.

## Notes

- Commission model encoded in spec; payouts scheduled via Jobs module.
- Feature flags can gate beta checkout or new reviews flow.
`,
  },
  {
    id: 'docs.examples.marketplace.goal',
    title: 'Marketplace — Goal',
    summary:
      'Why this marketplace template exists and the outcomes it targets.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/marketplace/goal',
    tags: ['marketplace', 'goal'],
    body: `## Why it matters
- Provides a regenerable 2-sided marketplace baseline without bespoke glue.
- Keeps payouts, catalog, orders, and reviews consistent across surfaces.

## Business/Product goal
- Safe provider/client flows with auditable payouts and moderation-ready reviews.
- Staged rollouts for payments/reviews via feature flags; explicit commission/tax fields.

## Success criteria
- Orders/payouts regenerate cleanly after spec changes.
- Events emit for lifecycle + audit; PII is scoped/redacted in presentations.`,
  },
  {
    id: 'docs.examples.marketplace.usage',
    title: 'Marketplace — Usage',
    summary: 'How to seed, extend, and safely regenerate the marketplace.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/marketplace/usage',
    tags: ['marketplace', 'usage'],
    body: `## Setup
1) Seed sample stores/products/orders via template registry (or create via UI).
2) Configure Files storage for media/receipts; set policy.pii for sensitive fields.

## Extend & regenerate
1) Adjust schemas for commission/tax/payout states or review moderation in the spec.
2) Regenerate to sync UI, API, events, notifications.
3) Gate risky changes (new payment providers) behind Feature Flags.

## Guardrails
- Emit events for order/payout state changes; log via Audit Trail.
- Avoid hidden commission math—keep explicit fields.
- Redact buyer/provider PII in markdown/JSON presentations.`,
  },
  {
    id: 'docs.examples.marketplace.constraints',
    title: 'Marketplace — Constraints & Safety',
    summary:
      'Internal guardrails for payouts, order states, and regeneration semantics.',
    kind: 'reference',
    visibility: 'internal',
    route: '/docs/examples/marketplace/constraints',
    tags: ['marketplace', 'constraints', 'internal'],
    body: `## Constraints
- Commission logic and order states must stay spec-defined; never adjust in code-only patches.
- Events to emit: order.created, order.completed, payout.queued, review.posted (minimum).
- Regeneration must not change payment semantics without explicit spec diff.

## Safety & PII
- Redact buyer/provider identifiers in markdown/JSON outputs; scope payouts per tenant/org.
- For MCP/web surfaces, avoid exposing raw payout calc inputs; use summaries.

## Testing/Verification
- Add fixtures covering order lifecycle and payout queueing.
- Run regeneration diff when changing commission/tax fields; verify presentations updated.
- Ensure Notifications/Audit wiring remains intact for order/payout/review events.`,
  },
];

registerDocBlocks(marketplaceDocBlocks);
