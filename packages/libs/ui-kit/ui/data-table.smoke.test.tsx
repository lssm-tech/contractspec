import { afterEach, beforeAll, describe, expect, mock, test } from 'bun:test';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';
import Window from 'happy-dom/lib/window/Window.js';
import type * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

mock.module('react-native', () => ({
	View: ({ children, ...props }: { children?: React.ReactNode }) => (
		<div {...props}>{children}</div>
	),
	ScrollView: ({
		children,
		horizontal: _horizontal,
		showsHorizontalScrollIndicator: _showsHorizontalScrollIndicator,
		...props
	}: {
		children?: React.ReactNode;
		horizontal?: boolean;
		showsHorizontalScrollIndicator?: boolean;
	}) => <div {...props}>{children}</div>,
}));
mock.module('react-native-gesture-handler', () => ({
	PanGestureHandler: ({ children }: { children: React.ReactNode }) => children,
}));
mock.module('lucide-react-native', () => ({
	ChevronDown: () => <span>ChevronDown</span>,
	ChevronRight: () => <span>ChevronRight</span>,
	Columns3: () => <span>Columns3</span>,
}));
mock.module('./stack', () => ({
	HStack: ({ children, ...props }: { children?: React.ReactNode }) => (
		<div {...props}>{children}</div>
	),
	VStack: ({ children, ...props }: { children?: React.ReactNode }) => (
		<div {...props}>{children}</div>
	),
}));
mock.module('./text', () => ({
	Text: ({ children, ...props }: { children?: React.ReactNode }) => (
		<span {...props}>{children}</span>
	),
}));
mock.module('./table', () => ({
	Table: ({ children, ...props }: { children?: React.ReactNode }) => (
		<div {...props}>{children}</div>
	),
	TableHeader: ({ children, ...props }: { children?: React.ReactNode }) => (
		<div {...props}>{children}</div>
	),
	TableBody: ({ children, ...props }: { children?: React.ReactNode }) => (
		<div {...props}>{children}</div>
	),
	TableRow: ({
		children,
		onPress,
		...props
	}: {
		children?: React.ReactNode;
		onPress?: (event?: { stopPropagation?: () => void }) => void;
	}) => (
		<div role="row" onClick={(event) => onPress?.(event)} {...props}>
			{children}
		</div>
	),
	TableHead: ({ children, ...props }: { children?: React.ReactNode }) => (
		<div {...props}>{children}</div>
	),
	TableCell: ({ children, ...props }: { children?: React.ReactNode }) => (
		<div {...props}>{children}</div>
	),
}));
mock.module('./button', () => ({
	Button: ({
		children,
		onPress,
		accessibilityLabel: _accessibilityLabel,
		...props
	}: {
		children?: React.ReactNode;
		onPress?: (event?: { stopPropagation?: () => void }) => void;
		accessibilityLabel?: string;
	}) => (
		<button onClick={(event) => onPress?.(event)} {...props}>
			{children}
		</button>
	),
}));
mock.module('./checkbox', () => ({
	Checkbox: ({
		checked,
		onCheckedChange,
		onPress,
		accessibilityLabel: _accessibilityLabel,
		...props
	}: {
		checked?: boolean | 'indeterminate';
		onCheckedChange?: (checked: boolean) => void;
		onPress?: (event?: { stopPropagation?: () => void }) => void;
		accessibilityLabel?: string;
	}) => (
		<button
			role="checkbox"
			aria-checked={checked === 'indeterminate' ? 'mixed' : Boolean(checked)}
			onClick={(event) => {
				onPress?.(event);
				onCheckedChange?.(
					checked === 'indeterminate' ? false : !Boolean(checked)
				);
			}}
			{...props}
		/>
	),
}));
mock.module('./dropdown-menu', () => ({
	DropdownMenu: ({ children }: { children?: React.ReactNode }) => children,
	DropdownMenuTrigger: ({ children }: { children?: React.ReactNode }) =>
		children,
	DropdownMenuContent: ({ children }: { children?: React.ReactNode }) =>
		children,
	DropdownMenuLabel: ({ children }: { children?: React.ReactNode }) => (
		<div>{children}</div>
	),
	DropdownMenuSeparator: () => <div />,
	DropdownMenuCheckboxItem: ({
		children,
		onCheckedChange,
		checked,
	}: {
		children?: React.ReactNode;
		onCheckedChange?: (checked: boolean) => void;
		checked?: boolean;
	}) => (
		<button onClick={() => onCheckedChange?.(!Boolean(checked))}>
			{children}
		</button>
	),
}));
mock.module('./skeleton', () => ({
	Skeleton: ({ ...props }: Record<string, unknown>) => <div {...props} />,
}));
mock.module('./atoms/Pagination', () => ({
	Pagination: () => <div>Pagination</div>,
}));

const { DataTable } = await import('./data-table');

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://native-table.contractspec.local/tests',
	});
	Object.defineProperty(windowInstance, 'SyntaxError', {
		value: SyntaxError,
		configurable: true,
	});
	Object.assign(globalThis, {
		window: windowInstance,
		document: windowInstance.document,
		navigator: windowInstance.navigator,
		HTMLElement: windowInstance.HTMLElement,
		HTMLButtonElement: windowInstance.HTMLButtonElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		MouseEvent: windowInstance.MouseEvent,
		MutationObserver: windowInstance.MutationObserver,
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
	{ id: 'acct-1', account: 'Northwind', status: 'healthy', notes: 'A' },
	{ id: 'acct-2', account: 'Aster', status: 'risk', notes: 'B' },
];

function NativeTableHarness({
	rows = ROWS,
	onRowPress,
}: {
	rows?: typeof ROWS;
	onRowPress?: (rowId: string) => void;
}) {
	const controller = useContractTable({
		data: rows,
		columns: [
			{
				id: 'account',
				header: 'Account',
				accessorKey: 'account',
				canHide: false,
				canResize: true,
				canPin: true,
			},
			{
				id: 'status',
				header: 'Status',
				accessorKey: 'status',
				canHide: false,
				canResize: true,
				canPin: true,
			},
		],
		selectionMode: 'multiple',
		initialState: {
			columnPinning: { left: ['account'], right: [] },
		},
		renderExpandedContent: (row) => row.notes,
		getCanExpand: () => true,
	});

	return (
		<DataTable
			controller={controller}
			onRowPress={(row) => onRowPress?.(row.id)}
			emptyState={<div>Native empty</div>}
		/>
	);
}

async function renderTable(
	props: Parameters<typeof NativeTableHarness>[0] = {}
) {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);

	await act(async () => {
		root.render(<NativeTableHarness {...props} />);
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

describe('ui-kit data-table smoke', () => {
	test('selection and expansion controls do not trigger row press', async () => {
		const rowPresses: string[] = [];
		const { container, root } = await renderTable({
			onRowPress: (rowId) => rowPresses.push(rowId),
		});

		click(container.querySelector('[aria-label="Select row acct-1"]'));
		click(container.querySelector('[aria-label="Expand row acct-1"]'));

		expect(rowPresses).toEqual([]);
		const dataRow = Array.from(container.querySelectorAll('[role="row"]')).find(
			(row) => row.textContent?.includes('Northwind')
		);
		click(dataRow ?? null);
		expect(rowPresses).toEqual(['acct-1']);

		act(() => {
			root.unmount();
		});
	});

	test('empty + pinned section rendering does not throw', async () => {
		const { container, root } = await renderTable({ rows: [] });

		expect(container.textContent).toContain('Native empty');

		act(() => {
			root.unmount();
		});
	});
});
