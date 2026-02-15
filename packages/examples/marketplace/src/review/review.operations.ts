import {
  defineCommand,
  defineQuery,
} from '@contractspec/lib.contracts-spec/operations';
import {
  CreateReviewInputModel,
  ListReviewsInputModel,
  ListReviewsOutputModel,
  ReviewModel,
} from './review.schema';

const OWNERS = ['@example.marketplace'] as const;

/**
 * Create a product/store review.
 */
export const CreateReviewContract = defineCommand({
  meta: {
    key: 'marketplace.review.create',
    version: '1.0.0',
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
        key: 'marketplace.review.created',
        version: '1.0.0',
        when: 'Review is created',
        payload: ReviewModel,
      },
    ],
    audit: ['marketplace.review.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-review-happy-path',
        given: ['User purchased product'],
        when: ['User leaves a review'],
        then: ['Review is created', 'ReviewCreated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'create-5-star',
        input: { productId: 'prod-456', rating: 5, comment: 'Great product!' },
        output: { id: 'rev-789', status: 'published' },
      },
    ],
  },
});

/**
 * List reviews with filters.
 */
export const ListReviewsContract = defineQuery({
  meta: {
    key: 'marketplace.review.list',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'review', 'list'],
    description: 'List reviews with filters.',
    goal: 'Display product/store reviews.',
    context: 'Product page, store page.',
  },
  io: { input: ListReviewsInputModel, output: ListReviewsOutputModel },
  policy: { auth: 'anonymous' },
  acceptance: {
    scenarios: [
      {
        key: 'list-reviews-happy-path',
        given: ['Product has reviews'],
        when: ['User views reviews'],
        then: ['List of reviews is returned'],
      },
    ],
    examples: [
      {
        key: 'list-product-reviews',
        input: { productId: 'prod-456', limit: 10 },
        output: { items: [], total: 10, hasMore: false },
      },
    ],
  },
});
