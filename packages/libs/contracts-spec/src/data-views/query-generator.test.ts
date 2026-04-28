import { describe, expect, it } from 'bun:test';
import { DataViewQueryGenerator } from './query-generator';
import type { DataViewSpec } from './spec';
import type { DataViewTableConfig } from './types';

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
	const tableView = spec.view as DataViewTableConfig;

	it('uses caller pagination before collection pagination defaults', () => {
		const generator = new DataViewQueryGenerator({
			...spec,
			view: {
				...tableView,
				collection: {
					pagination: { pageSize: 40 },
				},
			},
		});

		expect(
			generator.generate({ pagination: { page: 2, pageSize: 10 } })
		).toMatchObject({
			input: { skip: 10, take: 10 },
			meta: { pagination: { page: 2, pageSize: 10, skip: 10, take: 10 } },
		});
	});

	it('uses collection pagination as the default page size', () => {
		const generator = new DataViewQueryGenerator({
			...spec,
			view: {
				...tableView,
				collection: {
					pagination: { pageSize: 40 },
				},
			},
		});

		expect(generator.generate({})).toMatchObject({
			input: { skip: 0, take: 40 },
			meta: { pagination: { page: 1, pageSize: 40, skip: 0, take: 40 } },
		});
	});

	it('does not use table initial state as a query page size default', () => {
		const generator = new DataViewQueryGenerator({
			...spec,
			view: {
				...tableView,
				initialState: { pageSize: 50 },
			},
		});

		expect(generator.generate({})).toMatchObject({
			input: { skip: 0, take: 20 },
			meta: { pagination: { page: 1, pageSize: 20, skip: 0, take: 20 } },
		});
	});

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
