import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import { defineDataView } from '@contractspec/lib.contracts-spec/data-views';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
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
