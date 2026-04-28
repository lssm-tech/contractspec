import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { DataViewRenderer } from './DataViewRenderer';

const tableSpec = {
	meta: {
		key: 'accounts.table',
		version: '1.0.0',
		title: 'Accounts',
		description: 'Account table',
		domain: 'accounts',
		entity: 'account',
		owners: ['@team.ops'],
	},
	source: {
		primary: { key: 'accounts.list', version: '1.0.0' },
	},
	view: {
		kind: 'table',
		filters: [
			{
				key: 'status',
				label: 'Status',
				field: 'status',
				type: 'enum',
				options: [{ value: 'healthy', label: 'Healthy' }],
			},
			{
				key: 'account',
				label: 'Account',
				field: 'account',
				type: 'search',
			},
			{
				key: 'amount',
				label: 'Amount',
				field: 'amount',
				type: 'currency',
				valueMode: 'range',
			},
			{
				key: 'ratio',
				label: 'Ratio',
				field: 'ratio',
				type: 'percent',
			},
			{
				key: 'elapsed',
				label: 'Elapsed',
				field: 'elapsedMinutes',
				type: 'duration',
			},
		],
		fields: [
			{
				key: 'account',
				label: 'Account',
				dataPath: 'account',
				sortable: true,
				overflow: 'truncate',
			},
			{
				key: 'amount',
				label: 'Amount',
				dataPath: 'amount',
				format: { type: 'currency', currency: 'EUR', rounded: true },
				overflow: 'none',
			},
			{
				key: 'ratio',
				label: 'Ratio',
				dataPath: 'ratio',
				format: { type: 'percent', maximumFractionDigits: 1 },
			},
			{
				key: 'elapsed',
				label: 'Elapsed',
				dataPath: 'elapsedMinutes',
				format: { type: 'duration', unit: 'minute', display: 'digital' },
				overflow: 'wrap',
			},
		],
	},
} as const;

const scopedTableSpec = {
	...tableSpec,
	view: {
		...tableSpec.view,
		filterScope: {
			locked: {
				status: { kind: 'single', value: 'healthy' },
			},
		},
	},
} as const;

const hiddenLockedTableSpec = {
	...tableSpec,
	view: {
		...tableSpec.view,
		filterScope: {
			locked: {
				status: { kind: 'single', value: 'healthy' },
			},
			lockedChips: 'hidden',
		},
	},
} as const;

const initialTableSpec = {
	...tableSpec,
	view: {
		...tableSpec.view,
		filterScope: {
			initial: {
				status: { kind: 'single', value: 'healthy' },
			},
		},
	},
} as const;

describe('DataViewRenderer table mode', () => {
	it('forwards toolbar/loading and does not duplicate header actions into filters', () => {
		const html = renderToStaticMarkup(
			<DataViewRenderer
				spec={tableSpec}
				items={[
					{
						account: 'Northwind',
						amount: 1234.56,
						ratio: 0.125,
						elapsedMinutes: 61,
					},
				]}
				search=""
				onSearchChange={() => void 0}
				onFilterChange={() => void 0}
				headerActions={<span>Header action</span>}
				toolbar={<span>Toolbar slot</span>}
			/>
		);

		expect(html).toContain('Toolbar slot');
		expect(html).toContain('Header action');
		expect(html.match(/Header action/g)?.length).toBe(1);
		expect(html).toContain('1:01:00');
		expect(html).toContain('12.5%');
		expect(html).toContain('1,235');
		expect(html).toContain('break-words');
		expect(html).toContain('Amount min');
		expect(html).toContain('Ratio');
		expect(html).toContain('Elapsed');
	});

	it('renders locked filter chips as non-removable by default', () => {
		const html = renderToStaticMarkup(
			<DataViewRenderer
				spec={scopedTableSpec}
				items={[{ account: 'Northwind' }]}
			/>
		);

		expect(html).toContain('Status: healthy');
		expect(html).not.toContain('Supprimer le filtre');
		expect(html).not.toContain('Effacer les filtres');
	});

	it('renders initial filter chips as removable user state', () => {
		const html = renderToStaticMarkup(
			<DataViewRenderer
				spec={initialTableSpec}
				items={[{ account: 'Northwind' }]}
				onFilterChange={() => void 0}
			/>
		);

		expect(html).toContain('Status: healthy');
		expect(html).toContain('Supprimer le filtre');
		expect(html).toContain('Effacer les filtres');
	});

	it('hides locked chips when requested and preserves removable user chips', () => {
		const html = renderToStaticMarkup(
			<DataViewRenderer
				spec={hiddenLockedTableSpec}
				items={[{ account: 'Northwind' }]}
				filters={{
					account: { kind: 'single', value: 'Northwind' },
				}}
				onFilterChange={() => void 0}
			/>
		);

		expect(html).not.toContain('Status: healthy');
		expect(html).toContain('Account: Northwind');
		expect(html).toContain('Supprimer le filtre');
	});
});
