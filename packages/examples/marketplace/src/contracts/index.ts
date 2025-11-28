import { defineCommand, defineQuery } from '@lssm/lib.contracts/spec';
import { defineSchemaModel, ScalarTypeEnum, defineEnum } from '@lssm/lib.schema';

const OWNERS = ['example.marketplace'] as const;

// ============ Enums ============

const StoreStatusSchemaEnum = defineEnum('StoreStatus', ['PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED']);
const ProductStatusSchemaEnum = defineEnum('ProductStatus', ['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED', 'REJECTED']);
const OrderStatusSchemaEnum = defineEnum('OrderStatus', ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'DISPUTED']);
const PayoutStatusSchemaEnum = defineEnum('PayoutStatus', ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED']);
const ReviewStatusSchemaEnum = defineEnum('ReviewStatus', ['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED']);

// ============ Store Schemas ============

export const StoreModel = defineSchemaModel({
  name: 'StoreModel',
  description: 'A seller store',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: StoreStatusSchemaEnum, isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    logoFileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isVerified: { type: ScalarTypeEnum.Boolean_unsecure(), isOptional: false },
    totalProducts: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    averageRating: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CreateStoreInputModel = defineSchemaModel({
  name: 'CreateStoreInput',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: true },
    country: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

// ============ Product Schemas ============

export const ProductModel = defineSchemaModel({
  name: 'ProductModel',
  description: 'A product listing',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ProductStatusSchemaEnum, isOptional: false },
    price: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    categoryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    primaryImageId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    averageRating: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    totalSold: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CreateProductInputModel = defineSchemaModel({
  name: 'CreateProductInput',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    price: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    quantity: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    categoryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    sku: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const ListProductsInputModel = defineSchemaModel({
  name: 'ListProductsInput',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    categoryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ProductStatusSchemaEnum, isOptional: true },
    search: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    minPrice: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    maxPrice: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 20 },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 0 },
  },
});

export const ListProductsOutputModel = defineSchemaModel({
  name: 'ListProductsOutput',
  fields: {
    products: { type: ProductModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

// ============ Order Schemas ============

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

export const OrderModel = defineSchemaModel({
  name: 'OrderModel',
  description: 'An order',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orderNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    buyerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: OrderStatusSchemaEnum, isOptional: false },
    subtotal: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    shippingTotal: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    taxTotal: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    total: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    items: { type: OrderItemModel, isArray: true, isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CreateOrderInputModel = defineSchemaModel({
  name: 'CreateOrderInput',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    items: { type: ScalarTypeEnum.JSON(), isOptional: false, description: 'Array of {productId, variantId?, quantity}' },
    shippingAddress: { type: ScalarTypeEnum.JSON(), isOptional: true },
    billingAddress: { type: ScalarTypeEnum.JSON(), isOptional: true },
    buyerNote: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const UpdateOrderStatusInputModel = defineSchemaModel({
  name: 'UpdateOrderStatusInput',
  fields: {
    orderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: OrderStatusSchemaEnum, isOptional: false },
    trackingNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    trackingUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    note: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

// ============ Payout Schemas ============

export const PayoutModel = defineSchemaModel({
  name: 'PayoutModel',
  description: 'A payout to seller',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    payoutNumber: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: PayoutStatusSchemaEnum, isOptional: false },
    grossAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    platformFees: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    netAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    periodStart: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    periodEnd: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    orderCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    paidAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const ListPayoutsInputModel = defineSchemaModel({
  name: 'ListPayoutsInput',
  fields: {
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: PayoutStatusSchemaEnum, isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 20 },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 0 },
  },
});

export const ListPayoutsOutputModel = defineSchemaModel({
  name: 'ListPayoutsOutput',
  fields: {
    payouts: { type: PayoutModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    totalPending: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});

// ============ Review Schemas ============

export const ReviewModel = defineSchemaModel({
  name: 'ReviewModel',
  description: 'A customer review',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    authorId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    rating: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ReviewStatusSchemaEnum, isOptional: false },
    isVerifiedPurchase: { type: ScalarTypeEnum.Boolean_unsecure(), isOptional: false },
    helpfulCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    hasResponse: { type: ScalarTypeEnum.Boolean_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const CreateReviewInputModel = defineSchemaModel({
  name: 'CreateReviewInput',
  fields: {
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    rating: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const ListReviewsInputModel = defineSchemaModel({
  name: 'ListReviewsInput',
  fields: {
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    storeId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ReviewStatusSchemaEnum, isOptional: true },
    minRating: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 20 },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true, defaultValue: 0 },
  },
});

export const ListReviewsOutputModel = defineSchemaModel({
  name: 'ListReviewsOutput',
  fields: {
    reviews: { type: ReviewModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    averageRating: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    ratingDistribution: { type: ScalarTypeEnum.JSON(), isOptional: false },
  },
});

// ============ Contracts ============

// Store contracts
export const CreateStoreContract = defineCommand({
  meta: {
    name: 'marketplace.store.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'store', 'create'],
    description: 'Create a new seller store.',
    goal: 'Allow users to become sellers on the marketplace.',
    context: 'Seller onboarding.',
  },
  io: { input: CreateStoreInputModel, output: StoreModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [{ name: 'marketplace.store.created', version: 1, when: 'Store is created', payload: StoreModel }],
    audit: ['marketplace.store.created'],
  },
});

// Product contracts
export const CreateProductContract = defineCommand({
  meta: {
    name: 'marketplace.product.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'product', 'create'],
    description: 'Create a new product listing.',
    goal: 'Allow sellers to list products.',
    context: 'Product management.',
  },
  io: { input: CreateProductInputModel, output: ProductModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [{ name: 'marketplace.product.created', version: 1, when: 'Product is created', payload: ProductModel }],
    audit: ['marketplace.product.created'],
  },
});

export const ListProductsContract = defineQuery({
  meta: {
    name: 'marketplace.product.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'product', 'list'],
    description: 'List products with filters.',
    goal: 'Browse products on the marketplace.',
    context: 'Product catalog, search.',
  },
  io: { input: ListProductsInputModel, output: ListProductsOutputModel },
  policy: { auth: 'optional' },
});

// Order contracts
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
    emits: [{ name: 'marketplace.order.created', version: 1, when: 'Order is created', payload: OrderModel }],
    audit: ['marketplace.order.created'],
    metering: [{ metric: 'orders.created', value: 1 }],
  },
});

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
    emits: [{ name: 'marketplace.order.statusUpdated', version: 1, when: 'Status changes', payload: OrderModel }],
    audit: ['marketplace.order.statusUpdated'],
  },
});

// Payout contracts
export const ListPayoutsContract = defineQuery({
  meta: {
    name: 'marketplace.payout.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'payout', 'list'],
    description: 'List payouts for a store.',
    goal: 'View payout history.',
    context: 'Seller dashboard.',
  },
  io: { input: ListPayoutsInputModel, output: ListPayoutsOutputModel },
  policy: { auth: 'user' },
});

// Review contracts
export const CreateReviewContract = defineCommand({
  meta: {
    name: 'marketplace.review.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'review', 'create'],
    description: 'Create a product/store review.',
    goal: 'Allow buyers to leave feedback.',
    context: 'Post-purchase.',
  },
  io: { input: CreateReviewInputModel, output: ReviewModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [{ name: 'marketplace.review.created', version: 1, when: 'Review is created', payload: ReviewModel }],
    audit: ['marketplace.review.created'],
  },
});

export const ListReviewsContract = defineQuery({
  meta: {
    name: 'marketplace.review.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['marketplace', 'review', 'list'],
    description: 'List reviews with filters.',
    goal: 'Display product/store reviews.',
    context: 'Product page, store page.',
  },
  io: { input: ListReviewsInputModel, output: ListReviewsOutputModel },
  policy: { auth: 'optional' },
});

