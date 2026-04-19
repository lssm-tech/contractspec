import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import { defineDataView } from '@contractspec/lib.contracts-spec/data-views';
import {
	useContractTable,
	useDataViewTable,
} from '@contractspec/lib.presentation-runtime-react';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { DataViewTable } from '../data-view/DataViewTable';
import { DataTable } from './DataTable';
import { DataTableToolbar } from './DataTableToolbar';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://design-system-table.contractspec.local/tests',
	});
	Object.defineProperty(windowInstance, 'SyntaxError', {
		value: SyntaxError,
		configurable: true,
	});
	Object.assign(globalThis, {
		window: windowInstance,
		document: windowInstance.document,
		navigator: windowInstance.navigator,
		location: windowInstance.location,
		HTMLElement: windowInstance.HTMLElement,
		HTMLButtonElement: windowInstance.HTMLButtonElement,
		HTMLInputElement: windowInstance.HTMLInputElement,
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

const ROWS = [
	{ id: 'acct-1', account: 'Northwind', status: 'healthy' },
	{ id: 'acct-2', account: 'Beacon', status: 'risk' },
];

const TABLE_SPEC = defineDataView({
	meta: {
		key: 'tests.design-system.accounts',
		version: '1.0.0',
		entity: 'account',
		title: 'Accounts',
		description: 'Account table',
		domain: 'tests',
		owners: ['@tests'],
		tags: ['table'],
		stability: 'experimental',
	},
	source: {
		primary: { key: 'tests.design-system.accounts.list', version: '1.0.0' },
	},
	view: {
		kind: 'table',
		fields: [
			{ key: 'account', label: 'Account', dataPath: 'account', sortable: true },
			{ key: 'status', label: 'Status', dataPath: 'status', sortable: true },
		],
	},
});

function ToolbarHarness({
	onSearchChange,
	onChipRemove,
	onClearAll,
	searchValue = '',
}: {
	onSearchChange?: (value: string) => void;
	onChipRemove?: () => void;
	onClearAll?: () => void;
	searchValue?: string;
}) {
	const controller = useContractTable({
		data: ROWS,
		columns: [
			{ id: 'account', header: 'Account', accessorKey: 'account' },
			{ id: 'status', header: 'Status', accessorKey: 'status', canHide: true },
		],
		selectionMode: 'multiple',
		initialState: {
			rowSelection: { 'acct-1': true },
			columnVisibility: { status: false },
		},
	});

	return (
		<DataTableToolbar
			controller={controller}
			searchPlaceholder="Search accounts"
			searchValue={searchValue}
			onSearchChange={onSearchChange}
			debounceMs={10}
			activeChips={[
				{
					key: 'status',
					label: 'Status: risk',
					onRemove: onChipRemove,
				},
			]}
			onClearAll={onClearAll}
		/>
	);
}

function IntegratedDataTableHarness() {
	const controller = useContractTable({
		data: ROWS,
		columns: [
			{ id: 'account', header: 'Account', accessorKey: 'account' },
			{ id: 'status', header: 'Status', accessorKey: 'status' },
		],
		selectionMode: 'multiple',
		initialState: {
			rowSelection: { 'acct-1': true },
			columnVisibility: { status: false },
		},
	});

	return (
		<DataTable
			controller={controller}
			toolbar={
				<DataTableToolbar
					controller={controller}
					searchPlaceholder="Search accounts"
				/>
			}
		/>
	);
}

function IntegratedDataViewTableHarness() {
	const controller = useDataViewTable({
		spec: TABLE_SPEC,
		data: ROWS,
		selectionMode: 'multiple',
		initialState: {
			rowSelection: { 'acct-1': true },
		},
	});

	return (
		<DataViewTable
			spec={TABLE_SPEC}
			items={ROWS}
			toolbar={
				<DataTableToolbar
					controller={controller}
					searchPlaceholder="Search accounts"
				/>
			}
		/>
	);
}

async function renderNode(node: React.ReactElement) {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);

	await act(async () => {
		root.render(node);
	});

	return { container, root };
}

async function click(element: Element | null) {
	if (!element) throw new Error('Expected element to exist.');
	await act(async () => {
		element.dispatchEvent(
			new window.MouseEvent('click', { bubbles: true, cancelable: true })
		);
	});
}

describe('DataTableToolbar', () => {
	test('debounces search, removes chips, clears filters, and shows selection summary', async () => {
		const searchValues: string[] = [];
		let chipRemovals = 0;
		let clearAlls = 0;
		const { container, root } = await renderNode(
			<ToolbarHarness
				searchValue="Beacon"
				onSearchChange={(value) => searchValues.push(value)}
				onChipRemove={() => {
					chipRemovals += 1;
				}}
				onClearAll={() => {
					clearAlls += 1;
				}}
			/>
		);

		await new Promise((resolve) => setTimeout(resolve, 20));

		expect(searchValues.at(-1)).toBe('Beacon');
		expect(container.textContent).toContain('Selected 1');
		expect(container.textContent).toContain('Show 1 Hidden');

		await click(container.querySelector('[aria-label="Supprimer le filtre"]'));
		await click(
			Array.from(container.querySelectorAll('button')).find((button) =>
				button.textContent?.includes('Effacer les filtres')
			) ?? null
		);

		expect(chipRemovals).toBe(1);
		expect(clearAlls).toBe(1);

		await act(async () => {
			root.unmount();
		});
	});

	test('composes with DataTable and DataViewTable', async () => {
		const dataTable = await renderNode(<IntegratedDataTableHarness />);
		expect(dataTable.container.textContent).toContain('Selected 1');
		expect(dataTable.container.textContent).toContain('Show 1 Hidden');

		await act(async () => {
			dataTable.root.unmount();
		});

		const dataViewTable = await renderNode(<IntegratedDataViewTableHarness />);
		expect(dataViewTable.container.textContent).toContain('Accounts');
		expect(dataViewTable.container.textContent).toContain('Selected 1');

		await act(async () => {
			dataViewTable.root.unmount();
		});
	});
});
