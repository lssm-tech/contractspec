import type {
	ContractTableController,
	ContractTableState,
} from '@contractspec/lib.presentation-runtime-core';
import {
	type ColumnSizingState,
	type ExpandedState,
	getCoreRowModel,
	getExpandedRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type RowSelectionState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';
import {
	arraysEqual,
	paginationStatesEqual,
	sanitizeTableState,
	stateRecordsEqual,
} from './table.state';
import type { UseContractTableOptions } from './table.types';
import {
	coerceRowSelectionState,
	createTableInitialState,
	getTableRowId,
	mergeTableState,
	normalizeExpandedState,
	normalizePinningState,
	resolveUpdater,
} from './table.utils';
import {
	createRenderColumns,
	createRenderRows,
	createTableColumns,
} from './useContractTable.models';

export function useContractTable<TItem>({
	data,
	columns,
	executionMode = 'client',
	selectionMode = 'none',
	totalItems,
	getRowId,
	getCanExpand,
	renderExpandedContent,
	initialState,
	state: controlledState,
	onStateChange,
	onSortingChange,
	onPaginationChange,
	onColumnVisibilityChange,
	onColumnSizingChange,
	onColumnPinningChange,
	onExpandedChange,
	onRowSelectionChange,
}: UseContractTableOptions<TItem>): ContractTableController<
	TItem,
	React.ReactNode
> {
	const hasExpansion = typeof renderExpandedContent === 'function';
	const [uncontrolledState, setUncontrolledState] =
		React.useState<ContractTableState>(() =>
			createTableInitialState(initialState, columns)
		);
	const state = React.useMemo(
		() => mergeTableState(uncontrolledState, controlledState),
		[controlledState, uncontrolledState]
	);

	const tableColumns = React.useMemo(
		() => createTableColumns({ columns, hasExpansion, selectionMode }),
		[columns, hasExpansion, selectionMode]
	);

	const knownRowIds = React.useMemo(
		() =>
			data.map(
				(item, rowIndex) =>
					getRowId?.(item, rowIndex) ?? getTableRowId(item, rowIndex)
			),
		[data, getRowId]
	);
	const knownColumnIds = React.useMemo(
		() =>
			tableColumns
				.map((column) => column.id)
				.filter((columnId): columnId is string => typeof columnId === 'string'),
		[tableColumns]
	);
	const totalItemCount =
		executionMode === 'server' ? (totalItems ?? data.length) : data.length;
	const sanitizedState = React.useMemo(
		() =>
			sanitizeTableState(state, {
				rowIds: knownRowIds,
				columnIds: knownColumnIds,
				selectionMode,
				totalItems: totalItemCount,
			}),
		[knownColumnIds, knownRowIds, selectionMode, state, totalItemCount]
	);
	const stateRef = React.useRef(sanitizedState);
	stateRef.current = sanitizedState;

	React.useEffect(() => {
		setUncontrolledState((current) => {
			const next = sanitizeTableState(current, {
				rowIds: knownRowIds,
				columnIds: knownColumnIds,
				selectionMode,
				totalItems: totalItemCount,
			});
			const patchedCurrent = { ...current };
			let changed = false;

			if (
				!controlledState?.pagination &&
				!paginationStatesEqual(current.pagination, next.pagination)
			) {
				patchedCurrent.pagination = next.pagination;
				changed = true;
			}
			if (
				!controlledState?.columnVisibility &&
				!stateRecordsEqual(current.columnVisibility, next.columnVisibility)
			) {
				patchedCurrent.columnVisibility = next.columnVisibility;
				changed = true;
			}
			if (
				!controlledState?.columnSizing &&
				!stateRecordsEqual(current.columnSizing, next.columnSizing)
			) {
				patchedCurrent.columnSizing = next.columnSizing;
				changed = true;
			}
			if (
				!controlledState?.columnPinning &&
				(!arraysEqual(current.columnPinning.left, next.columnPinning.left) ||
					!arraysEqual(current.columnPinning.right, next.columnPinning.right))
			) {
				patchedCurrent.columnPinning = next.columnPinning;
				changed = true;
			}
			if (
				!controlledState?.expanded &&
				!stateRecordsEqual(current.expanded, next.expanded)
			) {
				patchedCurrent.expanded = next.expanded;
				changed = true;
			}
			if (
				!controlledState?.rowSelection &&
				!stateRecordsEqual(current.rowSelection, next.rowSelection)
			) {
				patchedCurrent.rowSelection = next.rowSelection;
				changed = true;
			}

			return changed ? patchedCurrent : current;
		});
	}, [
		controlledState,
		knownColumnIds,
		knownRowIds,
		selectionMode,
		totalItemCount,
	]);

	const updateTableState = React.useCallback(
		<K extends keyof ContractTableState>(
			key: K,
			updater:
				| ContractTableState[K]
				| ((previous: ContractTableState[K]) => ContractTableState[K])
		) => {
			const current = stateRef.current;
			const nextValue = resolveUpdater(updater, current[key]);
			const requestedNext = {
				...current,
				[key]:
					key === 'rowSelection'
						? coerceRowSelectionState(
								nextValue as ContractTableState['rowSelection'],
								selectionMode
							)
						: nextValue,
			} as ContractTableState;
			const sanitizedNext = sanitizeTableState(requestedNext, {
				rowIds: knownRowIds,
				columnIds: knownColumnIds,
				selectionMode,
				totalItems: totalItemCount,
			});

			setUncontrolledState(sanitizedNext);
			onStateChange?.(sanitizedNext);

			if (key === 'sorting') onSortingChange?.(sanitizedNext.sorting);
			if (key === 'pagination') onPaginationChange?.(sanitizedNext.pagination);
			if (key === 'columnVisibility') {
				onColumnVisibilityChange?.(sanitizedNext.columnVisibility);
			}
			if (key === 'columnSizing')
				onColumnSizingChange?.(sanitizedNext.columnSizing);
			if (key === 'columnPinning')
				onColumnPinningChange?.(sanitizedNext.columnPinning);
			if (key === 'expanded') onExpandedChange?.(sanitizedNext.expanded);
			if (key === 'rowSelection') {
				onRowSelectionChange?.(sanitizedNext.rowSelection);
			}
		},
		[
			knownColumnIds,
			knownRowIds,
			onColumnPinningChange,
			onColumnSizingChange,
			onColumnVisibilityChange,
			onExpandedChange,
			onPaginationChange,
			onRowSelectionChange,
			onSortingChange,
			onStateChange,
			selectionMode,
			totalItemCount,
		]
	);
	const pageCount =
		totalItemCount > 0
			? Math.ceil(totalItemCount / sanitizedState.pagination.pageSize)
			: 0;

	const table = useReactTable<TItem>({
		data: data as TItem[],
		columns: tableColumns,
		state: {
			sorting: sanitizedState.sorting as SortingState,
			pagination: sanitizedState.pagination as PaginationState,
			columnVisibility: sanitizedState.columnVisibility as VisibilityState,
			columnSizing: sanitizedState.columnSizing as ColumnSizingState,
			columnPinning: sanitizedState.columnPinning,
			expanded: sanitizedState.expanded as ExpandedState,
			rowSelection: sanitizedState.rowSelection as RowSelectionState,
		},
		getRowId: (item, rowIndex) =>
			getRowId?.(item, rowIndex) ?? getTableRowId(item, rowIndex),
		getRowCanExpand: (row) =>
			hasExpansion &&
			(getCanExpand?.(row.original, row.index) ??
				Boolean(renderExpandedContent)),
		enableRowSelection: selectionMode !== 'none',
		enableMultiRowSelection: selectionMode === 'multiple',
		manualSorting: executionMode === 'server',
		manualPagination: executionMode === 'server',
		autoResetExpanded: false,
		autoResetPageIndex: false,
		pageCount: executionMode === 'server' ? pageCount : undefined,
		rowCount: executionMode === 'server' ? totalItemCount : undefined,
		onSortingChange: (updater) =>
			updateTableState('sorting', updater as SortingState),
		onPaginationChange: (updater) =>
			updateTableState('pagination', updater as PaginationState),
		onColumnVisibilityChange: (updater) =>
			updateTableState('columnVisibility', updater as VisibilityState),
		onColumnSizingChange: (updater) =>
			updateTableState('columnSizing', updater as ColumnSizingState),
		onColumnPinningChange: (updater) =>
			updateTableState('columnPinning', (previous) =>
				normalizePinningState(resolveUpdater(updater, previous))
			),
		onExpandedChange: (updater) =>
			updateTableState('expanded', (previous) =>
				normalizeExpandedState(
					resolveUpdater(updater, previous) as ExpandedState,
					knownRowIds
				)
			),
		onRowSelectionChange: (updater) =>
			updateTableState('rowSelection', updater as RowSelectionState),
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getSortedRowModel:
			executionMode === 'client' ? getSortedRowModel() : undefined,
		getPaginationRowModel:
			executionMode === 'client' ? getPaginationRowModel() : undefined,
	});

	const allColumns = React.useMemo(
		() => createRenderColumns(table),
		[
			sanitizedState.columnPinning,
			sanitizedState.columnSizing,
			sanitizedState.columnVisibility,
			sanitizedState.sorting,
			table,
		]
	);
	const rows = React.useMemo(
		() => createRenderRows(table, renderExpandedContent),
		[
			data,
			renderExpandedContent,
			sanitizedState.expanded,
			sanitizedState.pagination,
			sanitizedState.rowSelection,
			sanitizedState.sorting,
			table,
		]
	);

	return {
		executionMode,
		selectionMode,
		columns: allColumns,
		visibleColumns: allColumns.filter((column) => column.visible),
		rows,
		selectedRowIds: Object.entries(sanitizedState.rowSelection)
			.filter(([, selected]) => selected)
			.map(([id]) => id),
		allRowsSelected:
			selectionMode === 'multiple' ? table.getIsAllPageRowsSelected() : false,
		someRowsSelected:
			selectionMode === 'multiple' ? table.getIsSomePageRowsSelected() : false,
		toggleAllRowsSelected:
			selectionMode === 'multiple'
				? (next?: boolean) => table.toggleAllPageRowsSelected(next)
				: undefined,
		pageIndex: sanitizedState.pagination.pageIndex,
		pageSize: sanitizedState.pagination.pageSize,
		pageCount,
		totalItems: totalItemCount,
		canNextPage: table.getCanNextPage(),
		canPreviousPage: table.getCanPreviousPage(),
		nextPage: () => table.nextPage(),
		previousPage: () => table.previousPage(),
		setPageIndex: (pageIndex: number) => table.setPageIndex(pageIndex),
		setPageSize: (pageSize: number) => table.setPageSize(pageSize),
	};
}

export type {
	ContractTableColumnDef,
	ContractTableColumnRenderModel,
	ContractTableController,
	ContractTableOverflowBehavior,
	ContractTableRowRenderModel,
	UseContractTableOptions,
} from './table.types';
