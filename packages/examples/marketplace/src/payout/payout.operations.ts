import { defineQuery } from '@lssm/lib.contracts/operations';
import { ListPayoutsInputModel, ListPayoutsOutputModel } from './payout.schema';

const OWNERS = ['@example.marketplace'] as const;

/**
 * List payouts for a store.
 */
export const ListPayoutsContract = defineQuery({
  meta: {
    key: 'marketplace.payout.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'payout', 'list'],
    description: 'List payouts for a store.',
    goal: 'View payout history.',
    context: 'Seller dashboard.',
  },
  io: { input: ListPayoutsInputModel, output: ListPayoutsOutputModel },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'list-payouts-happy-path',
        given: ['Store has payout history'],
        when: ['Seller lists payouts'],
        then: ['List of payouts is returned'],
      },
    ],
    examples: [
      {
        key: 'list-recent',
        input: { limit: 10, offset: 0 },
        output: { items: [], total: 5, hasMore: false },
      },
    ],
  },
});
