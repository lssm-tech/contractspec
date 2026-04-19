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
	const stateRef = React.useRef(state);
	stateRef.current = state;

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

			setUncontrolledState(requestedNext);
			onStateChange?.(requestedNext);

			if (key === 'sorting') onSortingChange?.(requestedNext.sorting);
			if (key === 'pagination') onPaginationChange?.(requestedNext.pagination);
			if (key === 'columnVisibility') {
				onColumnVisibilityChange?.(requestedNext.columnVisibility);
			}
			if (key === 'columnSizing')
				onColumnSizingChange?.(requestedNext.columnSizing);
			if (key === 'columnPinning')
				onColumnPinningChange?.(requestedNext.columnPinning);
			if (key === 'expanded') onExpandedChange?.(requestedNext.expanded);
			if (key === 'rowSelection') {
				onRowSelectionChange?.(requestedNext.rowSelection);
			}
		},
		[
			onColumnPinningChange,
			onColumnSizingChange,
			onColumnVisibilityChange,
			onExpandedChange,
			onPaginationChange,
			onRowSelectionChange,
			onSortingChange,
			onStateChange,
			selectionMode,
		]
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
	const knownRowIdSet = React.useMemo(
		() => new Set(knownRowIds),
		[knownRowIds]
	);

	React.useEffect(() => {
		if (controlledState?.expanded || controlledState?.rowSelection) return;

		setUncontrolledState((current) => {
			const expanded = Object.fromEntries(
				Object.entries(current.expanded).filter(([rowId]) =>
					knownRowIdSet.has(rowId)
				)
			);
			const rowSelection = coerceRowSelectionState(
				Object.fromEntries(
					Object.entries(current.rowSelection).filter(([rowId]) =>
						knownRowIdSet.has(rowId)
					)
				),
				selectionMode
			);

			const expandedChanged =
				Object.keys(expanded).length !== Object.keys(current.expanded).length;
			const selectionChanged =
				Object.keys(rowSelection).length !==
				Object.keys(current.rowSelection).length;

			if (!expandedChanged && !selectionChanged) {
				return current;
			}

			return {
				...current,
				expanded,
				rowSelection,
			};
		});
	}, [
		controlledState?.expanded,
		controlledState?.rowSelection,
		knownRowIdSet,
		selectionMode,
	]);

	const table = useReactTable<TItem>({
		data: [...data],
		columns: tableColumns,
		state: {
			sorting: state.sorting as SortingState,
			pagination: state.pagination as PaginationState,
			columnVisibility: state.columnVisibility as VisibilityState,
			columnSizing: state.columnSizing as ColumnSizingState,
			columnPinning: state.columnPinning,
			expanded: state.expanded as ExpandedState,
			rowSelection: state.rowSelection as RowSelectionState,
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

	const allColumns = React.useMemo(() => createRenderColumns(table), [table]);
	const rows = React.useMemo(
		() => createRenderRows(table, renderExpandedContent),
		[renderExpandedContent, table]
	);

	const totalItemCount =
		executionMode === 'server'
			? (totalItems ?? data.length)
			: table.getPrePaginationRowModel().rows.length;

	return {
		executionMode,
		selectionMode,
		columns: allColumns,
		visibleColumns: allColumns.filter((column) => column.visible),
		rows,
		selectedRowIds: Object.entries(state.rowSelection)
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
		pageIndex: state.pagination.pageIndex,
		pageSize: state.pagination.pageSize,
		pageCount:
			totalItemCount > 0
				? Math.ceil(totalItemCount / state.pagination.pageSize)
				: 0,
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
	ContractTableRowRenderModel,
	UseContractTableOptions,
} from './table.types';
