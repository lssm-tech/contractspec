import { defineCommand } from '@lssm/lib.contracts/operations';
import {
  OrderModel,
  CreateOrderInputModel,
  UpdateOrderStatusInputModel,
} from './order.schema';

const OWNERS = ['@example.marketplace'] as const;

/**
 * Create a new order.
 */
export const CreateOrderContract = defineCommand({
  meta: {
    key: 'marketplace.order.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'order', 'create'],
    description: 'Create a new order.',
    goal: 'Allow buyers to purchase products.',
    context: 'Checkout flow.',
  },
  io: { input: CreateOrderInputModel, output: OrderModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'marketplace.order.created',
        version: 1,
        when: 'Order is created',
        payload: OrderModel,
      },
    ],
    audit: ['marketplace.order.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-order-happy-path',
        given: ['User is authenticated'],
        when: ['User creates order with valid items'],
        then: ['Order is created', 'OrderCreated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'create-basic-order',
        input: {
          storeId: 'store-123',
          items: [{ productId: 'prod-456', quantity: 1, unitPrice: 100 }],
        },
        output: { id: 'order-789', status: 'pending', total: 100 },
      },
    ],
  },
});

/**
 * Update order status.
 */
export const UpdateOrderStatusContract = defineCommand({
  meta: {
    key: 'marketplace.order.updateStatus',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'order', 'status'],
    description: 'Update order status.',
    goal: 'Track order fulfillment.',
    context: 'Order management.',
  },
  io: { input: UpdateOrderStatusInputModel, output: OrderModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'marketplace.order.statusUpdated',
        version: 1,
        when: 'Status changes',
        payload: OrderModel,
      },
    ],
    audit: ['marketplace.order.statusUpdated'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'update-status-happy-path',
        given: ['Order exists'],
        when: ['Seller updates order status'],
        then: ['Status is updated', 'OrderStatusUpdated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'mark-shipped',
        input: {
          orderId: 'order-789',
          status: 'shipped',
          trackingNumber: 'TRACK123',
        },
        output: { id: 'order-789', status: 'shipped' },
      },
    ],
  },
});
