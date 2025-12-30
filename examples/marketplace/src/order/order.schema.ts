import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { OrderStatusEnum } from './order.enum';

/**
 * An order item.
 */
export const OrderItemModel = defineSchemaModel({
  name: 'OrderItemModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    productName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    unitPrice: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    quantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    subtotal: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});

/**
 * An order.
 */
export const OrderModel = defineSchemaModel({
  name: 'OrderModel',
  description: 'An order',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orderNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    buyerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: OrderStatusEnum, isOptional: false },
    subtotal: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    shippingTotal: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    taxTotal: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    total: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    items: { type: OrderItemModel, isArray: true, isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for creating an order.
 */
export const CreateOrderInputModel = defineSchemaModel({
  name: 'CreateOrderInput',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    items: {
      type: ScalarTypeEnum.JSON(),
      isOptional: false,
      description: 'Array of {productId, variantId?, quantity}',
    },
    shippingAddress: { type: ScalarTypeEnum.JSON(), isOptional: true },
    billingAddress: { type: ScalarTypeEnum.JSON(), isOptional: true },
    buyerNote: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

/**
 * Input for updating order status.
 */
export const UpdateOrderStatusInputModel = defineSchemaModel({
  name: 'UpdateOrderStatusInput',
  fields: {
    orderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: OrderStatusEnum, isOptional: false },
    trackingNumber: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    trackingUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    note: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});
