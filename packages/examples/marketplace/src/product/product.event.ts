import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '@contractspec/lib.contracts';

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
  meta: {
    key: 'marketplace.product.created',
    version: 1,
    description: 'A new product has been created.',
    stability: 'experimental',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product'],
  },
  payload: ProductCreatedPayload,
});

export const ProductPublishedEvent = defineEvent({
  meta: {
    key: 'marketplace.product.published',
    version: 1,
    description: 'A product has been published.',
    stability: 'experimental',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product'],
  },
  payload: ProductPublishedPayload,
});

export const InventoryUpdatedEvent = defineEvent({
  meta: {
    key: 'marketplace.inventory.updated',
    version: 1,
    description: 'Product inventory has been updated.',
    stability: 'experimental',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'product', 'inventory'],
  },
  payload: InventoryUpdatedPayload,
});
