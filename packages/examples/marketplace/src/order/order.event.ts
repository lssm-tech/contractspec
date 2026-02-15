import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '@contractspec/lib.contracts-spec';

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
    paymentMethod: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const OrderStatusUpdatedPayload = defineSchemaModel({
  name: 'OrderStatusUpdatedEventPayload',
  fields: {
    orderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orderNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousStatus: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
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
    trackingNumber: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
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

export const OrderCreatedEvent = defineEvent({
  meta: {
    key: 'marketplace.order.created',
    version: '1.0.0',
    description: 'A new order has been created.',
    stability: 'experimental',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'order'],
  },
  payload: OrderCreatedPayload,
});

export const OrderPaidEvent = defineEvent({
  meta: {
    key: 'marketplace.order.paid',
    version: '1.0.0',
    description: 'An order has been paid.',
    stability: 'experimental',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'order'],
  },
  payload: OrderPaidPayload,
});

export const OrderStatusUpdatedEvent = defineEvent({
  meta: {
    key: 'marketplace.order.statusUpdated',
    version: '1.0.0',
    description: 'An order status has been updated.',
    stability: 'experimental',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'order'],
  },
  payload: OrderStatusUpdatedPayload,
});

export const OrderShippedEvent = defineEvent({
  meta: {
    key: 'marketplace.order.shipped',
    version: '1.0.0',
    description: 'An order has been shipped.',
    stability: 'experimental',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'order'],
  },
  payload: OrderShippedPayload,
});

export const OrderCompletedEvent = defineEvent({
  meta: {
    key: 'marketplace.order.completed',
    version: '1.0.0',
    description: 'An order has been completed.',
    stability: 'experimental',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'order'],
  },
  payload: OrderCompletedPayload,
});
