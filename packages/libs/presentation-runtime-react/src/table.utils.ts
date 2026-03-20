import type { DataViewFieldFormat } from '@contractspec/lib.contracts-spec/data-views/types';
import type {
	ContractTableExpandedState,
	ContractTableInitialState,
	ContractTablePinningState,
	ContractTablePinState,
	ContractTableRowSelectionState,
	ContractTableSelectionMode,
	ContractTableState,
} from '@contractspec/lib.presentation-runtime-core';
import { createEmptyTableState } from '@contractspec/lib.presentation-runtime-core';

export type TableUpdater<T> = T | ((previous: T) => T);

export function resolveUpdater<T>(updater: TableUpdater<T>, previous: T): T {
	return typeof updater === 'function'
		? (updater as (value: T) => T)(previous)
		: updater;
}

export function clampTableSize(
	value: number,
	min?: number,
	max?: number
): number {
	const lowerBound = min ?? 48;
	const upperBound = max ?? Number.POSITIVE_INFINITY;
	return Math.max(lowerBound, Math.min(value, upperBound));
}

export function mergeTableState(
	base: ContractTableState,
	controlled?: Partial<ContractTableState>
): ContractTableState {
	if (!controlled) return base;
	return {
		...base,
		...controlled,
	};
}

export function coerceRowSelectionState(
	state: ContractTableRowSelectionState,
	selectionMode: ContractTableSelectionMode
): ContractTableRowSelectionState {
	if (selectionMode === 'none') return {};
	if (selectionMode === 'multiple') return state;
	const activeEntries = Object.entries(state).filter(
		([, selected]) => selected
	);
	const latest = activeEntries.at(-1);
	return latest ? { [latest[0]]: true } : {};
}

export function createTableInitialState(
	initialState: ContractTableInitialState | undefined,
	columns: readonly {
		id?: string;
		accessorKey?: string;
		defaultPinned?: ContractTablePinState;
	}[]
): ContractTableState {
	const state = createEmptyTableState();
	const left = new Set(initialState?.columnPinning?.left ?? []);
	const right = new Set(initialState?.columnPinning?.right ?? []);

	columns.forEach((column) => {
		const columnId = column.id ?? column.accessorKey;
		if (!columnId) return;
		if (column.defaultPinned === 'left') left.add(columnId);
		if (column.defaultPinned === 'right') right.add(columnId);
	});

	return {
		...state,
		...initialState,
		pagination: {
			...state.pagination,
			...initialState?.pagination,
		},
		columnPinning: {
			left: Array.from(left),
			right: Array.from(right),
		},
	};
}

export function getTableRowId<TItem>(item: TItem, rowIndex: number): string {
	if (item && typeof item === 'object') {
		const candidate = item as Record<string, unknown>;
		const id = candidate.id ?? candidate.key;
		if (typeof id === 'string' || typeof id === 'number') {
			return String(id);
		}
	}
	return String(rowIndex);
}

export function normalizePinningState(
	state: Partial<ContractTablePinningState> | undefined
): ContractTablePinningState {
	return {
		left: [...(state?.left ?? [])],
		right: [...(state?.right ?? [])],
	};
}

export function normalizeExpandedState(
	state: boolean | ContractTableExpandedState,
	rowIds: string[]
): ContractTableExpandedState {
	if (typeof state === 'boolean') {
		return state
			? Object.fromEntries(rowIds.map((rowId) => [rowId, true]))
			: {};
	}
	return state;
}

export function normalizePinState(
	value: boolean | 'left' | 'right'
): ContractTablePinState {
	return value === 'left' || value === 'right' ? value : false;
}

export function getAtPath(
	source: Record<string, unknown> | undefined,
	path: string
): unknown {
	if (!source) return undefined;
	if (!path) return source;
	return path
		.replace(/\[(\d+)\]/g, '.$1')
		.split('.')
		.filter(Boolean)
		.reduce<unknown>((current, segment) => {
			if (
				current == null ||
				(typeof current !== 'object' && !Array.isArray(current))
			) {
				return undefined;
			}
			return (current as Record<string, unknown>)[segment];
		}, source);
}

export function formatTableValue(
	value: unknown,
	format?: DataViewFieldFormat
): string {
	if (value == null) return '';
	switch (format) {
		case 'boolean':
			return value ? 'Yes' : 'No';
		case 'currency':
			return typeof value === 'number'
				? new Intl.NumberFormat(undefined, {
						style: 'currency',
						currency: 'USD',
					}).format(value)
				: String(value);
		case 'percentage':
			return typeof value === 'number'
				? `${(value * 100).toFixed(1)}%`
				: String(value);
		case 'date':
			return formatDateValue(value, { dateStyle: 'medium' });
		case 'dateTime':
			return formatDateValue(value, {
				dateStyle: 'medium',
				timeStyle: 'short',
			});
		default:
			return String(value);
	}
}

function formatDateValue(
	value: unknown,
	options: Intl.DateTimeFormatOptions
): string {
	const date =
		value instanceof Date ? value : new Date(value as string | number);
	return Number.isNaN(date.getTime())
		? String(value ?? '')
		: new Intl.DateTimeFormat(undefined, options).format(date);
}
