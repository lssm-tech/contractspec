import type {
	ContractTablePinningState,
	ContractTableRowSelectionState,
	ContractTableSelectionMode,
	ContractTableState,
} from '@contractspec/lib.presentation-runtime-core';
import { coerceRowSelectionState } from './table.utils';

interface SanitizeTableStateOptions {
	rowIds: readonly string[];
	columnIds: readonly string[];
	selectionMode: ContractTableSelectionMode;
	totalItems: number;
}

function uniqueKnownValues(
	values: readonly string[],
	knownValues: ReadonlySet<string>,
	excluded?: ReadonlySet<string>
) {
	const nextValues: string[] = [];
	const seenValues = new Set<string>();
	for (const value of values) {
		if (
			!knownValues.has(value) ||
			seenValues.has(value) ||
			excluded?.has(value)
		) {
			continue;
		}
		seenValues.add(value);
		nextValues.push(value);
	}
	return nextValues;
}

function filterKnownStateRecord<TValue>(
	state: Record<string, TValue>,
	knownValues: ReadonlySet<string>
) {
	return Object.fromEntries(
		Object.entries(state).filter(([key]) => knownValues.has(key))
	) as Record<string, TValue>;
}

function normalizePaginationState(
	pagination: ContractTableState['pagination'],
	totalItems: number
) {
	const pageSize =
		Number.isFinite(pagination.pageSize) && pagination.pageSize > 0
			? Math.floor(pagination.pageSize)
			: 25;
	const rawPageIndex =
		Number.isFinite(pagination.pageIndex) && pagination.pageIndex >= 0
			? Math.floor(pagination.pageIndex)
			: 0;
	const maxPageIndex =
		totalItems > 0 ? Math.max(0, Math.ceil(totalItems / pageSize) - 1) : 0;

	return {
		pageIndex: Math.min(rawPageIndex, maxPageIndex),
		pageSize,
	};
}

function normalizePinningState(
	pinning: ContractTablePinningState,
	knownColumnIds: ReadonlySet<string>
) {
	const left = uniqueKnownValues(pinning.left, knownColumnIds);
	return {
		left,
		right: uniqueKnownValues(pinning.right, knownColumnIds, new Set(left)),
	};
}

export function sanitizeTableState(
	state: ContractTableState,
	{ rowIds, columnIds, selectionMode, totalItems }: SanitizeTableStateOptions
) {
	const knownRowIds = new Set(rowIds);
	const knownColumnIds = new Set(columnIds);
	const rowSelection = coerceRowSelectionState(
		filterKnownStateRecord<ContractTableRowSelectionState[string]>(
			state.rowSelection,
			knownRowIds
		),
		selectionMode
	);

	return {
		...state,
		pagination: normalizePaginationState(state.pagination, totalItems),
		columnVisibility: filterKnownStateRecord(
			state.columnVisibility,
			knownColumnIds
		),
		columnSizing: filterKnownStateRecord(state.columnSizing, knownColumnIds),
		columnPinning: normalizePinningState(state.columnPinning, knownColumnIds),
		expanded: filterKnownStateRecord(state.expanded, knownRowIds),
		rowSelection,
	};
}

export function arraysEqual(left: readonly string[], right: readonly string[]) {
	return (
		left.length === right.length &&
		left.every((value, index) => value === right[index])
	);
}

export function stateRecordsEqual<TValue>(
	left: Record<string, TValue>,
	right: Record<string, TValue>
) {
	const leftEntries = Object.entries(left);
	const rightEntries = Object.entries(right);
	return (
		leftEntries.length === rightEntries.length &&
		leftEntries.every(([key, value]) => Object.is(right[key], value))
	);
}

export function paginationStatesEqual(
	left: ContractTableState['pagination'],
	right: ContractTableState['pagination']
) {
	return left.pageIndex === right.pageIndex && left.pageSize === right.pageSize;
}
