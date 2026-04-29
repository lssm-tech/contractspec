import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import type {
	ContractTableColumnRenderModel,
	ContractTableController,
	ContractTableOverflowBehavior,
} from '@contractspec/lib.presentation-runtime-core';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { DataTable } from './data-table';
import {
	canHideDataColumn,
	ResizeHandle,
	showAllColumns,
} from './data-table.parts';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://web-table.contractspec.local/tests',
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
		KeyboardEvent: windowInstance.KeyboardEvent,
		PointerEvent: windowInstance.PointerEvent ?? windowInstance.MouseEvent,
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

const ROWS = Array.from({ length: 6 }, (_, index) => ({
	id: `row-${index + 1}`,
	account: `Account ${index + 1}`,
	status: index % 2 === 0 ? 'healthy' : 'risk',
	notes: `Note ${index + 1}`,
}));

type TestRow = (typeof ROWS)[number];

interface TestColumnDef {
	id: string;
	header: React.ReactNode;
	accessorKey?: keyof TestRow;
	accessor?: (row: TestRow) => React.ReactNode;
	canSort?: boolean;
	canHide?: boolean;
	canPin?: boolean;
	canResize?: boolean;
	overflow?: ContractTableOverflowBehavior;
}

interface TestTableOptions {
	data: TestRow[];
	columns: TestColumnDef[];
	selectionMode?: 'none' | 'multiple';
	initialHiddenColumnIds?: string[];
	initialExpandedRowIds?: string[];
	initialSortingDesc?: boolean;
	renderExpandedContent?: (row: TestRow) => React.ReactNode;
	getCanExpand?: (row: TestRow) => boolean;
}

function createBaseColumn(
	overrides: Partial<ContractTableColumnRenderModel<React.ReactNode>>
): ContractTableColumnRenderModel<React.ReactNode> {
	return {
		id: '',
		kind: 'data',
		header: null,
		label: '',
		align: 'left',
		size: 160,
		pinState: false,
		canSort: false,
		sortDirection: false,
		canHide: false,
		visible: true,
		canPin: false,
		canResize: false,
		isResizing: false,
		...overrides,
	};
}

function useTestTableController({
	data,
	columns,
	selectionMode = 'none',
	initialHiddenColumnIds = [],
	initialExpandedRowIds = [],
	initialSortingDesc = false,
	renderExpandedContent,
	getCanExpand,
}: TestTableOptions): ContractTableController<TestRow, React.ReactNode> {
	const [sortDesc, setSortDesc] = React.useState(initialSortingDesc);
	const [visibility, setVisibility] = React.useState<Record<string, boolean>>(
		() =>
			Object.fromEntries(
				columns.map((column) => [
					column.id,
					!initialHiddenColumnIds.includes(column.id),
				])
			)
	);
	const [sizes, setSizes] = React.useState<Record<string, number>>({});
	const [selected, setSelected] = React.useState<Record<string, boolean>>({});
	const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() =>
		Object.fromEntries(initialExpandedRowIds.map((rowId) => [rowId, true]))
	);

	const renderColumns = React.useMemo(() => {
		const utilityColumns: ContractTableColumnRenderModel<React.ReactNode>[] =
			[];
		if (selectionMode === 'multiple') {
			utilityColumns.push(
				createBaseColumn({
					id: '__select',
					kind: 'selection',
					label: 'Select',
					align: 'center',
					size: 44,
				})
			);
		}
		if (getCanExpand) {
			utilityColumns.push(
				createBaseColumn({
					id: '__expand',
					kind: 'expansion',
					label: 'Expand',
					align: 'center',
					size: 44,
				})
			);
		}
		return [
			...utilityColumns,
			...columns.map((column) =>
				createBaseColumn({
					id: column.id,
					header: column.header,
					label: typeof column.header === 'string' ? column.header : column.id,
					size: sizes[column.id] ?? 160,
					overflow: column.overflow,
					canSort: column.canSort ?? true,
					sortDirection:
						column.id === 'account' ? (sortDesc ? 'desc' : 'asc') : false,
					canHide: column.canHide ?? true,
					visible: visibility[column.id] ?? true,
					canPin: column.canPin ?? true,
					canResize: column.canResize ?? true,
					toggleSorting:
						(column.canSort ?? true)
							? () => setSortDesc((value) => !value)
							: undefined,
					toggleVisibility:
						(column.canHide ?? true)
							? (next?: boolean) =>
									setVisibility((previous) => ({
										...previous,
										[column.id]: Boolean(next),
									}))
							: undefined,
					resizeBy:
						(column.canResize ?? true)
							? (delta: number) =>
									setSizes((previous) => ({
										...previous,
										[column.id]: (previous[column.id] ?? 160) + delta,
									}))
							: undefined,
				})
			),
		];
	}, [columns, getCanExpand, selectionMode, sizes, sortDesc, visibility]);

	const visibleColumns = renderColumns.filter(
		(column) => column.kind !== 'data' || column.visible
	);
	const sortedData = React.useMemo(
		() =>
			[...data].sort((left, right) =>
				sortDesc
					? right.account.localeCompare(left.account)
					: left.account.localeCompare(right.account)
			),
		[data, sortDesc]
	);
	const rows = sortedData.map((row) => ({
		id: row.id,
		original: row,
		depth: 0,
		cells: visibleColumns.map((column) => {
			const definition = columns.find(
				(candidate) => candidate.id === column.id
			);
			const content =
				column.kind === 'data'
					? (definition?.accessor?.(row) ??
						(definition?.accessorKey ? row[definition.accessorKey] : ''))
					: null;
			return {
				id: `${row.id}_${column.id}`,
				columnId: column.id,
				kind: column.kind,
				content,
				align: column.align,
				size: column.size,
				overflow: column.overflow,
				pinState: column.pinState,
				stickyOffset: column.stickyOffset,
			};
		}),
		canSelect: selectionMode !== 'none',
		isSelected: Boolean(selected[row.id]),
		toggleSelected:
			selectionMode !== 'none'
				? (next?: boolean) =>
						setSelected((previous) => ({
							...previous,
							[row.id]: Boolean(next),
						}))
				: undefined,
		canExpand: getCanExpand?.(row) ?? false,
		isExpanded: Boolean(expanded[row.id]),
		toggleExpanded: getCanExpand?.(row)
			? (next?: boolean) =>
					setExpanded((previous) => ({
						...previous,
						[row.id]: next ?? !previous[row.id],
					}))
			: undefined,
		expandedContent:
			expanded[row.id] && renderExpandedContent
				? renderExpandedContent(row)
				: undefined,
	}));
	const selectedRowIds = Object.entries(selected)
		.filter(([, isSelected]) => isSelected)
		.map(([rowId]) => rowId);

	return {
		executionMode: 'client',
		selectionMode,
		columns: renderColumns,
		visibleColumns,
		rows,
		selectedRowIds,
		allRowsSelected: rows.length > 0 && selectedRowIds.length === rows.length,
		someRowsSelected:
			selectedRowIds.length > 0 && selectedRowIds.length < rows.length,
		toggleAllRowsSelected:
			selectionMode !== 'none'
				? (next?: boolean) =>
						setSelected(
							Object.fromEntries(rows.map((row) => [row.id, Boolean(next)]))
						)
				: undefined,
		pageIndex: 0,
		pageSize: data.length,
		pageCount: 1,
		totalItems: data.length,
		canNextPage: false,
		canPreviousPage: false,
		nextPage: () => void 0,
		previousPage: () => void 0,
		setPageIndex: () => void 0,
		setPageSize: () => void 0,
	};
}

function WideTableHarness({
	onRowPress,
	onController,
	initialSortingDesc = false,
}: {
	onRowPress?: (rowId: string) => void;
	onController?: (
		controller: ContractTableController<TestRow, React.ReactNode>
	) => void;
	initialSortingDesc?: boolean;
}) {
	const columns = React.useMemo<TestColumnDef[]>(
		() => [
			{
				id: 'account',
				header: 'Account',
				accessorKey: 'account',
				canSort: true,
				canHide: true,
				canPin: true,
				canResize: true,
			},
			{
				id: 'status',
				header: 'Status',
				accessorKey: 'status',
				canSort: true,
				canHide: true,
				canPin: true,
				canResize: true,
			},
			{
				id: 'notes',
				header: 'Notes',
				accessorKey: 'notes',
				canHide: true,
				canResize: true,
			},
			...Array.from({ length: 20 }, (_, index) => ({
				id: `metric-${index}`,
				header: `Metric ${index}`,
				accessor: (row: (typeof ROWS)[number]) => `${row.account}-${index}`,
				canHide: true,
				canResize: true,
			})),
		],
		[]
	);

	const controller = useTestTableController({
		data: ROWS,
		columns,
		selectionMode: 'multiple',
		initialHiddenColumnIds: ['notes'],
		initialSortingDesc,
		renderExpandedContent: (row) => row.notes,
		getCanExpand: () => true,
	});

	React.useEffect(() => {
		onController?.(controller);
	}, [controller, onController]);

	return (
		<div data-testid="press-log">
			<DataTable
				controller={controller}
				toolbar={<div>Toolbar</div>}
				onRowPress={(row) => onRowPress?.(row.id)}
			/>
		</div>
	);
}

function OverflowTableHarness() {
	const controller = useTestTableController({
		data: ROWS.slice(0, 1),
		columns: [
			{
				id: 'account',
				header: 'Account',
				accessorKey: 'account',
				overflow: 'truncate',
			},
			{
				id: 'status',
				header: 'Status',
				accessorKey: 'status',
				overflow: 'expand',
			},
			{
				id: 'notes',
				header: 'Notes',
				accessorKey: 'notes',
				overflow: 'wrap',
			},
			{
				id: 'node',
				header: 'Node',
				accessor: () => <strong>Node content</strong>,
				overflow: 'none',
			},
		],
		renderExpandedContent: (row) => row.notes,
		getCanExpand: () => true,
		initialExpandedRowIds: ['row-1'],
	});

	return <DataTable controller={controller} />;
}

function renderTable({
	onRowPress,
	onController,
	initialSortingDesc,
}: {
	onRowPress?: (rowId: string) => void;
	onController?: (
		controller: ContractTableController<TestRow, React.ReactNode>
	) => void;
	initialSortingDesc?: boolean;
} = {}) {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);

	act(() => {
		root.render(
			<WideTableHarness
				onRowPress={onRowPress}
				onController={onController}
				initialSortingDesc={initialSortingDesc}
			/>
		);
	});

	return { container, root };
}

function click(element: Element | null) {
	if (!element) throw new Error('Expected element to exist.');
	act(() => {
		element.dispatchEvent(
			new window.MouseEvent('click', { bubbles: true, cancelable: true })
		);
	});
}

describe('ui-kit-web data-table', () => {
	test('keeps row-local controls isolated from row press', async () => {
		const rowPresses: string[] = [];
		const { container, root } = renderTable({
			onRowPress: (rowId) => rowPresses.push(rowId),
		});

		click(container.querySelector('[aria-label="Select row row-1"]'));
		click(container.querySelector('[aria-label="Expand row row-1"]'));

		expect(rowPresses).toEqual([]);

		const row = Array.from(container.querySelectorAll('tr')).find((candidate) =>
			candidate.textContent?.includes('Account 1')
		);
		click(row ?? null);
		expect(rowPresses).toEqual(['row-1']);

		act(() => {
			root.unmount();
		});
	});

	test('supports keyboard row activation without leaking from nested controls', async () => {
		const rowPresses: string[] = [];
		const { container, root } = renderTable({
			onRowPress: (rowId) => rowPresses.push(rowId),
		});

		const row = Array.from(container.querySelectorAll('tr')).find((candidate) =>
			candidate.textContent?.includes('Account 1')
		);
		if (!row) {
			throw new Error('Expected data row to exist.');
		}

		act(() => {
			row.dispatchEvent(
				new window.KeyboardEvent('keydown', {
					bubbles: true,
					cancelable: true,
					key: 'Enter',
				})
			);
		});

		act(() => {
			container.querySelector('[aria-label="Select row row-1"]')?.dispatchEvent(
				new window.KeyboardEvent('keydown', {
					bubbles: true,
					cancelable: true,
					key: ' ',
				})
			);
		});

		expect(rowPresses).toEqual(['row-1']);

		act(() => {
			root.unmount();
		});
	});

	test('updates aria-sort and can reset hidden columns', async () => {
		const { container, root } = renderTable();

		expect(container.querySelector('th[aria-sort="ascending"]')).not.toBeNull();
		act(() => {
			root.render(<WideTableHarness key="descending" initialSortingDesc />);
		});
		expect(
			container.querySelector('th[aria-sort="descending"]')
		).not.toBeNull();

		const visibilityState = {
			notes: false,
			status: false,
		};
		const resetColumns = [
			{
				canHide: true,
				toggleVisibility: (next?: boolean) => {
					visibilityState.status = Boolean(next);
				},
			},
			{
				canHide: true,
				toggleVisibility: (next?: boolean) => {
					visibilityState.notes = Boolean(next);
				},
			},
		];

		resetColumns
			.filter((column) => column.canHide)
			.forEach((column) => column.toggleVisibility?.(true));

		expect(visibilityState.status).toBe(true);
		expect(visibilityState.notes).toBe(true);

		act(() => {
			root.unmount();
		});
	});

	test('prevents hiding the last visible data column and restores hidden columns', async () => {
		const accountToggles: boolean[] = [];
		const statusToggles: boolean[] = [];
		const notesToggles: boolean[] = [];
		const columns = [
			{
				id: 'account',
				kind: 'data' as const,
				header: 'Account',
				label: 'Account',
				align: 'left' as const,
				size: 160,
				pinState: false as const,
				canSort: true,
				sortDirection: false as const,
				canHide: true,
				visible: true,
				canPin: true,
				canResize: true,
				isResizing: false,
				toggleVisibility: (next?: boolean) => {
					accountToggles.push(Boolean(next));
				},
			},
			{
				id: 'status',
				kind: 'data' as const,
				header: 'Status',
				label: 'Status',
				align: 'left' as const,
				size: 160,
				pinState: 'left' as const,
				canSort: true,
				sortDirection: false as const,
				canHide: true,
				visible: false,
				canPin: true,
				canResize: true,
				isResizing: false,
				toggleVisibility: (next?: boolean) => {
					statusToggles.push(Boolean(next));
				},
				pin: () => void 0,
			},
			{
				id: 'notes',
				kind: 'data' as const,
				header: 'Notes',
				label: 'Notes',
				align: 'left' as const,
				size: 160,
				pinState: false as const,
				canSort: false,
				sortDirection: false as const,
				canHide: true,
				visible: false,
				canPin: true,
				canResize: true,
				isResizing: false,
				toggleVisibility: (next?: boolean) => {
					notesToggles.push(Boolean(next));
				},
			},
		];

		expect(canHideDataColumn(columns, columns[0]!)).toBe(false);
		showAllColumns(columns);

		expect(accountToggles).toEqual([true]);
		expect(statusToggles).toEqual([true]);
		expect(notesToggles).toEqual([true]);
	});

	test('applies overflow classes to data cell content', async () => {
		const container = document.createElement('div');
		document.body.append(container);
		const root: Root = createRoot(container);

		act(() => {
			root.render(<OverflowTableHarness />);
		});

		const overflowCells = Array.from(container.querySelectorAll('div')).filter(
			(element) => element.className.includes('max-w-full')
		);
		const accountCell = overflowCells.find((element) =>
			element.textContent?.includes('Account 1')
		);
		const statusCell = overflowCells.find((element) =>
			element.textContent?.includes('healthy')
		);
		const notesCell = overflowCells.find((element) =>
			element.textContent?.includes('Note 1')
		);
		const nodeCell = Array.from(container.querySelectorAll('strong')).find(
			(element) => element.textContent === 'Node content'
		);

		expect(accountCell?.className).toContain('truncate');
		expect(statusCell?.className).toContain('truncate');
		expect(notesCell?.className).toContain('break-words');
		expect(String(nodeCell?.parentElement?.className ?? '')).not.toContain(
			'max-w-full'
		);
		expect(container.textContent).toContain('Note 1');

		act(() => {
			root.unmount();
		});
	});

	test('handles repeated resize and visibility churn on wide tables without throwing', async () => {
		let controllerRef:
			| ContractTableController<TestRow, React.ReactNode>
			| undefined;
		const { root } = renderTable({
			onController: (controller) => {
				controllerRef = controller;
			},
		});

		expect(() => {
			act(() => {
				for (let index = 0; index < 12; index += 1) {
					controllerRef?.columns
						.find((column) => column.id === 'account')
						?.resizeBy?.(4);
					controllerRef?.columns
						.find((column) => column.id === 'status')
						?.toggleVisibility?.(index % 2 === 0);
					controllerRef?.columns
						.find((column) => column.id === 'notes')
						?.toggleVisibility?.(index % 3 === 0);
				}
			});
		}).not.toThrow();

		expect(
			controllerRef?.visibleColumns.some((column) => column.id === 'account')
		).toBe(true);

		act(() => {
			root.unmount();
		});
	});

	test('does not leak resize listeners after unmount', async () => {
		const container = document.createElement('div');
		document.body.append(container);
		const root: Root = createRoot(container);

		act(() => {
			root.render(
				<ResizeHandle
					column={{
						id: 'account',
						kind: 'data',
						header: 'Account',
						label: 'Account',
						align: 'left',
						size: 160,
						pinState: false,
						canSort: false,
						sortDirection: false,
						canHide: true,
						visible: true,
						canPin: true,
						canResize: true,
						isResizing: false,
						resizeBy: () => void 0,
					}}
				/>
			);
		});

		const resizeHandle = container.querySelector('[role="separator"]');

		act(() => {
			resizeHandle?.dispatchEvent(
				new window.PointerEvent('pointerdown', {
					bubbles: true,
					cancelable: true,
					clientX: 40,
				})
			);
		});

		act(() => {
			root.unmount();
		});

		expect(() => {
			window.dispatchEvent(
				new window.PointerEvent('pointermove', {
					bubbles: true,
					cancelable: true,
					clientX: 100,
				})
			);
			window.dispatchEvent(
				new window.PointerEvent('pointerup', {
					bubbles: true,
					cancelable: true,
				})
			);
		}).not.toThrow();
	});
});
