import { describe, expect, it } from 'bun:test';
import { createMarketplaceVisualizationItems } from './selectors';

describe('marketplace visualization selectors', () => {
	it('creates visualizations from products and orders', () => {
		const items = createMarketplaceVisualizationItems(
			[
				{ category: 'Hardware', price: 100, stock: 4 },
				{ category: 'Hardware', price: 50, stock: 6 },
			],
			[
				{ status: 'PENDING', total: 100, createdAt: '2026-03-18T10:00:00Z' },
				{
					status: 'DELIVERED',
					total: 200,
					createdAt: '2026-03-19T10:00:00Z',
				},
			]
		);

		expect(items).toHaveLength(3);
		expect(items[1]?.title).toBe('Category Value Comparison');
	});
});
