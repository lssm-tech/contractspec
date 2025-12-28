import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';

/**
 * Review status enum.
 */
export const ReviewStatusEnum = defineEntityEnum({
  name: 'ReviewStatus',
  values: ['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'] as const,
  schema: 'marketplace',
  description: 'Status of a review.',
});

/**
 * Review type enum.
 */
export const ReviewTypeEnum = defineEntityEnum({
  name: 'ReviewType',
  values: ['PRODUCT', 'STORE', 'ORDER'] as const,
  schema: 'marketplace',
  description: 'Type of review.',
});

/**
 * Review entity - customer reviews and ratings.
 */
export const ReviewEntity = defineEntity({
  name: 'Review',
  description: 'A customer review on the marketplace.',
  schema: 'marketplace',
  map: 'review',
  fields: {
    id: field.id({ description: 'Unique review ID' }),

    // Type and target
    type: field.enum('ReviewType', { default: 'PRODUCT' }),
    productId: field.string({ isOptional: true }),
    storeId: field.string({ isOptional: true }),
    orderId: field.string({ isOptional: true }),
    orderItemId: field.string({ isOptional: true }),

    // Author
    authorId: field.foreignKey({ description: 'Reviewer user ID' }),

    // Content
    rating: field.int({ description: 'Rating 1-5' }),
    title: field.string({ isOptional: true }),
    content: field.string({ isOptional: true }),

    // Verification
    isVerifiedPurchase: field.boolean({ default: false }),

    // Status
    status: field.enum('ReviewStatus', { default: 'PENDING' }),

    // Media (using file attachments)
    hasMedia: field.boolean({ default: false }),

    // Helpfulness
    helpfulCount: field.int({ default: 0 }),
    notHelpfulCount: field.int({ default: 0 }),

    // Moderation
    moderatedBy: field.string({ isOptional: true }),
    moderatedAt: field.dateTime({ isOptional: true }),
    moderationNote: field.string({ isOptional: true }),

    // Response
    hasResponse: field.boolean({ default: false }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    product: field.belongsTo('Product', ['productId'], ['id']),
    store: field.belongsTo('Store', ['storeId'], ['id']),
    responses: field.hasMany('ReviewResponse'),
    votes: field.hasMany('ReviewVote'),
  },
  indexes: [
    index.on(['productId', 'status', 'createdAt']),
    index.on(['storeId', 'status', 'createdAt']),
    index.on(['authorId']),
    index.on(['orderId']),
    index.on(['status']),
    index.on(['rating']),
    index.on(['isVerifiedPurchase', 'status']),
  ],
  enums: [ReviewStatusEnum, ReviewTypeEnum],
});

/**
 * Review response entity - seller responses to reviews.
 */
export const ReviewResponseEntity = defineEntity({
  name: 'ReviewResponse',
  description: 'A seller response to a review.',
  schema: 'marketplace',
  map: 'review_response',
  fields: {
    id: field.id(),
    reviewId: field.foreignKey(),

    // Author (usually store owner)
    authorId: field.foreignKey(),

    // Content
    content: field.string(),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    review: field.belongsTo('Review', ['reviewId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [index.on(['reviewId']), index.on(['authorId'])],
});

/**
 * Review vote entity - helpfulness votes.
 */
export const ReviewVoteEntity = defineEntity({
  name: 'ReviewVote',
  description: 'A helpfulness vote on a review.',
  schema: 'marketplace',
  map: 'review_vote',
  fields: {
    id: field.id(),
    reviewId: field.foreignKey(),
    userId: field.foreignKey(),

    isHelpful: field.boolean(),

    createdAt: field.createdAt(),

    // Relations
    review: field.belongsTo('Review', ['reviewId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [index.unique(['reviewId', 'userId']), index.on(['userId'])],
});

/**
 * Review report entity - flagged reviews.
 */
export const ReviewReportEntity = defineEntity({
  name: 'ReviewReport',
  description: 'A report/flag on a review.',
  schema: 'marketplace',
  map: 'review_report',
  fields: {
    id: field.id(),
    reviewId: field.foreignKey(),
    reporterId: field.foreignKey(),

    reason: field.string({ description: 'Report reason category' }),
    details: field.string({ isOptional: true }),

    // Status
    status: field.string({ default: '"PENDING"' }),
    resolvedBy: field.string({ isOptional: true }),
    resolvedAt: field.dateTime({ isOptional: true }),
    resolution: field.string({ isOptional: true }),

    createdAt: field.createdAt(),

    // Relations
    review: field.belongsTo('Review', ['reviewId'], ['id']),
  },
  indexes: [
    index.on(['reviewId']),
    index.on(['status']),
    index.on(['reporterId']),
  ],
});
