import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

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
