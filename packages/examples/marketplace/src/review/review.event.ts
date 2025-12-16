import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

const ReviewCreatedPayload = defineSchemaModel({
  name: 'ReviewCreatedEventPayload',
  fields: {
    reviewId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    authorId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    rating: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    isVerifiedPurchase: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ReviewRespondedPayload = defineSchemaModel({
  name: 'ReviewRespondedEventPayload',
  fields: {
    reviewId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    responseId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    authorId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ReviewCreatedEvent = defineEvent({
  name: 'marketplace.review.created',
  version: 1,
  description: 'A review has been created.',
  payload: ReviewCreatedPayload,
});

export const ReviewRespondedEvent = defineEvent({
  name: 'marketplace.review.responded',
  version: 1,
  description: 'A seller has responded to a review.',
  payload: ReviewRespondedPayload,
});
