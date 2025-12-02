/**
 * Runtime-local Marketplace handlers
 *
 * Database-backed handlers for the marketplace template.
 */
import type { LocalDatabase, LocalRow } from '../database/sqlite-wasm';
import { generateId } from '../utils/id';

// ============ Types ============

export interface Store {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description?: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  status: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  stock: number;
  category?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  projectId: string;
  storeId: string;
  customerId: string;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';
  total: number;
  currency: string;
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
}

export interface Payout {
  id: string;
  storeId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  processedAt?: Date;
  createdAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  orderId?: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface CreateStoreInput {
  name: string;
  description?: string;
}

export interface AddProductInput {
  storeId: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  stock?: number;
  category?: string;
  imageUrl?: string;
}

export interface PlaceOrderInput {
  storeId: string;
  items: { productId: string; quantity: number }[];
  shippingAddress?: string;
}

export interface ListStoresInput {
  projectId: string;
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'all';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListStoresOutput {
  stores: Store[];
  total: number;
}

export interface ListProductsInput {
  storeId?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED' | 'all';
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListProductsOutput {
  products: Product[];
  total: number;
}

export interface ListOrdersInput {
  projectId: string;
  storeId?: string;
  customerId?: string;
  status?:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'all';
  limit?: number;
  offset?: number;
}

export interface ListOrdersOutput {
  orders: Order[];
  total: number;
  totalRevenue: number;
}

// ============ Row Types ============

interface StoreRow {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description: string | null;
  status: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductRow {
  id: string;
  storeId: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  status: string;
  stock: number;
  category: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderRow {
  id: string;
  projectId: string;
  storeId: string;
  customerId: string;
  status: string;
  total: number;
  currency: string;
  shippingAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderItemRow {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
}

interface PayoutRow {
  id: string;
  storeId: string;
  amount: number;
  currency: string;
  status: string;
  processedAt: string | null;
  createdAt: string;
}

interface ReviewRow {
  id: string;
  productId: string;
  customerId: string;
  orderId: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
}

function rowToStore(row: StoreRow): Store {
  return {
    id: row.id,
    projectId: row.projectId,
    organizationId: row.organizationId,
    name: row.name,
    description: row.description ?? undefined,
    status: row.status as Store['status'],
    rating: row.rating,
    reviewCount: row.reviewCount,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    storeId: row.storeId,
    name: row.name,
    description: row.description ?? undefined,
    price: row.price,
    currency: row.currency,
    status: row.status as Product['status'],
    stock: row.stock,
    category: row.category ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    projectId: row.projectId,
    storeId: row.storeId,
    customerId: row.customerId,
    status: row.status as Order['status'],
    total: row.total,
    currency: row.currency,
    shippingAddress: row.shippingAddress ?? undefined,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

function rowToOrderItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.orderId,
    productId: row.productId,
    quantity: row.quantity,
    price: row.price,
    createdAt: new Date(row.createdAt),
  };
}

function rowToPayout(row: PayoutRow): Payout {
  return {
    id: row.id,
    storeId: row.storeId,
    amount: row.amount,
    currency: row.currency,
    status: row.status as Payout['status'],
    processedAt: row.processedAt ? new Date(row.processedAt) : undefined,
    createdAt: new Date(row.createdAt),
  };
}

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.productId,
    customerId: row.customerId,
    orderId: row.orderId ?? undefined,
    rating: row.rating,
    comment: row.comment ?? undefined,
    createdAt: new Date(row.createdAt),
  };
}

// ============ Handler Factory ============

export function createMarketplaceHandlers(db: LocalDatabase) {
  /**
   * List stores
   */
  async function listStores(input: ListStoresInput): Promise<ListStoresOutput> {
    const { projectId, status, search, limit = 20, offset = 0 } = input;

    let whereClause = 'WHERE projectId = ?';
    const params: (string | number)[] = [projectId];

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    const countResult = (await db.exec(
      `SELECT COUNT(*) as count FROM marketplace_store ${whereClause}`,
      params
    )) as LocalRow[];
    const total = (countResult[0]?.count as number) ?? 0;

    const rows = (await db.exec(
      `SELECT * FROM marketplace_store ${whereClause} ORDER BY rating DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )) as unknown as StoreRow[];

    return {
      stores: rows.map(rowToStore),
      total,
    };
  }

  /**
   * Create a store
   */
  async function createStore(
    input: CreateStoreInput,
    context: { projectId: string; organizationId: string }
  ): Promise<Store> {
    const id = generateId('store');
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO marketplace_store (id, projectId, organizationId, name, description, status, rating, reviewCount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        context.projectId,
        context.organizationId,
        input.name,
        input.description ?? null,
        'PENDING',
        0,
        0,
        now,
        now,
      ]
    );

    const rows = (await db.exec(
      `SELECT * FROM marketplace_store WHERE id = ?`,
      [id]
    )) as unknown as StoreRow[];

    return rowToStore(rows[0]!);
  }

  /**
   * List products
   */
  async function listProducts(
    input: ListProductsInput
  ): Promise<ListProductsOutput> {
    const { storeId, status, category, search, limit = 20, offset = 0 } = input;

    let whereClause = 'WHERE 1=1';
    const params: (string | number)[] = [];

    if (storeId) {
      whereClause += ' AND storeId = ?';
      params.push(storeId);
    }

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      whereClause += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    const countResult = (await db.exec(
      `SELECT COUNT(*) as count FROM marketplace_product ${whereClause}`,
      params
    )) as LocalRow[];
    const total = (countResult[0]?.count as number) ?? 0;

    const rows = (await db.exec(
      `SELECT * FROM marketplace_product ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )) as unknown as ProductRow[];

    return {
      products: rows.map(rowToProduct),
      total,
    };
  }

  /**
   * Add a product
   */
  async function addProduct(input: AddProductInput): Promise<Product> {
    const id = generateId('prod');
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO marketplace_product (id, storeId, name, description, price, currency, status, stock, category, imageUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.storeId,
        input.name,
        input.description ?? null,
        input.price,
        input.currency ?? 'USD',
        'DRAFT',
        input.stock ?? 0,
        input.category ?? null,
        input.imageUrl ?? null,
        now,
        now,
      ]
    );

    const rows = (await db.exec(
      `SELECT * FROM marketplace_product WHERE id = ?`,
      [id]
    )) as unknown as ProductRow[];

    return rowToProduct(rows[0]!);
  }

  /**
   * List orders
   */
  async function listOrders(input: ListOrdersInput): Promise<ListOrdersOutput> {
    const {
      projectId,
      storeId,
      customerId,
      status,
      limit = 20,
      offset = 0,
    } = input;

    let whereClause = 'WHERE projectId = ?';
    const params: (string | number)[] = [projectId];

    if (storeId) {
      whereClause += ' AND storeId = ?';
      params.push(storeId);
    }

    if (customerId) {
      whereClause += ' AND customerId = ?';
      params.push(customerId);
    }

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    const countResult = (await db.exec(
      `SELECT COUNT(*) as count FROM marketplace_order ${whereClause}`,
      params
    )) as LocalRow[];
    const total = (countResult[0]?.count as number) ?? 0;

    const revenueResult = (await db.exec(
      `SELECT COALESCE(SUM(total), 0) as revenue FROM marketplace_order ${whereClause}`,
      params
    )) as LocalRow[];
    const totalRevenue = (revenueResult[0]?.revenue as number) ?? 0;

    const rows = (await db.exec(
      `SELECT * FROM marketplace_order ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )) as unknown as OrderRow[];

    return {
      orders: rows.map(rowToOrder),
      total,
      totalRevenue,
    };
  }

  /**
   * Place an order
   */
  async function placeOrder(
    input: PlaceOrderInput,
    context: { projectId: string; customerId: string }
  ): Promise<Order> {
    const orderId = generateId('order');
    const now = new Date().toISOString();

    // Calculate total
    let total = 0;
    const itemsToCreate: {
      productId: string;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of input.items) {
      const products = (await db.exec(
        `SELECT * FROM marketplace_product WHERE id = ?`,
        [item.productId]
      )) as unknown as ProductRow[];

      if (!products[0]) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const itemPrice = products[0].price * item.quantity;
      total += itemPrice;
      itemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
        price: products[0].price,
      });
    }

    // Create order
    await db.run(
      `INSERT INTO marketplace_order (id, projectId, storeId, customerId, status, total, currency, shippingAddress, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        context.projectId,
        input.storeId,
        context.customerId,
        'PENDING',
        total,
        'USD',
        input.shippingAddress ?? null,
        now,
        now,
      ]
    );

    // Create order items
    for (const item of itemsToCreate) {
      await db.run(
        `INSERT INTO marketplace_order_item (id, orderId, productId, quantity, price, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          generateId('orditem'),
          orderId,
          item.productId,
          item.quantity,
          item.price,
          now,
        ]
      );
    }

    const rows = (await db.exec(
      `SELECT * FROM marketplace_order WHERE id = ?`,
      [orderId]
    )) as unknown as OrderRow[];

    return rowToOrder(rows[0]!);
  }

  /**
   * Get order items
   */
  async function getOrderItems(orderId: string): Promise<OrderItem[]> {
    const rows = (await db.exec(
      `SELECT * FROM marketplace_order_item WHERE orderId = ?`,
      [orderId]
    )) as unknown as OrderItemRow[];

    return rows.map(rowToOrderItem);
  }

  /**
   * Update order status
   */
  async function updateOrderStatus(
    orderId: string,
    status: Order['status']
  ): Promise<Order> {
    const now = new Date().toISOString();

    await db.run(
      `UPDATE marketplace_order SET status = ?, updatedAt = ? WHERE id = ?`,
      [status, now, orderId]
    );

    const rows = (await db.exec(
      `SELECT * FROM marketplace_order WHERE id = ?`,
      [orderId]
    )) as unknown as OrderRow[];

    return rowToOrder(rows[0]!);
  }

  /**
   * List payouts
   */
  async function listPayouts(storeId: string): Promise<Payout[]> {
    const rows = (await db.exec(
      `SELECT * FROM marketplace_payout WHERE storeId = ? ORDER BY createdAt DESC`,
      [storeId]
    )) as unknown as PayoutRow[];

    return rows.map(rowToPayout);
  }

  /**
   * List reviews for a product
   */
  async function listReviews(productId: string): Promise<Review[]> {
    const rows = (await db.exec(
      `SELECT * FROM marketplace_review WHERE productId = ? ORDER BY createdAt DESC`,
      [productId]
    )) as unknown as ReviewRow[];

    return rows.map(rowToReview);
  }

  /**
   * Submit a review
   */
  async function submitReview(input: {
    productId: string;
    customerId: string;
    orderId?: string;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    const id = generateId('review');
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO marketplace_review (id, productId, customerId, orderId, rating, comment, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.productId,
        input.customerId,
        input.orderId ?? null,
        input.rating,
        input.comment ?? null,
        now,
      ]
    );

    const rows = (await db.exec(
      `SELECT * FROM marketplace_review WHERE id = ?`,
      [id]
    )) as unknown as ReviewRow[];

    return rowToReview(rows[0]!);
  }

  return {
    listStores,
    createStore,
    listProducts,
    addProduct,
    listOrders,
    placeOrder,
    getOrderItems,
    updateOrderStatus,
    listPayouts,
    listReviews,
    submitReview,
  };
}

export type MarketplaceHandlers = ReturnType<typeof createMarketplaceHandlers>;
