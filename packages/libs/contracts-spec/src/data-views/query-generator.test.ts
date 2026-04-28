import { describe, expect, it } from 'bun:test';
import { DataViewQueryGenerator } from './query-generator';
import type { DataViewSpec } from './spec';

const spec: DataViewSpec = {
	meta: {
		key: 'accounts.table',
		version: '1.0.0',
		title: 'Accounts',
		description: 'Account table',
		stability: 'stable',
		owners: ['team.ops'],
		tags: ['accounts'],
		entity: 'account',
	},
	source: {
		primary: { key: 'accounts.list', version: '1.0.0' },
	},
	view: {
		kind: 'table',
		fields: [
			{ key: 'amount', label: 'Amount', dataPath: 'amount', sortable: true },
			{ key: 'openedAt', label: 'Opened', dataPath: 'openedAt' },
		],
		filters: [
			{
				key: 'amount',
				label: 'Amount',
				field: 'amount',
				type: 'currency',
				valueMode: 'range',
			},
			{
				key: 'completion',
				label: 'Completion',
				field: 'completionRatio',
				type: 'percent',
			},
			{
				key: 'openedAt',
				label: 'Opened',
				field: 'openedAt',
				type: 'datetime',
			},
			{
				key: 'active',
				label: 'Active',
				field: 'active',
				type: 'boolean',
			},
		],
	},
};

describe('DataViewQueryGenerator', () => {
	it('validates typed numeric, temporal, and boolean filter values', () => {
		const generator = new DataViewQueryGenerator(spec);

		expect(
			generator.validateParams({
				filters: {
					amount: { kind: 'range', from: 10, to: 50 },
					completion: { kind: 'single', value: 0.42 },
					openedAt: { kind: 'single', value: '2026-04-28T08:30:00Z' },
					active: { kind: 'single', value: true },
				},
			})
		).toEqual([]);

		expect(
			generator.validateParams({
				filters: {
					amount: { kind: 'range', from: '10' },
					completion: { kind: 'single', value: '42' },
					openedAt: { kind: 'single', value: true },
					active: { kind: 'single', value: 'true' },
				},
			})
		).toEqual([
			'Filter must be numeric: amount',
			'Filter must be numeric: completion',
			'Filter must be comparable: openedAt',
			'Filter must be boolean: active',
		]);
	});
});
