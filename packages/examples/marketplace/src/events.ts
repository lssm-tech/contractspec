import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

// ============ Store Event Payloads ============

const StoreCreatedPayload = defineSchemaModel({
  name: 'StoreCreatedEventPayload',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const StoreStatusChangedPayload = defineSchemaModel({
  name: 'StoreStatusChangedEventPayload',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    newStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Product Event Payloads ============

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
    previousQuantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    newQuantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Order Event Payloads ============

const OrderCreatedPayload = defineSchemaModel({
  name: 'OrderCreatedEventPayload',
  fields: {
    orderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orderNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    buyerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    total: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    itemCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const OrderPaidPayload = defineSchemaModel({
  name: 'OrderPaidEventPayload',
  fields: {
    orderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orderNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    total: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    paymentMethod: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const OrderStatusUpdatedPayload = defineSchemaModel({
  name: 'OrderStatusUpdatedEventPayload',
  fields: {
    orderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orderNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    newStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    updatedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const OrderShippedPayload = defineSchemaModel({
  name: 'OrderShippedEventPayload',
  fields: {
    orderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orderNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    trackingNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    trackingUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    carrier: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const OrderCompletedPayload = defineSchemaModel({
  name: 'OrderCompletedEventPayload',
  fields: {
    orderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orderNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    buyerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    total: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    sellerPayout: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Payout Event Payloads ============

const PayoutCreatedPayload = defineSchemaModel({
  name: 'PayoutCreatedEventPayload',
  fields: {
    payoutId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    payoutNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    netAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orderCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const PayoutPaidPayload = defineSchemaModel({
  name: 'PayoutPaidEventPayload',
  fields: {
    payoutId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    payoutNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    netAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    paymentReference: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Review Event Payloads ============

const ReviewCreatedPayload = defineSchemaModel({
  name: 'ReviewCreatedEventPayload',
  fields: {
    reviewId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    authorId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    rating: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    isVerifiedPurchase: { type: ScalarTypeEnum.Boolean_unsecure(), isOptional: false },
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

// ============ Events ============

// Store events
export const StoreCreatedEvent = defineEvent({
  name: 'marketplace.store.created',
  version: 1,
  description: 'A new seller store has been created.',
  payload: StoreCreatedPayload,
});

export const StoreStatusChangedEvent = defineEvent({
  name: 'marketplace.store.statusChanged',
  version: 1,
  description: 'A store status has changed.',
  payload: StoreStatusChangedPayload,
});

// Product events
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

// Order events
export const OrderCreatedEvent = defineEvent({
  name: 'marketplace.order.created',
  version: 1,
  description: 'A new order has been created.',
  payload: OrderCreatedPayload,
});

export const OrderPaidEvent = defineEvent({
  name: 'marketplace.order.paid',
  version: 1,
  description: 'An order has been paid.',
  payload: OrderPaidPayload,
});

export const OrderStatusUpdatedEvent = defineEvent({
  name: 'marketplace.order.statusUpdated',
  version: 1,
  description: 'An order status has been updated.',
  payload: OrderStatusUpdatedPayload,
});

export const OrderShippedEvent = defineEvent({
  name: 'marketplace.order.shipped',
  version: 1,
  description: 'An order has been shipped.',
  payload: OrderShippedPayload,
});

export const OrderCompletedEvent = defineEvent({
  name: 'marketplace.order.completed',
  version: 1,
  description: 'An order has been completed.',
  payload: OrderCompletedPayload,
});

// Payout events
export const PayoutCreatedEvent = defineEvent({
  name: 'marketplace.payout.created',
  version: 1,
  description: 'A payout has been created.',
  payload: PayoutCreatedPayload,
});

export const PayoutPaidEvent = defineEvent({
  name: 'marketplace.payout.paid',
  version: 1,
  description: 'A payout has been sent.',
  payload: PayoutPaidPayload,
});

// Review events
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

// ============ All Events ============

export const MarketplaceEvents = {
  // Store
  StoreCreatedEvent,
  StoreStatusChangedEvent,
  
  // Product
  ProductCreatedEvent,
  ProductPublishedEvent,
  InventoryUpdatedEvent,
  
  // Order
  OrderCreatedEvent,
  OrderPaidEvent,
  OrderStatusUpdatedEvent,
  OrderShippedEvent,
  OrderCompletedEvent,
  
  // Payout
  PayoutCreatedEvent,
  PayoutPaidEvent,
  
  // Review
  ReviewCreatedEvent,
  ReviewRespondedEvent,
};

