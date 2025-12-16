import { defineCommand } from '@lssm/lib.contracts/spec';
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
    name: 'marketplace.order.create',
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
        name: 'marketplace.order.created',
        version: 1,
        when: 'Order is created',
        payload: OrderModel,
      },
    ],
    audit: ['marketplace.order.created'],
  },
});

/**
 * Update order status.
 */
export const UpdateOrderStatusContract = defineCommand({
  meta: {
    name: 'marketplace.order.updateStatus',
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
        name: 'marketplace.order.statusUpdated',
        version: 1,
        when: 'Status changes',
        payload: OrderModel,
      },
    ],
    audit: ['marketplace.order.statusUpdated'],
  },
});
