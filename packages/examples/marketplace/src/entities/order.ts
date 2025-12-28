import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';

/**
 * Order status enum.
 */
export const OrderStatusEnum = defineEntityEnum({
  name: 'OrderStatus',
  values: [
    'PENDING', // Order created, awaiting payment
    'PAID', // Payment received
    'PROCESSING', // Being prepared by seller
    'SHIPPED', // Shipped to buyer
    'DELIVERED', // Delivered to buyer
    'COMPLETED', // Order finalized
    'CANCELLED', // Cancelled by buyer or seller
    'REFUNDED', // Full refund issued
    'PARTIALLY_REFUNDED', // Partial refund issued
    'DISPUTED', // In dispute
  ] as const,
  schema: 'marketplace',
  description: 'Status of an order.',
});

/**
 * Payment status enum.
 */
export const PaymentStatusEnum = defineEntityEnum({
  name: 'PaymentStatus',
  values: [
    'PENDING',
    'AUTHORIZED',
    'CAPTURED',
    'FAILED',
    'REFUNDED',
    'VOIDED',
  ] as const,
  schema: 'marketplace',
  description: 'Status of payment.',
});

/**
 * Order entity - a purchase transaction.
 */
export const OrderEntity = defineEntity({
  name: 'Order',
  description: 'A purchase order on the marketplace.',
  schema: 'marketplace',
  map: 'order',
  fields: {
    id: field.id({ description: 'Unique order ID' }),

    // Reference
    orderNumber: field.string({ description: 'Human-readable order number' }),

    // Parties
    buyerId: field.foreignKey({ description: 'Buyer user ID' }),
    storeId: field.foreignKey({ description: 'Seller store ID' }),

    // Status
    status: field.enum('OrderStatus', { default: 'PENDING' }),
    paymentStatus: field.enum('PaymentStatus', { default: 'PENDING' }),

    // Totals
    subtotal: field.decimal({ description: 'Sum of item prices' }),
    shippingTotal: field.decimal({ default: 0 }),
    taxTotal: field.decimal({ default: 0 }),
    discountTotal: field.decimal({ default: 0 }),
    total: field.decimal({ description: 'Final total' }),
    currency: field.string({ default: '"USD"' }),

    // Commission
    platformFee: field.decimal({ description: 'Platform commission amount' }),
    sellerPayout: field.decimal({ description: 'Amount due to seller' }),

    // Shipping
    shippingAddress: field.json({ isOptional: true }),
    billingAddress: field.json({ isOptional: true }),
    shippingMethod: field.string({ isOptional: true }),
    trackingNumber: field.string({ isOptional: true }),
    trackingUrl: field.string({ isOptional: true }),

    // Payment
    paymentMethod: field.string({ isOptional: true }),
    paymentIntentId: field.string({ isOptional: true }),

    // Notes
    buyerNote: field.string({ isOptional: true }),
    sellerNote: field.string({ isOptional: true }),
    internalNote: field.string({ isOptional: true }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    paidAt: field.dateTime({ isOptional: true }),
    shippedAt: field.dateTime({ isOptional: true }),
    deliveredAt: field.dateTime({ isOptional: true }),
    completedAt: field.dateTime({ isOptional: true }),
    cancelledAt: field.dateTime({ isOptional: true }),

    // Relations
    store: field.belongsTo('Store', ['storeId'], ['id']),
    items: field.hasMany('OrderItem'),
    refunds: field.hasMany('Refund'),
  },
  indexes: [
    index.unique(['orderNumber']),
    index.on(['buyerId', 'status']),
    index.on(['storeId', 'status']),
    index.on(['status', 'createdAt']),
    index.on(['paymentStatus']),
    index.on(['createdAt']),
  ],
  enums: [OrderStatusEnum, PaymentStatusEnum],
});

/**
 * Order item entity - individual items in an order.
 */
export const OrderItemEntity = defineEntity({
  name: 'OrderItem',
  description: 'An item within an order.',
  schema: 'marketplace',
  map: 'order_item',
  fields: {
    id: field.id(),
    orderId: field.foreignKey(),
    productId: field.foreignKey(),
    variantId: field.string({ isOptional: true }),

    // Snapshot at time of purchase
    productName: field.string(),
    variantName: field.string({ isOptional: true }),
    sku: field.string({ isOptional: true }),

    // Pricing
    unitPrice: field.decimal(),
    quantity: field.int(),
    subtotal: field.decimal(),

    // Fulfillment
    quantityFulfilled: field.int({ default: 0 }),
    quantityRefunded: field.int({ default: 0 }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    order: field.belongsTo('Order', ['orderId'], ['id'], {
      onDelete: 'Cascade',
    }),
    product: field.belongsTo('Product', ['productId'], ['id']),
  },
  indexes: [index.on(['orderId']), index.on(['productId'])],
});

/**
 * Refund entity - refund records for orders.
 */
export const RefundEntity = defineEntity({
  name: 'Refund',
  description: 'A refund for an order.',
  schema: 'marketplace',
  map: 'refund',
  fields: {
    id: field.id(),
    orderId: field.foreignKey(),

    // Amount
    amount: field.decimal(),
    currency: field.string(),

    // Reason
    reason: field.string(),
    notes: field.string({ isOptional: true }),

    // Status
    status: field.string({ default: '"PENDING"' }),

    // Payment
    refundId: field.string({
      isOptional: true,
      description: 'Payment provider refund ID',
    }),

    // Actor
    issuedBy: field.foreignKey({ description: 'User who issued the refund' }),

    // Timestamps
    createdAt: field.createdAt(),
    processedAt: field.dateTime({ isOptional: true }),

    // Relations
    order: field.belongsTo('Order', ['orderId'], ['id']),
    items: field.hasMany('RefundItem'),
  },
  indexes: [index.on(['orderId']), index.on(['status'])],
});

/**
 * Refund item entity - items being refunded.
 */
export const RefundItemEntity = defineEntity({
  name: 'RefundItem',
  description: 'An item within a refund.',
  schema: 'marketplace',
  map: 'refund_item',
  fields: {
    id: field.id(),
    refundId: field.foreignKey(),
    orderItemId: field.foreignKey(),

    quantity: field.int(),
    amount: field.decimal(),

    createdAt: field.createdAt(),

    // Relations
    refund: field.belongsTo('Refund', ['refundId'], ['id'], {
      onDelete: 'Cascade',
    }),
    orderItem: field.belongsTo('OrderItem', ['orderItemId'], ['id']),
  },
  indexes: [index.on(['refundId']), index.on(['orderItemId'])],
});
