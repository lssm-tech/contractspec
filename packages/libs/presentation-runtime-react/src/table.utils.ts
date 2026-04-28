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
	const formatKind = typeof format === 'string' ? format : format?.type;
	switch (formatKind) {
		case 'boolean':
			return value ? 'Yes' : 'No';
		case 'number':
			return formatNumberValue(value, format);
		case 'currency':
			return formatCurrencyValue(value, format);
		case 'percent':
		case 'percentage':
			return formatPercentValue(value, format);
		case 'date':
			return formatDateValue(
				value,
				typeof format === 'object' && format.type === 'date'
					? format
					: { dateStyle: 'medium' }
			);
		case 'time':
			return formatDateValue(
				value,
				typeof format === 'object' && format.type === 'time'
					? format
					: { timeStyle: 'short' }
			);
		case 'datetime':
		case 'dateTime':
			return formatDateValue(
				value,
				typeof format === 'object' && format.type === 'datetime'
					? format
					: {
							dateStyle: 'medium',
							timeStyle: 'short',
						}
			);
		case 'duration':
			return formatDurationValue(value, format);
		default:
			return String(value);
	}
}

function formatNumberValue(
	value: unknown,
	format?: DataViewFieldFormat
): string {
	if (typeof value !== 'number') return String(value);
	const options =
		typeof format === 'object' && format.type === 'number' ? format : undefined;
	return new Intl.NumberFormat(options?.locale, {
		minimumFractionDigits: options?.minimumFractionDigits,
		maximumFractionDigits: options?.maximumFractionDigits,
		useGrouping: options?.useGrouping,
		notation: options?.notation,
		signDisplay: options?.signDisplay,
	}).format(value);
}

function formatCurrencyValue(
	value: unknown,
	format?: DataViewFieldFormat
): string {
	if (typeof value !== 'number') return String(value);
	const options =
		typeof format === 'object' && format.type === 'currency'
			? format
			: undefined;
	return new Intl.NumberFormat(options?.locale, {
		style: 'currency',
		currency: options?.currency ?? 'USD',
		currencyDisplay: options?.currencyDisplay,
		minimumFractionDigits: options?.rounded
			? 0
			: options?.minimumFractionDigits,
		maximumFractionDigits: options?.rounded
			? 0
			: options?.maximumFractionDigits,
		useGrouping: options?.useGrouping,
		notation: options?.notation,
		signDisplay: options?.signDisplay,
	}).format(value);
}

function formatPercentValue(
	value: unknown,
	format?: DataViewFieldFormat
): string {
	if (typeof value !== 'number') return String(value);
	const options =
		typeof format === 'object' && format.type === 'percent'
			? format
			: undefined;
	const scaledValue = options?.valueScale === 'whole' ? value / 100 : value;
	return new Intl.NumberFormat(options?.locale, {
		style: 'percent',
		minimumFractionDigits: options?.minimumFractionDigits ?? 1,
		maximumFractionDigits: options?.maximumFractionDigits ?? 1,
		useGrouping: options?.useGrouping,
		notation: options?.notation,
		signDisplay: options?.signDisplay,
	}).format(scaledValue);
}

function formatDateValue(
	value: unknown,
	options: Intl.DateTimeFormatOptions
): string {
	const date =
		value instanceof Date ? value : new Date(value as string | number);
	const { locale, ...dateTimeOptions } =
		options as Intl.DateTimeFormatOptions & {
			locale?: string;
		};
	return Number.isNaN(date.getTime())
		? String(value ?? '')
		: new Intl.DateTimeFormat(locale, dateTimeOptions).format(date);
}

function formatDurationValue(
	value: unknown,
	format?: DataViewFieldFormat
): string {
	if (typeof value !== 'number') return String(value);
	const options =
		typeof format === 'object' && format.type === 'duration'
			? format
			: undefined;
	const unit = options?.unit ?? 'second';
	if (options?.display === 'digital') {
		return formatDigitalDuration(toSeconds(value, unit));
	}
	return new Intl.NumberFormat(options?.locale, {
		style: 'unit',
		unit,
		unitDisplay: options?.display === 'narrow' ? 'narrow' : options?.display,
		maximumFractionDigits: 2,
	}).format(value);
}

function formatDigitalDuration(totalSeconds: number): string {
	const sign = totalSeconds < 0 ? '-' : '';
	const absoluteSeconds = Math.round(Math.abs(totalSeconds));
	const hours = Math.floor(absoluteSeconds / 3600);
	const minutes = Math.floor((absoluteSeconds % 3600) / 60);
	const seconds = absoluteSeconds % 60;
	const padded = [minutes, seconds]
		.map((part) => String(part).padStart(2, '0'))
		.join(':');
	return hours > 0 ? `${sign}${hours}:${padded}` : `${sign}${padded}`;
}

function toSeconds(value: number, unit: string): number {
	switch (unit) {
		case 'millisecond':
			return value / 1000;
		case 'minute':
			return value * 60;
		case 'hour':
			return value * 3600;
		case 'day':
			return value * 86_400;
		case 'week':
			return value * 604_800;
		case 'month':
			return value * 2_629_746;
		case 'year':
			return value * 31_556_952;
		case 'second':
		default:
			return value;
	}
}
