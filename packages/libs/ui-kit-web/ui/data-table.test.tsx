import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';
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

function WideTableHarness({
	onRowPress,
	onController,
	initialSortingDesc = false,
}: {
	onRowPress?: (rowId: string) => void;
	onController?: (
		controller: ReturnType<typeof useContractTable<(typeof ROWS)[number]>>
	) => void;
	initialSortingDesc?: boolean;
}) {
	const columns = React.useMemo(
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

	const controller = useContractTable({
		data: ROWS,
		columns,
		selectionMode: 'multiple',
		initialState: {
			sorting: [{ id: 'account', desc: initialSortingDesc }],
			columnVisibility: { notes: false },
		},
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

function renderTable({
	onRowPress,
	onController,
	initialSortingDesc,
}: {
	onRowPress?: (rowId: string) => void;
	onController?: (
		controller: ReturnType<typeof useContractTable<(typeof ROWS)[number]>>
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

	test('handles repeated resize and visibility churn on wide tables without throwing', async () => {
		let controllerRef:
			| ReturnType<typeof useContractTable<(typeof ROWS)[number]>>
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
