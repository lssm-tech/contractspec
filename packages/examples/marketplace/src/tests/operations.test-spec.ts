import { defineTestSpec } from '@contractspec/lib.contracts-spec/tests';

export const ProductListTest = defineTestSpec({
  meta: {
    key: 'marketplace.product.list.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.marketplace'],
    description: 'Test for listing products',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'marketplace.product.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'marketplace.product.list' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'marketplace.product.list' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const OrderCreateTest = defineTestSpec({
  meta: {
    key: 'marketplace.order.create.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.marketplace'],
    description: 'Test for creating order',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'marketplace.order.create', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'marketplace.order.create' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'marketplace.order.create' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const PayoutListTest = defineTestSpec({
  meta: {
    key: 'marketplace.payout.list.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.marketplace'],
    description: 'Test for listing payouts',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'marketplace.payout.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'marketplace.payout.list' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'marketplace.payout.list' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const ReviewListTest = defineTestSpec({
  meta: {
    key: 'marketplace.review.list.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.marketplace'],
    description: 'Test for listing reviews',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'marketplace.review.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'marketplace.review.list' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'marketplace.review.list' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const ReviewCreateTest = defineTestSpec({
  meta: {
    key: 'marketplace.review.create.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.marketplace'],
    description: 'Test for creating review',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'marketplace.review.create', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'marketplace.review.create' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'marketplace.review.create' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
