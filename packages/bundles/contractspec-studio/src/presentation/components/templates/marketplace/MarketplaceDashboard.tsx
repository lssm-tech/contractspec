'use client';

/**
 * Marketplace Dashboard
 *
 * Interactive dashboard for the marketplace template.
 * Displays stores, products, and orders with stats.
 */
import { useState } from 'react';
import {
  Button,
  ErrorState,
  LoaderBlock,
  StatCard,
  StatCardGroup,
} from '@lssm/lib.design-system';
import { useMarketplaceData } from './hooks/useMarketplaceData';

type Tab = 'stores' | 'products' | 'orders';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  PENDING:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  SUSPENDED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  DRAFT: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  OUT_OF_STOCK:
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  ARCHIVED: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PROCESSING:
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  SHIPPED:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  DELIVERED:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function MarketplaceDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('stores');
  const { stores, products, orders, loading, error, stats, refetch } =
    useMarketplaceData();

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'stores', label: 'Stores', icon: '🏪' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
  ];

  if (loading) {
    return <LoaderBlock label="Loading Marketplace..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load Marketplace"
        description={error.message}
        onRetry={refetch}
        retryLabel="Retry"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Marketplace</h2>
        <Button onClick={() => alert('Create store modal')}>
          <span className="mr-2">+</span> New Store
        </Button>
      </div>

      {/* Stats Row */}
      <StatCardGroup>
        <StatCard
          label="Stores"
          value={stats.totalStores}
          hint={`${stats.activeStores} active`}
        />
        <StatCard label="Products" value={stats.totalProducts} hint="listed" />
        <StatCard
          label="Orders"
          value={stats.totalOrders}
          hint={`${stats.pendingOrders} pending`}
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          hint="total"
        />
      </StatCardGroup>

      {/* Navigation Tabs */}
      <nav className="bg-muted flex gap-1 rounded-lg p-1" role="tablist">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </Button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="min-h-[400px]" role="tabpanel">
        {activeTab === 'stores' && (
          <div className="border-border rounded-lg border">
            <table className="w-full">
              <thead className="border-border bg-muted/30 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Store
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Reviews
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{store.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {store.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[store.status] ?? ''}`}
                      >
                        {store.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        ⭐ {store.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {store.reviewCount} reviews
                    </td>
                  </tr>
                ))}
                {stores.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-muted-foreground px-4 py-8 text-center"
                    >
                      No stores found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="border-border rounded-lg border">
            <table className="w-full">
              <thead className="border-border bg-muted/30 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {product.category}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {formatCurrency(product.price, product.currency)}
                    </td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[product.status] ?? ''}`}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-muted-foreground px-4 py-8 text-center"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="border-border rounded-lg border">
            <table className="w-full">
              <thead className="border-border bg-muted/30 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-mono text-sm">{order.id}</td>
                    <td className="px-4 py-3 text-sm">{order.customerId}</td>
                    <td className="px-4 py-3 font-mono">
                      {formatCurrency(order.total, order.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] ?? ''}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {order.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-muted-foreground px-4 py-8 text-center"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


