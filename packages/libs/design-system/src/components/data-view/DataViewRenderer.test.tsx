import { describe, expect, it } from 'bun:test';
import type { DataViewSpec } from '@contractspec/lib.contracts-spec/data-views';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	projectCollectionDataDepth,
	resolveCollectionDataDepth,
	resolveCollectionView,
} from './collection';
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
			{
				key: 'internalNotes',
				label: 'Internal Notes',
				dataPath: 'internalNotes',
				visibility: { minDataDepth: 'detailed' },
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

const collectionListSpec = {
	...tableSpec,
	view: {
		kind: 'list',
		primaryField: 'account',
		secondaryFields: ['amount'],
		collection: {
			viewModes: {
				defaultMode: 'grid',
				allowedModes: ['list', 'grid', 'table'],
			},
			toolbar: {
				viewMode: true,
				density: true,
				dataDepth: true,
			},
			density: 'compact',
			dataDepth: 'summary',
		},
		filters: tableSpec.view.filters,
		fields: tableSpec.view.fields,
		actions: [{ key: 'open', label: 'Open', kind: 'navigation' }],
	},
} satisfies DataViewSpec;

const collectionGridSpec = {
	...tableSpec,
	view: {
		kind: 'grid',
		columns: 4,
		primaryField: 'account',
		secondaryFields: ['amount'],
		collection: {
			viewModes: {
				allowedModes: ['grid', 'list'],
			},
		},
		filters: tableSpec.view.filters,
		fields: tableSpec.view.fields,
	},
} satisfies DataViewSpec;

const collectionTableSpec = {
	...tableSpec,
	view: {
		...tableSpec.view,
		collection: {
			viewModes: {
				allowedModes: ['list', 'grid', 'table'],
			},
		},
	},
} satisfies DataViewSpec;

describe('DataViewRenderer table mode', () => {
	it('projects collection modes without mutating the source spec', () => {
		const before = JSON.stringify(collectionListSpec.view);
		const projectedTable = resolveCollectionView(collectionListSpec, 'table');
		const projectedList = resolveCollectionView(collectionTableSpec, 'list');
		const projectedGrid = resolveCollectionView(collectionGridSpec, 'grid');
		const projectedGridList = resolveCollectionView(collectionGridSpec, 'list');

		expect(projectedTable.mode).toBe('table');
		expect(projectedTable.spec.view.kind).toBe('table');
		expect(projectedList.mode).toBe('list');
		expect(projectedList.spec.view.kind).toBe('list');
		expect(projectedList.spec.view.filters).toEqual(tableSpec.view.filters);
		expect(projectedGrid.mode).toBe('grid');
		expect(projectedGrid.spec.view.kind).toBe('grid');
		expect(projectedGridList.mode).toBe('list');
		expect(projectedGridList.spec.view.kind).toBe('list');
		expect(projectedGridList.spec.view.primaryField).toBe('account');
		expect(projectedGridList.spec.view.secondaryFields).toEqual(['amount']);
		expect(JSON.stringify(collectionListSpec.view)).toBe(before);
	});

	it('falls back to the resolved default for disallowed modes', () => {
		const resolved = resolveCollectionView(collectionGridSpec, 'table');

		expect(resolved.allowedModes).toEqual(['list', 'grid']);
		expect(resolved.mode).toBe('grid');
		expect(resolved.spec.view.kind).toBe('grid');
	});

	it('defaults to all modes when toolbar view mode is enabled', () => {
		const resolved = resolveCollectionView({
			...collectionListSpec,
			view: {
				...collectionListSpec.view,
				collection: {
					toolbar: { viewMode: true },
				},
			},
		});

		expect(resolved.allowedModes).toEqual(['list', 'grid', 'table']);
		expect(resolved.mode).toBe('list');
	});

	it('projects collection data depth without mutating the source spec', () => {
		const before = JSON.stringify(collectionTableSpec.view);
		const standard = projectCollectionDataDepth(
			collectionTableSpec,
			'standard'
		);
		const detailed = projectCollectionDataDepth(
			collectionTableSpec,
			'detailed'
		);

		expect(resolveCollectionDataDepth(collectionListSpec)).toBe('summary');
		expect(standard.view.fields.map((field) => field.key)).not.toContain(
			'internalNotes'
		);
		expect(detailed.view.fields.map((field) => field.key)).toContain(
			'internalNotes'
		);
		expect(JSON.stringify(collectionTableSpec.view)).toBe(before);
	});

	it('renders collection view controls only for multi-mode collections', () => {
		const html = renderToStaticMarkup(
			<DataViewRenderer
				spec={collectionListSpec}
				items={[{ account: 'Northwind', amount: 1234.56 }]}
				headerActions={<span>Header action</span>}
				renderActions={() => <span>Row action</span>}
				onSearchChange={() => void 0}
				onFilterChange={() => void 0}
			/>
		);

		expect(html).toContain('aria-label="list"');
		expect(html).toContain('aria-label="grid"');
		expect(html).toContain('aria-label="table"');
		expect(html.match(/Header action/g)?.length).toBe(1);
		expect(html).toContain('Row action');
		expect(html).toContain('Compact');
		expect(html).toContain('Summary');
	});

	it('renders controlled data depth from collection specs', () => {
		const standardHtml = renderToStaticMarkup(
			<DataViewRenderer
				spec={collectionTableSpec}
				dataDepth="standard"
				items={[
					{
						account: 'Northwind',
						amount: 1234.56,
						internalNotes: 'Escalated account',
					},
				]}
			/>
		);
		const detailedHtml = renderToStaticMarkup(
			<DataViewRenderer
				spec={collectionTableSpec}
				dataDepth="detailed"
				items={[
					{
						account: 'Northwind',
						amount: 1234.56,
						internalNotes: 'Escalated account',
					},
				]}
			/>
		);

		expect(standardHtml).not.toContain('Internal Notes');
		expect(standardHtml).not.toContain('Escalated account');
		expect(detailedHtml).toContain('Internal Notes');
		expect(detailedHtml).toContain('Escalated account');
	});

	it('honors collection toolbar filter and action visibility config', () => {
		const html = renderToStaticMarkup(
			<DataViewRenderer
				spec={{
					...collectionListSpec,
					view: {
						...collectionListSpec.view,
						collection: {
							...collectionListSpec.view.collection,
							toolbar: {
								...collectionListSpec.view.collection?.toolbar,
								filters: false,
								actions: 'hidden',
							},
						},
					},
				}}
				items={[{ account: 'Northwind', amount: 1234.56 }]}
				headerActions={<span>Header action</span>}
				onFilterChange={() => void 0}
			/>
		);

		expect(html).not.toContain('Amount min');
		expect(html).not.toContain('Header action');
		expect(html).toContain('aria-label="list"');
	});

	it('renders controlled table mode from a list spec', () => {
		const html = renderToStaticMarkup(
			<DataViewRenderer
				spec={collectionListSpec}
				viewMode="table"
				items={[{ account: 'Northwind', amount: 1234.56 }]}
			/>
		);

		expect(html).toContain('Accounts');
		expect(html).toContain('Northwind');
		expect(html).toContain('1,235');
	});

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
