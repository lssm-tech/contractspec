import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import { defineDataView } from '@contractspec/lib.contracts-spec/data-views';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useListCoordinator } from './index';
import { useContractTable } from './useContractTable';
import { useDataViewTable } from './useDataViewTable';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://table.contractspec.local/tests',
	});
	Object.defineProperty(windowInstance, 'SyntaxError', {
		value: SyntaxError,
		configurable: true,
	});
	const encodeURIComponentFromGlobal =
		globalThis.encodeURIComponent.bind(globalThis);
	const decodeURIComponentFromGlobal =
		globalThis.decodeURIComponent.bind(globalThis);
	Object.assign(windowInstance, {
		encodeURIComponent: encodeURIComponentFromGlobal,
		decodeURIComponent: decodeURIComponentFromGlobal,
	});
	Object.assign(globalThis, {
		window: windowInstance,
		document: windowInstance.document,
		navigator: windowInstance.navigator,
		location: windowInstance.location,
		HTMLElement: windowInstance.HTMLElement,
		HTMLButtonElement: windowInstance.HTMLButtonElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		MouseEvent: windowInstance.MouseEvent,
		MutationObserver: windowInstance.MutationObserver,
		DocumentFragment: windowInstance.DocumentFragment,
		getComputedStyle: windowInstance.getComputedStyle.bind(windowInstance),
		requestAnimationFrame: (callback: FrameRequestCallback) =>
			setTimeout(() => callback(Date.now()), 0),
		cancelAnimationFrame: (id: number) => clearTimeout(id),
		IS_REACT_ACT_ENVIRONMENT: true,
	});
});

afterEach(() => {
	document.body.innerHTML = '';
});

const DATA_VIEW_SPEC = defineDataView({
	meta: {
		key: 'tests.accounts.table',
		version: '1.0.0',
		entity: 'account',
		title: 'Accounts',
		description: 'Test spec',
		domain: 'tests',
		owners: ['@tests'],
		tags: ['table'],
		stability: 'experimental',
	},
	source: {
		primary: { key: 'tests.accounts.list', version: '1.0.0' },
	},
	view: {
		kind: 'table',
		columnVisibility: true,
		columnResizing: true,
		columnPinning: true,
		rowExpansion: { fields: ['notes'] },
		initialState: {
			pinnedColumns: {
				left: ['account'],
				right: ['status'],
			},
			expandedRowIds: ['acct-1'],
			hiddenColumns: ['notes'],
			sorting: [{ field: 'account', desc: false }],
		},
		fields: [
			{ key: 'account', label: 'Account', dataPath: 'account', sortable: true },
			{ key: 'status', label: 'Status', dataPath: 'status', sortable: true },
			{ key: 'notes', label: 'Notes', dataPath: 'notes' },
		],
	},
});

const BASE_ROWS = [
	{ id: 'acct-1', account: 'Northwind', status: 'healthy', notes: 'A' },
	{ id: 'acct-2', account: 'Aster', status: 'risk', notes: 'B' },
] as const;

const OVERFLOW_DATA_VIEW_SPEC = defineDataView({
	meta: {
		key: 'tests.accounts.overflow',
		version: '1.0.0',
		entity: 'account',
		title: 'Overflow Accounts',
		description: 'Overflow test spec',
		domain: 'tests',
		owners: ['@tests'],
		tags: ['table'],
		stability: 'experimental',
	},
	source: {
		primary: { key: 'tests.accounts.list', version: '1.0.0' },
	},
	view: {
		kind: 'table',
		columnVisibility: true,
		fields: [
			{ key: 'account', label: 'Account', dataPath: 'account', format: 'text' },
			{
				key: 'status',
				label: 'Status',
				dataPath: 'status',
				format: 'badge',
				overflow: 'expand',
			},
			{
				key: 'notes',
				label: 'Notes',
				dataPath: 'notes',
				format: 'markdown',
			},
		],
		columns: [
			{ field: 'account' },
			{ field: 'status', overflow: 'wrap' },
			{ field: 'notes', overflow: 'hideColumn' },
		],
	},
});

interface ControllerHarnessProps {
	onReady: (
		controller: ReturnType<typeof useContractTable<(typeof BASE_ROWS)[number]>>
	) => void;
	rows: readonly (typeof BASE_ROWS)[number][];
}

function ControllerHarness({ onReady, rows }: ControllerHarnessProps) {
	const controller = useContractTable({
		data: rows,
		columns: [
			{
				id: 'account',
				header: 'Account',
				accessorKey: 'account',
			},
			{
				id: 'status',
				header: 'Status',
				accessorKey: 'status',
			},
		],
		selectionMode: 'single',
		initialState: {
			rowSelection: { 'acct-1': true },
			expanded: { 'acct-1': true },
		},
		renderExpandedContent: () => 'Expanded',
		getCanExpand: () => true,
	});

	React.useEffect(() => {
		onReady(controller);
	}, [controller, onReady]);

	return null;
}

interface ColumnControllerHarnessProps {
	onReady: (
		controller: ReturnType<typeof useContractTable<(typeof BASE_ROWS)[number]>>
	) => void;
	columns: {
		id: string;
		header: string;
		accessorKey: 'account' | 'status';
	}[];
}

function ColumnControllerHarness({
	onReady,
	columns,
}: ColumnControllerHarnessProps) {
	const controller = useContractTable({
		data: BASE_ROWS,
		columns,
	});

	React.useEffect(() => {
		onReady(controller);
	}, [controller, onReady]);

	return null;
}

interface PaginationHarnessProps {
	onReady: (
		controller: ReturnType<typeof useContractTable<(typeof BASE_ROWS)[number]>>
	) => void;
	totalItems: number;
}

function PaginationHarness({ onReady, totalItems }: PaginationHarnessProps) {
	const controller = useContractTable({
		data: BASE_ROWS.slice(0, Math.min(totalItems, BASE_ROWS.length)),
		columns: [
			{
				id: 'account',
				header: 'Account',
				accessorKey: 'account',
			},
			{
				id: 'status',
				header: 'Status',
				accessorKey: 'status',
			},
		],
		executionMode: 'server',
		totalItems,
		initialState: {
			pagination: { pageIndex: 2, pageSize: 2 },
		},
	});

	React.useEffect(() => {
		onReady(controller);
	}, [controller, onReady]);

	return null;
}

interface DataViewHarnessProps {
	onReady: (
		controller: ReturnType<typeof useDataViewTable<(typeof BASE_ROWS)[number]>>
	) => void;
}

function DataViewHarness({ onReady }: DataViewHarnessProps) {
	const controller = useDataViewTable({
		spec: DATA_VIEW_SPEC,
		data: BASE_ROWS,
		initialState: {
			columnPinning: {
				left: ['status'],
				right: ['account'],
			},
		},
	});

	React.useEffect(() => {
		onReady(controller);
	}, [controller, onReady]);

	return null;
}

function OverflowDataViewHarness({ onReady }: DataViewHarnessProps) {
	const controller = useDataViewTable({
		spec: OVERFLOW_DATA_VIEW_SPEC,
		data: BASE_ROWS,
		initialState: {
			expanded: { 'acct-1': true },
		},
	});

	React.useEffect(() => {
		onReady(controller);
	}, [controller, onReady]);

	return null;
}

interface PostFilters extends Record<string, unknown> {
	status?: string;
	categoryId?: string;
}

interface ListCoordinatorHarnessProps {
	onReady: (
		controller: ReturnType<typeof useListCoordinator<PostFilters, unknown>>
	) => void;
}

function useMemoryUrlState({
	defaults,
}: {
	defaults: {
		q: string;
		page: number;
		limit: number;
		sort?: string | null;
		filters: PostFilters;
	};
}) {
	const [state, setStateValue] = React.useState(defaults);
	const setState = React.useCallback(
		(next: Partial<typeof defaults>) =>
			setStateValue((current) => ({ ...current, ...next })),
		[]
	);
	const setFilter = React.useCallback(
		(key: keyof PostFilters, value: PostFilters[keyof PostFilters] | null) =>
			setStateValue((current) => ({
				...current,
				filters: { ...current.filters, [key]: value },
			})),
		[]
	);
	const clearFilters = React.useCallback(
		() => setStateValue((current) => ({ ...current, filters: {} })),
		[]
	);

	return { state, setState, setFilter, clearFilters };
}

function ListCoordinatorHarness({ onReady }: ListCoordinatorHarnessProps) {
	const controller = useListCoordinator<PostFilters, unknown>({
		defaults: {
			q: '',
			page: 1,
			limit: 20,
			filters: { status: 'draft', categoryId: 'cat_2' },
		},
		form: { defaultValues: {} },
		filterScope: {
			initial: { status: 'published' },
			locked: { categoryId: 'cat_1' },
		},
		toVariables: (state) => state,
		toChips: (filters) =>
			Object.entries(filters).map(([key, value]) => ({
				key,
				label: `${key}: ${String(value)}`,
			})),
		useUrlState: useMemoryUrlState,
	});

	React.useEffect(() => {
		onReady(controller);
	}, [controller, onReady]);

	return null;
}

async function renderNode(node: React.ReactElement) {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);

	act(() => {
		root.render(node);
	});

	return { root };
}

describe('table hooks', () => {
	test('useListCoordinator keeps locked filters effective but not user-editable', async () => {
		let controllerRef:
			| ReturnType<typeof useListCoordinator<PostFilters, unknown>>
			| undefined;

		const { root } = await renderNode(
			<ListCoordinatorHarness
				onReady={(controller) => {
					controllerRef = controller;
				}}
			/>
		);

		expect(controllerRef?.variables).toMatchObject({
			filters: { status: 'draft', categoryId: 'cat_1' },
		});
		expect(controllerRef?.chips.map((chip) => chip.key)).toEqual(['status']);

		act(() => {
			controllerRef?.clearAll();
		});
		await act(async () => {});

		expect(controllerRef?.variables).toMatchObject({
			filters: { categoryId: 'cat_1' },
		});

		await act(async () => {
			root.unmount();
		});
	});

	test('useDataViewTable lets caller pinning override spec defaults', async () => {
		let controllerRef:
			| ReturnType<typeof useDataViewTable<(typeof BASE_ROWS)[number]>>
			| undefined;

		const { root } = await renderNode(
			<DataViewHarness onReady={(controller) => (controllerRef = controller)} />
		);

		const accountColumn = controllerRef?.columns.find(
			(column) => column.id === 'account'
		);
		const statusColumn = controllerRef?.columns.find(
			(column) => column.id === 'status'
		);

		expect(accountColumn?.pinState).toBe('right');
		expect(statusColumn?.pinState).toBe('left');

		await act(async () => {
			root.unmount();
		});
	});

	test('useDataViewTable resolves overflow defaults, overrides, and hidden columns', async () => {
		let controllerRef:
			| ReturnType<typeof useDataViewTable<(typeof BASE_ROWS)[number]>>
			| undefined;

		const { root } = await renderNode(
			<OverflowDataViewHarness
				onReady={(controller) => (controllerRef = controller)}
			/>
		);

		const accountColumn = controllerRef?.columns.find(
			(column) => column.id === 'account'
		);
		const statusColumn = controllerRef?.columns.find(
			(column) => column.id === 'status'
		);
		const notesColumn = controllerRef?.columns.find(
			(column) => column.id === 'notes'
		);
		const accountCell = controllerRef?.rows[0]?.cells.find(
			(cell) => cell.columnId === 'account'
		);
		const statusCell = controllerRef?.rows[0]?.cells.find(
			(cell) => cell.columnId === 'status'
		);

		expect(accountColumn?.overflow).toBe('truncate');
		expect(accountCell?.overflow).toBe('truncate');
		expect(statusColumn?.overflow).toBe('wrap');
		expect(statusCell?.overflow).toBe('wrap');
		expect(notesColumn?.overflow).toBe('truncate');
		expect(notesColumn?.visible).toBe(false);
		expect(controllerRef?.visibleColumns.map((column) => column.id)).toEqual([
			'account',
			'status',
		]);

		await act(async () => {
			root.unmount();
		});
	});

	test('useDataViewTable expands fields with expand overflow behavior', async () => {
		const expandSpec = defineDataView({
			...OVERFLOW_DATA_VIEW_SPEC,
			view: {
				...OVERFLOW_DATA_VIEW_SPEC.view,
				columns: [
					{ field: 'account' },
					{ field: 'status' },
					{ field: 'notes', overflow: 'expand' },
				],
			},
		});
		let controllerRef:
			| ReturnType<typeof useDataViewTable<(typeof BASE_ROWS)[number]>>
			| undefined;

		function ExpandHarness() {
			const controller = useDataViewTable({
				spec: expandSpec,
				data: BASE_ROWS,
				initialState: {
					expanded: { 'acct-1': true },
				},
				renderExpandedContent: ({ fields }) =>
					fields.map((field) => field.key).join(','),
			});

			React.useEffect(() => {
				controllerRef = controller;
			}, [controller]);

			return null;
		}

		const { root } = await renderNode(<ExpandHarness />);

		expect(
			controllerRef?.columns.find((column) => column.id === 'notes')?.overflow
		).toBe('expand');
		expect(controllerRef?.rows[0]?.canExpand).toBe(true);
		expect(controllerRef?.rows[0]?.expandedContent).toBe('status,notes');

		await act(async () => {
			root.unmount();
		});
	});

	test('useContractTable prunes stale expansion and selection after row-id changes', async () => {
		let controllerRef:
			| ReturnType<typeof useContractTable<(typeof BASE_ROWS)[number]>>
			| undefined;
		const onReady = (controller: typeof controllerRef) => {
			controllerRef = controller ?? undefined;
		};

		const container = document.createElement('div');
		document.body.append(container);
		const root: Root = createRoot(container);

		act(() => {
			root.render(<ControllerHarness onReady={onReady} rows={BASE_ROWS} />);
		});

		expect(controllerRef?.selectedRowIds).toEqual(['acct-1']);
		expect(
			controllerRef?.rows.find((row) => row.id === 'acct-1')?.isExpanded
		).toBe(true);

		act(() => {
			root.render(
				<ControllerHarness onReady={onReady} rows={[BASE_ROWS[1]]} />
			);
		});

		expect(controllerRef?.selectedRowIds).toEqual([]);
		expect(
			controllerRef?.rows.some((row) => row.id === 'acct-1' && row.isExpanded)
		).toBe(false);

		await act(async () => {
			root.unmount();
		});
	});

	test('useContractTable keeps string headers and cells as primitive content', async () => {
		let controllerRef:
			| ReturnType<typeof useContractTable<(typeof BASE_ROWS)[number]>>
			| undefined;
		const onReady = (controller: typeof controllerRef) => {
			controllerRef = controller ?? undefined;
		};

		const { root } = await renderNode(
			<ControllerHarness onReady={onReady} rows={BASE_ROWS} />
		);

		expect(
			controllerRef?.columns.find((column) => column.id === 'account')?.header
		).toBe('Account');
		expect(
			controllerRef?.rows[0]?.cells.find((cell) => cell.columnId === 'account')
				?.content
		).toBe('Northwind');
		expect(controllerRef?.rows[0]?.expandedContent).toBe('Expanded');

		await act(async () => {
			root.unmount();
		});
	});

	test('useContractTable prunes stale visibility and pinning after columns disappear', async () => {
		let controllerRef:
			| ReturnType<typeof useContractTable<(typeof BASE_ROWS)[number]>>
			| undefined;
		const onReady = (controller: typeof controllerRef) => {
			controllerRef = controller ?? undefined;
		};

		const container = document.createElement('div');
		document.body.append(container);
		const root: Root = createRoot(container);
		const fullColumns = [
			{ id: 'account', header: 'Account', accessorKey: 'account' as const },
			{ id: 'status', header: 'Status', accessorKey: 'status' as const },
		];

		act(() => {
			root.render(
				<ColumnControllerHarness onReady={onReady} columns={fullColumns} />
			);
		});

		act(() => {
			controllerRef?.columns
				.find((column) => column.id === 'status')
				?.toggleVisibility?.(false);
		});
		await act(async () => {});
		act(() => {
			controllerRef?.columns
				.find((column) => column.id === 'status')
				?.pin?.('right');
		});
		await act(async () => {});

		expect(controllerRef?.visibleColumns.map((column) => column.id)).toEqual([
			'account',
		]);
		expect(
			controllerRef?.columns.find((column) => column.id === 'status')?.pinState
		).toBe('right');

		act(() => {
			root.render(
				<ColumnControllerHarness
					onReady={onReady}
					columns={[fullColumns[0]!]}
				/>
			);
		});
		await act(async () => {});

		expect(controllerRef?.visibleColumns.map((column) => column.id)).toEqual([
			'account',
		]);

		act(() => {
			root.render(
				<ColumnControllerHarness onReady={onReady} columns={fullColumns} />
			);
		});
		await act(async () => {});

		expect(controllerRef?.visibleColumns.map((column) => column.id)).toEqual([
			'account',
			'status',
		]);
		expect(
			controllerRef?.columns.find((column) => column.id === 'status')?.pinState
		).toBe(false);

		await act(async () => {
			root.unmount();
		});
	});

	test('useContractTable clamps server pagination when totals shrink', async () => {
		let controllerRef:
			| ReturnType<typeof useContractTable<(typeof BASE_ROWS)[number]>>
			| undefined;
		const onReady = (controller: typeof controllerRef) => {
			controllerRef = controller ?? undefined;
		};

		const container = document.createElement('div');
		document.body.append(container);
		const root: Root = createRoot(container);

		act(() => {
			root.render(<PaginationHarness onReady={onReady} totalItems={6} />);
		});

		expect(controllerRef?.pageIndex).toBe(2);
		expect(controllerRef?.pageCount).toBe(3);

		act(() => {
			root.render(<PaginationHarness onReady={onReady} totalItems={2} />);
		});

		expect(controllerRef?.pageIndex).toBe(0);
		expect(controllerRef?.pageCount).toBe(1);
		expect(controllerRef?.canNextPage).toBe(false);

		await act(async () => {
			root.unmount();
		});
	});
});
