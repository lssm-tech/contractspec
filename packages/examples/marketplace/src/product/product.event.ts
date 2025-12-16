import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

const ProductCreatedPayload = defineSchemaModel({
  name: 'ProductCreatedEventPayload',
  fields: {
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    price: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ProductPublishedPayload = defineSchemaModel({
  name: 'ProductPublishedEventPayload',
  fields: {
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const InventoryUpdatedPayload = defineSchemaModel({
  name: 'InventoryUpdatedEventPayload',
  fields: {
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    variantId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    previousQuantity: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    newQuantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ProductCreatedEvent = defineEvent({
  name: 'marketplace.product.created',
  version: 1,
  description: 'A new product has been created.',
  payload: ProductCreatedPayload,
});

export const ProductPublishedEvent = defineEvent({
  name: 'marketplace.product.published',
  version: 1,
  description: 'A product has been published.',
  payload: ProductPublishedPayload,
});

export const InventoryUpdatedEvent = defineEvent({
  name: 'marketplace.inventory.updated',
  version: 1,
  description: 'Product inventory has been updated.',
  payload: InventoryUpdatedPayload,
});


