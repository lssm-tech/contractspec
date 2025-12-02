/**
 * Marketplace Handlers
 *
 * Reference handler implementations for the marketplace example.
 */

// ============ Types ============

export interface MarketplaceHandlerContext {
  userId: string;
  userRoles: string[];
  organizationId?: string;
}

export interface MockStore {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  ownerId: string;
  email?: string;
  country?: string;
  currency: string;
  commissionRate: number;
  isVerified: boolean;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockProduct {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  price: number;
  currency: string;
  quantity: number;
  categoryId?: string;
  sku?: string;
  trackInventory: boolean;
  reviewCount: number;
  averageRating: number;
  totalSold: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  buyerId: string;
  storeId: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  currency: string;
  platformFee: number;
  sellerPayout: number;
  items: MockOrderItem[];
  shippingAddress?: unknown;
  billingAddress?: unknown;
  buyerNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockOrderItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface MockPayout {
  id: string;
  payoutNumber: string;
  storeId: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: Date;
}

export interface MockReview {
  id: string;
  type: string;
  productId?: string;
  storeId?: string;
  orderId?: string;
  authorId: string;
  customerId: string;
  rating: number;
  title?: string;
  content?: string;
  comment?: string;
  status: string;
  isVerifiedPurchase: boolean;
  isPublic: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============ Mock Data Store ============

export const mockMarketplaceStore = {
  stores: new Map<string, MockStore>(),
  products: new Map<string, MockProduct>(),
  orders: new Map<string, MockOrder>(),
  payouts: new Map<string, MockPayout>(),
  reviews: new Map<string, MockReview>(),
};

// ============ Order Number Generator ============

let orderCounter = 1000;

export function generateOrderNumber(): string {
  orderCounter++;
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `ORD-${year}${month}-${orderCounter}`;
}

// ============ Payout Number Generator ============

let payoutCounter = 100;

export function generatePayoutNumber(): string {
  payoutCounter++;
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `PAY-${year}${month}-${payoutCounter}`;
}

// ============ Commission Calculator ============

export interface CommissionResult {
  subtotal: number;
  platformFee: number;
  sellerPayout: number;
}

export function calculateCommission(
  subtotal: number,
  commissionRate = 0.1
): CommissionResult {
  const platformFee = Math.round(subtotal * commissionRate * 100) / 100;
  const sellerPayout = Math.round((subtotal - platformFee) * 100) / 100;

  return {
    subtotal,
    platformFee,
    sellerPayout,
  };
}

// ============ Rating Calculator ============

export interface RatingStats {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

export function calculateRatingStats(ratings: number[]): RatingStats {
  if (ratings.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  for (const rating of ratings) {
    sum += rating;
    distribution[rating] = (distribution[rating] ?? 0) + 1;
  }

  return {
    averageRating: Math.round((sum / ratings.length) * 10) / 10,
    totalReviews: ratings.length,
    distribution,
  };
}

// ============ Sample Handler Implementations ============

export async function handleCreateStore(
  input: {
    name: string;
    slug: string;
    description?: string;
    email?: string;
    country?: string;
    currency?: string;
  },
  context: MarketplaceHandlerContext
): Promise<{
  id: string;
  name: string;
  slug: string;
  status: string;
  ownerId: string;
  createdAt: Date;
}> {
  const id = `store_${Date.now()}`;
  const now = new Date();

  const store = {
    id,
    name: input.name,
    slug: input.slug,
    description: input.description,
    status: 'PENDING',
    ownerId: context.userId,
    email: input.email,
    country: input.country,
    currency: input.currency ?? 'USD',
    commissionRate: 0.1,
    isVerified: false,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    createdAt: now,
    updatedAt: now,
  };

  mockMarketplaceStore.stores.set(id, store);

  return {
    id,
    name: input.name,
    slug: input.slug,
    status: 'PENDING',
    ownerId: context.userId,
    createdAt: now,
  };
}

export async function handleCreateProduct(
  input: {
    storeId: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    currency?: string;
    quantity?: number;
    categoryId?: string;
    sku?: string;
  },
  _context: MarketplaceHandlerContext
): Promise<{
  id: string;
  storeId: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  createdAt: Date;
}> {
  const id = `prod_${Date.now()}`;
  const now = new Date();

  const product = {
    id,
    storeId: input.storeId,
    name: input.name,
    slug: input.slug,
    description: input.description,
    status: 'DRAFT',
    price: input.price,
    currency: input.currency ?? 'USD',
    quantity: input.quantity ?? 0,
    categoryId: input.categoryId,
    sku: input.sku,
    trackInventory: true,
    reviewCount: 0,
    averageRating: 0,
    totalSold: 0,
    createdAt: now,
    updatedAt: now,
  };

  mockMarketplaceStore.products.set(id, product);

  // Update store product count
  const store = mockMarketplaceStore.stores.get(input.storeId);
  if (store) {
    store.totalProducts++;
  }

  return {
    id,
    storeId: input.storeId,
    name: input.name,
    slug: input.slug,
    price: input.price,
    status: 'DRAFT',
    createdAt: now,
  };
}

export async function handleCreateOrder(
  input: {
    storeId: string;
    items: { productId: string; variantId?: string; quantity: number }[];
    shippingAddress?: unknown;
    billingAddress?: unknown;
    buyerNote?: string;
  },
  context: MarketplaceHandlerContext
): Promise<{
  id: string;
  orderNumber: string;
  storeId: string;
  buyerId: string;
  status: string;
  total: number;
  createdAt: Date;
}> {
  const id = `order_${Date.now()}`;
  const orderNumber = generateOrderNumber();
  const now = new Date();

  // Calculate totals
  let subtotal = 0;
  const orderItems: MockOrderItem[] = [];

  for (const item of input.items) {
    const product = mockMarketplaceStore.products.get(item.productId);
    if (product) {
      const price = product.price;
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;
      orderItems.push({
        id: `item_${Date.now()}_${Math.random()}`,
        productId: item.productId,
        variantId: item.variantId,
        productName: product.name,
        unitPrice: price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }
  }

  const commission = calculateCommission(subtotal);

  const order = {
    id,
    orderNumber,
    buyerId: context.userId,
    storeId: input.storeId,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    subtotal,
    shippingTotal: 0,
    taxTotal: 0,
    discountTotal: 0,
    total: subtotal,
    currency: 'USD',
    platformFee: commission.platformFee,
    sellerPayout: commission.sellerPayout,
    items: orderItems,
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress,
    buyerNote: input.buyerNote,
    createdAt: now,
    updatedAt: now,
  };

  mockMarketplaceStore.orders.set(id, order);

  return {
    id,
    orderNumber,
    storeId: input.storeId,
    buyerId: context.userId,
    status: 'PENDING',
    total: subtotal,
    createdAt: now,
  };
}

export async function handleCreateReview(
  input: {
    productId?: string;
    storeId?: string;
    orderId?: string;
    rating: number;
    title?: string;
    content?: string;
  },
  context: MarketplaceHandlerContext
): Promise<{
  id: string;
  productId?: string;
  storeId?: string;
  rating: number;
  status: string;
  createdAt: Date;
}> {
  const id = `review_${Date.now()}`;
  const now = new Date();

  // Check if verified purchase
  let isVerifiedPurchase = false;
  if (input.orderId) {
    const order = mockMarketplaceStore.orders.get(input.orderId);
    if (order) {
      isVerifiedPurchase = order.buyerId === context.userId;
    }
  }

  const review: MockReview = {
    id,
    type: input.productId ? 'PRODUCT' : 'STORE',
    productId: input.productId,
    storeId: input.storeId,
    orderId: input.orderId,
    authorId: context.userId,
    customerId: context.userId,
    rating: input.rating,
    title: input.title,
    content: input.content,
    status: 'PENDING',
    isVerifiedPurchase,
    isPublic: true,
    helpfulCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  mockMarketplaceStore.reviews.set(id, review);

  return {
    id,
    productId: input.productId,
    storeId: input.storeId,
    rating: input.rating,
    status: 'PENDING',
    createdAt: now,
  };
}
