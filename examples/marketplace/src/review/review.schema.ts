import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { ReviewStatusEnum } from './review.enum';

/**
 * A customer review.
 */
export const ReviewModel = defineSchemaModel({
  name: 'ReviewModel',
  description: 'A customer review',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    authorId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    rating: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ReviewStatusEnum, isOptional: false },
    isVerifiedPurchase: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    helpfulCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    hasResponse: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for creating a review.
 */
export const CreateReviewInputModel = defineSchemaModel({
  name: 'CreateReviewInput',
  fields: {
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    rating: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Input for listing reviews.
 */
export const ListReviewsInputModel = defineSchemaModel({
  name: 'ListReviewsInput',
  fields: {
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ReviewStatusEnum, isOptional: true },
    minRating: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    limit: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 20,
    },
    offset: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 0,
    },
  },
});

/**
 * Output for listing reviews.
 */
export const ListReviewsOutputModel = defineSchemaModel({
  name: 'ListReviewsOutput',
  fields: {
    reviews: { type: ReviewModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    averageRating: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    ratingDistribution: { type: ScalarTypeEnum.JSON(), isOptional: false },
  },
});
