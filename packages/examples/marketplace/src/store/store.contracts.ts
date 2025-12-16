import { defineCommand } from '@lssm/lib.contracts/spec';
import { StoreModel, CreateStoreInputModel } from './store.schema';

const OWNERS = ['@example.marketplace'] as const;

/**
 * Create a new seller store.
 */
export const CreateStoreContract = defineCommand({
  meta: {
    name: 'marketplace.store.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'store', 'create'],
    description: 'Create a new seller store.',
    goal: 'Allow users to become sellers on the marketplace.',
    context: 'Seller onboarding.',
  },
  io: { input: CreateStoreInputModel, output: StoreModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        name: 'marketplace.store.created',
        version: 1,
        when: 'Store is created',
        payload: StoreModel,
      },
    ],
    audit: ['marketplace.store.created'],
  },
});
