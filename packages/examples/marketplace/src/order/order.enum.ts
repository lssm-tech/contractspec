import { defineEnum } from '@contractspec/lib.schema';

/**
 * Order status enum.
 */
export const OrderStatusEnum = defineEnum('OrderStatus', [
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
  'PARTIALLY_REFUNDED',
  'DISPUTED',
]);
