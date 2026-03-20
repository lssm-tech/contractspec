import type { VisualizationSurfaceItem } from '@contractspec/lib.design-system';
import type { Order, Product } from '../handlers/marketplace.handlers';
import {
	MarketplaceCategoryValueVisualization,
	MarketplaceOrderActivityVisualization,
	MarketplaceOrderStatusVisualization,
} from './catalog';

type DateLike = Date | string;

interface OrderLike extends Pick<Order, 'status' | 'total'> {
	createdAt: DateLike;
}

interface ProductLike extends Pick<Product, 'price' | 'stock'> {
	category?: string | null;
}

function toDayKey(value: DateLike): string {
	const date = value instanceof Date ? value : new Date(value);
	return date.toISOString().slice(0, 10);
}

export function createMarketplaceVisualizationItems(
	products: ProductLike[],
	orders: OrderLike[]
): VisualizationSurfaceItem[] {
	const orderStatus = new Map<string, number>();
	const orderActivity = new Map<string, number>();
	const categoryValue = new Map<string, number>();

	for (const order of orders) {
		orderStatus.set(order.status, (orderStatus.get(order.status) ?? 0) + 1);
		const day = toDayKey(order.createdAt);
		orderActivity.set(day, (orderActivity.get(day) ?? 0) + 1);
	}

	for (const product of products) {
		const category = product.category ?? 'Uncategorized';
		categoryValue.set(
			category,
			(categoryValue.get(category) ?? 0) + product.price * product.stock
		);
	}

	return [
		{
			key: 'marketplace-order-status',
			spec: MarketplaceOrderStatusVisualization,
			data: {
				data: Array.from(orderStatus.entries()).map(([status, count]) => ({
					status,
					orders: count,
				})),
			},
			title: 'Order Status Breakdown',
			description: 'Status mix across the current order set.',
			height: 260,
		},
		{
			key: 'marketplace-category-value',
			spec: MarketplaceCategoryValueVisualization,
			data: {
				data: Array.from(categoryValue.entries())
					.sort(([, left], [, right]) => right - left)
					.map(([category, value]) => ({
						category,
						catalogValue: value,
					})),
			},
			title: 'Category Value Comparison',
			description: 'Derived from current product pricing and stock.',
		},
		{
			key: 'marketplace-order-activity',
			spec: MarketplaceOrderActivityVisualization,
			data: {
				data: Array.from(orderActivity.entries())
					.sort(([left], [right]) => left.localeCompare(right))
					.map(([day, count]) => ({ day, orders: count })),
			},
			title: 'Recent Order Activity',
			description: 'Daily order count from current order history.',
		},
	];
}
