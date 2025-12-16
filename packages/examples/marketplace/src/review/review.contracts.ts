import { defineCommand, defineQuery } from '@lssm/lib.contracts/spec';
import {
  ReviewModel,
  CreateReviewInputModel,
  ListReviewsInputModel,
  ListReviewsOutputModel,
} from './review.schema';

const OWNERS = ['@example.marketplace'] as const;

/**
 * Create a product/store review.
 */
export const CreateReviewContract = defineCommand({
  meta: {
    name: 'marketplace.review.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'review', 'create'],
    description: 'Create a product/store review.',
    goal: 'Allow buyers to leave feedback.',
    context: 'Post-purchase.',
  },
  io: { input: CreateReviewInputModel, output: ReviewModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        name: 'marketplace.review.created',
        version: 1,
        when: 'Review is created',
        payload: ReviewModel,
      },
    ],
    audit: ['marketplace.review.created'],
  },
});

/**
 * List reviews with filters.
 */
export const ListReviewsContract = defineQuery({
  meta: {
    name: 'marketplace.review.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'review', 'list'],
    description: 'List reviews with filters.',
    goal: 'Display product/store reviews.',
    context: 'Product page, store page.',
  },
  io: { input: ListReviewsInputModel, output: ListReviewsOutputModel },
  policy: { auth: 'anonymous' },
});
