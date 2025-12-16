import { defineQuery } from '@lssm/lib.contracts/spec';
import { ListPayoutsInputModel, ListPayoutsOutputModel } from './payout.schema';

const OWNERS = ['@example.marketplace'] as const;

/**
 * List payouts for a store.
 */
export const ListPayoutsContract = defineQuery({
  meta: {
    name: 'marketplace.payout.list',
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
});


