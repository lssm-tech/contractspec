/**
 * Markdown renderers for Marketplace presentations
 */
import type { PresentationRenderer } from '@contractspec/lib.contracts';

// Mock data for marketplace rendering
const mockStores = [
  {
    id: 'store-1',
    name: 'Tech Gadgets Store',
    status: 'ACTIVE',
    productCount: 45,
    rating: 4.8,
  },
  {
    id: 'store-2',
    name: 'Home & Garden',
    status: 'ACTIVE',
    productCount: 120,
    rating: 4.5,
  },
  {
    id: 'store-3',
    name: 'Fashion Boutique',
    status: 'PENDING',
    productCount: 0,
    rating: 0,
  },
];

const mockProducts = [
  {
    id: 'prod-1',
    name: 'Wireless Earbuds',
    storeId: 'store-1',
    price: 79.99,
    currency: 'USD',
    status: 'ACTIVE',
    stock: 150,
  },
  {
    id: 'prod-2',
    name: 'Smart Watch',
    storeId: 'store-1',
    price: 249.99,
    currency: 'USD',
    status: 'ACTIVE',
    stock: 50,
  },
  {
    id: 'prod-3',
    name: 'Garden Tools Set',
    storeId: 'store-2',
    price: 89.99,
    currency: 'USD',
    status: 'ACTIVE',
    stock: 30,
  },
  {
    id: 'prod-4',
    name: 'Indoor Plant Kit',
    storeId: 'store-2',
    price: 45.99,
    currency: 'USD',
    status: 'ACTIVE',
    stock: 75,
  },
  {
    id: 'prod-5',
    name: 'LED Desk Lamp',
    storeId: 'store-1',
    price: 34.99,
    currency: 'USD',
    status: 'OUT_OF_STOCK',
    stock: 0,
  },
];

const mockOrders = [
  {
    id: 'ord-1',
    storeId: 'store-1',
    customerId: 'cust-1',
    total: 329.98,
    currency: 'USD',
    status: 'DELIVERED',
    itemCount: 2,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'ord-2',
    storeId: 'store-2',
    customerId: 'cust-2',
    total: 135.98,
    currency: 'USD',
    status: 'SHIPPED',
    itemCount: 2,
    createdAt: '2024-01-14T14:00:00Z',
  },
  {
    id: 'ord-3',
    storeId: 'store-1',
    customerId: 'cust-3',
    total: 79.99,
    currency: 'USD',
    status: 'PROCESSING',
    itemCount: 1,
    createdAt: '2024-01-16T08:00:00Z',
  },
  {
    id: 'ord-4',
    storeId: 'store-2',
    customerId: 'cust-4',
    total: 45.99,
    currency: 'USD',
    status: 'PENDING',
    itemCount: 1,
    createdAt: '2024-01-16T12:00:00Z',
  },
];

function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Markdown renderer for Marketplace Dashboard
 */
export const marketplaceDashboardMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc) => {
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'MarketplaceDashboard'
    ) {
      throw new Error(
        'marketplaceDashboardMarkdownRenderer: not MarketplaceDashboard'
      );
    }

    const stores = mockStores;
    const products = mockProducts;
    const orders = mockOrders;

    // Calculate stats
    const activeStores = stores.filter((s) => s.status === 'ACTIVE');
    const activeProducts = products.filter((p) => p.status === 'ACTIVE');
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(
      (o) => o.status === 'PENDING' || o.status === 'PROCESSING'
    );

    const lines: string[] = [
      '# Marketplace Dashboard',
      '',
      '> Two-sided marketplace overview',
      '',
      '## Summary',
      '',
      '| Metric | Value |',
      '|--------|-------|',
      `| Active Stores | ${activeStores.length} |`,
      `| Active Products | ${activeProducts.length} |`,
      `| Total Orders | ${orders.length} |`,
      `| Total Revenue | ${formatCurrency(totalRevenue)} |`,
      `| Pending Orders | ${pendingOrders.length} |`,
      '',
      '## Top Stores',
      '',
      '| Store | Products | Rating | Status |',
      '|-------|----------|--------|--------|',
    ];

    for (const store of stores.slice(0, 5)) {
      lines.push(
        `| ${store.name} | ${store.productCount} | ⭐ ${store.rating || 'N/A'} | ${store.status} |`
      );
    }

    lines.push('');
    lines.push('## Recent Orders');
    lines.push('');
    lines.push('| Order | Items | Total | Status | Date |');
    lines.push('|-------|-------|-------|--------|------|');

    for (const order of orders.slice(0, 10)) {
      const date = new Date(order.createdAt).toLocaleDateString();
      lines.push(
        `| ${order.id} | ${order.itemCount} | ${formatCurrency(order.total, order.currency)} | ${order.status} | ${date} |`
      );
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

/**
 * Markdown renderer for Product Catalog
 */
export const productCatalogMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc) => {
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'ProductCatalog'
    ) {
      throw new Error('productCatalogMarkdownRenderer: not ProductCatalog');
    }

    const products = mockProducts;
    const stores = mockStores;

    const lines: string[] = [
      '# Product Catalog',
      '',
      '> Browse products across all marketplace stores',
      '',
    ];

    // Group by store
    for (const store of stores.filter((s) => s.status === 'ACTIVE')) {
      const storeProducts = products.filter((p) => p.storeId === store.id);

      if (storeProducts.length === 0) continue;

      lines.push(`## ${store.name}`);
      lines.push('');
      lines.push('| Product | Price | Stock | Status |');
      lines.push('|---------|-------|-------|--------|');

      for (const product of storeProducts) {
        const stockStatus =
          product.stock > 0 ? `${product.stock} in stock` : 'Out of stock';
        lines.push(
          `| ${product.name} | ${formatCurrency(product.price, product.currency)} | ${stockStatus} | ${product.status} |`
        );
      }

      lines.push('');
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

/**
 * Markdown renderer for Order List
 */
export const orderListMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc) => {
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'OrderList'
    ) {
      throw new Error('orderListMarkdownRenderer: not OrderList');
    }

    const orders = mockOrders;
    const stores = mockStores;

    const lines: string[] = [
      '# Orders',
      '',
      '> Manage marketplace orders',
      '',
      '| Order ID | Store | Items | Total | Status | Created |',
      '|----------|-------|-------|-------|--------|---------|',
    ];

    for (const order of orders) {
      const store = stores.find((s) => s.id === order.storeId);
      const date = new Date(order.createdAt).toLocaleDateString();
      lines.push(
        `| ${order.id} | ${store?.name ?? 'Unknown'} | ${order.itemCount} | ${formatCurrency(order.total, order.currency)} | ${order.status} | ${date} |`
      );
    }

    lines.push('');
    lines.push('## Order Status Legend');
    lines.push('');
    lines.push('- **PENDING**: Awaiting payment confirmation');
    lines.push('- **PROCESSING**: Being prepared');
    lines.push('- **SHIPPED**: In transit');
    lines.push('- **DELIVERED**: Order completed');
    lines.push('- **CANCELLED**: Order cancelled');

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};
