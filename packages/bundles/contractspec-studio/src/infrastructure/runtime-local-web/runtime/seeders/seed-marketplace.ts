import type { LocalDatabase } from '../../database/sqlite-wasm';

export async function seedMarketplace(params: {
  projectId: string;
  db: LocalDatabase;
}): Promise<void> {
  const { projectId, db } = params;
  const existing = await db.exec(
    `SELECT COUNT(*) as count FROM marketplace_store WHERE projectId = ?`,
    [projectId]
  );
  if ((existing[0]?.count as number) > 0) return;

  const organizationId = 'mp_org_1';

  const stores = [
    {
      id: 'mp_store_1',
      name: 'Tech Gadgets Pro',
      description: 'Premium electronics and accessories',
      status: 'ACTIVE',
      rating: 4.8,
      reviewCount: 124,
    },
    {
      id: 'mp_store_2',
      name: 'Artisan Crafts',
      description: 'Handmade crafts and unique gifts',
      status: 'ACTIVE',
      rating: 4.5,
      reviewCount: 67,
    },
    {
      id: 'mp_store_3',
      name: 'Fresh Foods Market',
      description: 'Farm-to-table produce and groceries',
      status: 'PENDING',
      rating: 0,
      reviewCount: 0,
    },
  ] as const;

  for (const store of stores) {
    await db.run(
      `INSERT INTO marketplace_store (id, projectId, organizationId, name, description, status, rating, reviewCount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        store.id,
        projectId,
        organizationId,
        store.name,
        store.description,
        store.status,
        store.rating,
        store.reviewCount,
      ]
    );
  }

  const products = [
    {
      id: 'mp_prod_1',
      storeId: 'mp_store_1',
      name: 'Wireless Earbuds Pro',
      price: 149.99,
      stock: 50,
      category: 'Audio',
      status: 'ACTIVE',
    },
    {
      id: 'mp_prod_2',
      storeId: 'mp_store_1',
      name: 'USB-C Hub 7-in-1',
      price: 59.99,
      stock: 100,
      category: 'Accessories',
      status: 'ACTIVE',
    },
    {
      id: 'mp_prod_3',
      storeId: 'mp_store_1',
      name: 'Mechanical Keyboard RGB',
      price: 129.99,
      stock: 25,
      category: 'Peripherals',
      status: 'ACTIVE',
    },
    {
      id: 'mp_prod_4',
      storeId: 'mp_store_1',
      name: 'Portable SSD 1TB',
      price: 99.99,
      stock: 0,
      category: 'Storage',
      status: 'OUT_OF_STOCK',
    },
  ] as const;

  for (const product of products) {
    await db.run(
      `INSERT INTO marketplace_product (id, storeId, name, price, currency, stock, category, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.id,
        product.storeId,
        product.name,
        product.price,
        'USD',
        product.stock,
        product.category,
        product.status,
      ]
    );
  }

  const orders = [
    {
      id: 'mp_order_1',
      storeId: 'mp_store_1',
      customerId: 'customer-1',
      total: 209.98,
      status: 'DELIVERED',
    },
    {
      id: 'mp_order_2',
      storeId: 'mp_store_1',
      customerId: 'customer-2',
      total: 59.99,
      status: 'PROCESSING',
    },
    {
      id: 'mp_order_3',
      storeId: 'mp_store_1',
      customerId: 'customer-3',
      total: 379.97,
      status: 'PENDING',
    },
  ] as const;

  for (const order of orders) {
    await db.run(
      `INSERT INTO marketplace_order (id, projectId, storeId, customerId, total, currency, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        order.id,
        projectId,
        order.storeId,
        order.customerId,
        order.total,
        'USD',
        order.status,
      ]
    );
  }
}


