import { afterEach, beforeAll, describe, expect, mock, test } from 'bun:test';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
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
mock.module('react-native-reanimated', () => ({
	default: {
		View: ({
			children,
			onResponderGrant,
			onResponderMove,
			onResponderRelease,
			onResponderTerminate,
			onStartShouldSetResponder: _onStartShouldSetResponder,
			onMoveShouldSetResponder: _onMoveShouldSetResponder,
			testID,
			...props
		}: {
			children: React.ReactNode;
			onResponderGrant?: (event: { nativeEvent: { pageX: number } }) => void;
			onResponderMove?: (event: { nativeEvent: { pageX: number } }) => void;
			onResponderRelease?: () => void;
			onResponderTerminate?: () => void;
			onStartShouldSetResponder?: () => boolean;
			onMoveShouldSetResponder?: () => boolean;
			testID?: string;
		}) => (
			<div
				data-testid={testID}
				role="button"
				tabIndex={-1}
				onMouseDown={(event) =>
					onResponderGrant?.({ nativeEvent: { pageX: event.clientX } })
				}
				onMouseMove={(event) =>
					onResponderMove?.({ nativeEvent: { pageX: event.clientX } })
				}
				onMouseUp={() => onResponderRelease?.()}
				onMouseLeave={() => onResponderTerminate?.()}
				{...props}
			>
				{children}
			</div>
		),
	},
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
		disabled,
	}: {
		children?: React.ReactNode;
		onCheckedChange?: (checked: boolean) => void;
		checked?: boolean;
		disabled?: boolean;
	}) => (
		<button
			disabled={disabled}
			onClick={() => onCheckedChange?.(!Boolean(checked))}
		>
			{children}
		</button>
	),
	DropdownMenuItem: ({
		children,
		onPress,
	}: {
		children?: React.ReactNode;
		onPress?: () => void;
	}) => <button onClick={() => onPress?.()}>{children}</button>,
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
				canHide: true,
				canResize: true,
				canPin: true,
			},
			{
				id: 'status',
				header: 'Status',
				accessorKey: 'status',
				canHide: true,
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
	await act(async () => {});

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

describe('ui-kit data-table smoke', () => {
	test('selection and expansion controls do not trigger row press', async () => {
		const rowPresses: string[] = [];
		const { container, root } = await renderTable({
			onRowPress: (rowId) => rowPresses.push(rowId),
		});

		await click(container.querySelector('[aria-label="Select row acct-1"]'));
		await click(container.querySelector('[aria-label="Expand row acct-1"]'));

		expect(rowPresses).toEqual([]);
		const dataRow = Array.from(container.querySelectorAll('[role="row"]')).find(
			(row) => row.textContent?.includes('Northwind')
		);
		await click(dataRow ?? null);
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

	test('keeps the last visible data column available and can restore hidden columns', async () => {
		const { container, root } = await renderTable();

		await click(
			Array.from(container.querySelectorAll('button')).find(
				(button) => button.textContent?.trim() === 'Status'
			) ?? null
		);
		await act(async () => {});
		const accountButton = Array.from(container.querySelectorAll('button')).find(
			(button) => button.textContent?.includes('Account')
		) as HTMLButtonElement | undefined;

		expect(accountButton?.disabled).toBe(true);
		await click(accountButton ?? null);
		expect(accountButton?.disabled).toBe(true);

		await click(
			Array.from(container.querySelectorAll('button')).find((button) =>
				button.textContent?.includes('Show All Columns')
			) ?? null
		);
		await act(async () => {});
		expect(accountButton?.disabled).toBe(false);

		act(() => {
			root.unmount();
		});
	});

	test('resize gesture cleanup does not throw', async () => {
		const { container, root } = await renderTable();
		const gesture = container.querySelector('[data-testid="resize-handle"]');

		await act(async () => {
			expect(() => {
				gesture?.dispatchEvent(
					new window.MouseEvent('mousedown', {
						bubbles: true,
						cancelable: true,
						clientX: 32,
					})
				);
				gesture?.dispatchEvent(
					new window.MouseEvent('mousemove', {
						bubbles: true,
						cancelable: true,
						clientX: 48,
					})
				);
				gesture?.dispatchEvent(
					new window.MouseEvent('mouseleave', {
						bubbles: true,
						cancelable: true,
					})
				);
			}).not.toThrow();
		});

		act(() => {
			root.unmount();
		});
	});
});
