import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

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
];

registerDocBlocks(marketplaceDocBlocks);
