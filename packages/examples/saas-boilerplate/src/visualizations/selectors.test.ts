import { describe, expect, it } from 'bun:test';
import { createSaasVisualizationItems } from './selectors';

describe('saas visualization selectors', () => {
	it('creates dashboard visualization items', () => {
		const items = createSaasVisualizationItems(
			[
				{
					status: 'ACTIVE',
					tier: 'PRO',
					createdAt: '2026-03-18T10:00:00Z',
				},
				{
					status: 'DRAFT',
					tier: 'FREE',
					createdAt: '2026-03-19T10:00:00Z',
				},
			],
			10
		);

		expect(items).toHaveLength(4);
		expect(items[0]?.title).toBe('Project Capacity');
	});
});
