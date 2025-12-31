'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  Order,
  Product,
  Store,
} from '../../handlers/marketplace.handlers';
import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';

export interface MarketplaceStats {
  totalStores: number;
  activeStores: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export function useMarketplaceData(projectId = 'local-project') {
  const { handlers } = useTemplateRuntime();
  const marketplace = handlers.marketplace;
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [storeResult, productResult, orderResult] = await Promise.all([
        handlers.listStores({ projectId, limit: 100 }),
        handlers.listProducts({ limit: 100 }),
        handlers.listOrders({ projectId, limit: 100 }),
      ]);

      setStores(storeResult.stores);
      setProducts(productResult.products);
      setOrders(orderResult.orders);
      setTotalRevenue(orderResult.totalRevenue);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load marketplace')
      );
    } finally {
      setLoading(false);
    }
  }, [handlers, projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats: MarketplaceStats = {
    totalStores: stores.length,
    activeStores: stores.filter((s) => s.status === 'ACTIVE').length,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders: orders.filter((o) => o.status === 'PENDING').length,
  };

  return {
    stores,
    products,
    orders,
    loading,
    error,
    stats,
    refetch: fetchData,
  };
}
