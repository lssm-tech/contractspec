import type {
	ContractTableCellAlign,
	ContractTableColumnRenderModel,
	ContractTablePinState,
	ContractTableRowRenderModel,
	ContractTableSelectionMode,
} from '@contractspec/lib.presentation-runtime-core';
import { type Column, type ColumnDef, type Table } from '@tanstack/react-table';
import * as React from 'react';
import type { ContractTableColumnDef } from './table.types';
import { clampTableSize, normalizePinState } from './table.utils';

export interface InternalColumnMeta {
	kind: 'data' | 'selection' | 'expansion';
	align: ContractTableCellAlign;
	label: string;
	minSize?: number;
	maxSize?: number;
}

interface CreateTableColumnsOptions<TItem> {
	columns: readonly ContractTableColumnDef<TItem>[];
	hasExpansion: boolean;
	selectionMode: ContractTableSelectionMode;
}

export function createTableColumns<TItem>({
	columns,
	hasExpansion,
	selectionMode,
}: CreateTableColumnsOptions<TItem>): ColumnDef<TItem, unknown>[] {
	const mappedColumns: ColumnDef<TItem, unknown>[] = [];

	if (selectionMode !== 'none') {
		mappedColumns.push({
			id: '__select',
			header: () => null,
			cell: () => null,
			size: 44,
			minSize: 44,
			maxSize: 44,
			enablePinning: false,
			enableHiding: false,
			enableSorting: false,
			enableResizing: false,
			meta: {
				kind: 'selection',
				align: 'center',
				label: 'Select',
			} satisfies InternalColumnMeta,
		});
	}

	if (hasExpansion) {
		mappedColumns.push({
			id: '__expand',
			header: () => null,
			cell: () => null,
			size: 44,
			minSize: 44,
			maxSize: 44,
			enablePinning: false,
			enableHiding: false,
			enableSorting: false,
			enableResizing: false,
			meta: {
				kind: 'expansion',
				align: 'center',
				label: 'Expand',
			} satisfies InternalColumnMeta,
		});
	}

	columns.forEach((column) => {
		const columnId = column.id ?? column.accessorKey;
		if (!columnId) {
			throw new Error(
				'Contract table columns require either "id" or "accessorKey".'
			);
		}

		mappedColumns.push({
			id: columnId,
			accessorKey: column.accessorKey,
			accessorFn: column.accessor
				? (item, rowIndex) => column.accessor?.(item, rowIndex)
				: undefined,
			header: () => column.header,
			cell: (context) =>
				column.cell?.({
					item: context.row.original,
					value: context.getValue(),
					rowId: context.row.id,
					rowIndex: context.row.index,
					columnId,
				}) ?? String(context.getValue() ?? ''),
			size: column.size,
			minSize: column.minSize,
			maxSize: column.maxSize,
			enableSorting: column.canSort ?? true,
			enableHiding: column.canHide ?? true,
			enableResizing: column.canResize ?? true,
			enablePinning: column.canPin ?? true,
			meta: {
				kind: 'data',
				align: column.align ?? 'left',
				label:
					column.label ??
					(typeof column.header === 'string' ? column.header : columnId),
				minSize: column.minSize,
				maxSize: column.maxSize,
			} satisfies InternalColumnMeta,
		});
	});

	return mappedColumns;
}

type LeafColumn<TItem> = Column<TItem, unknown>;

function getStickyOffset<TItem>(column: LeafColumn<TItem>) {
	const pinState = column.getIsPinned() as ContractTablePinState;
	if (pinState === 'left' && typeof column.getStart === 'function') {
		return column.getStart('left');
	}
	if (pinState === 'right' && typeof column.getAfter === 'function') {
		return column.getAfter('right');
	}
	return undefined;
}

function renderHeader<TItem>(
	header: ReturnType<Table<TItem>['getFlatHeaders']>[number] | undefined,
	fallback: React.ReactNode
) {
	if (!header) return fallback;

	const headerTemplate = header.column.columnDef.header;
	return typeof headerTemplate === 'function'
		? headerTemplate(header.getContext())
		: (headerTemplate ?? fallback);
}

function renderCell<TItem>(
	cell: ReturnType<
		ReturnType<Table<TItem>['getRowModel']>['rows'][number]['getVisibleCells']
	>[number]
) {
	const cellTemplate = cell.column.columnDef.cell;
	return typeof cellTemplate === 'function'
		? cellTemplate(cell.getContext())
		: (cellTemplate ?? null);
}

export function createRenderColumns<TItem>(
	table: Table<TItem>
): ContractTableColumnRenderModel<React.ReactNode>[] {
	const headers = table.getFlatHeaders();

	return table.getAllLeafColumns().map((column) => {
		const meta = column.columnDef.meta as InternalColumnMeta | undefined;
		const header = headers.find(
			(candidate) => candidate.column.id === column.id
		);

		return {
			id: column.id,
			kind: meta?.kind ?? 'data',
			header: renderHeader(header, meta?.label ?? column.id),
			label: meta?.label ?? column.id,
			align: meta?.align ?? 'left',
			size: column.getSize(),
			minSize: meta?.minSize,
			maxSize: meta?.maxSize,
			pinState: normalizePinState(column.getIsPinned()),
			stickyOffset: getStickyOffset(column),
			canSort: column.getCanSort(),
			sortDirection: column.getIsSorted(),
			canHide: column.getCanHide(),
			visible: column.getIsVisible(),
			canPin: column.getCanPin(),
			canResize: column.getCanResize(),
			isResizing: column.getIsResizing(),
			toggleSorting: column.getCanSort()
				? () => column.toggleSorting()
				: undefined,
			toggleVisibility: column.getCanHide()
				? (next?: boolean) => column.toggleVisibility(next)
				: undefined,
			pin: column.getCanPin()
				? (next: ContractTablePinState) => column.pin(next)
				: undefined,
			resizeBy: column.getCanResize()
				? (delta: number) =>
						table.setColumnSizing((previous) => ({
							...previous,
							[column.id]: clampTableSize(
								column.getSize() + delta,
								meta?.minSize,
								meta?.maxSize
							),
						}))
				: undefined,
			setSize: column.getCanResize()
				? (size: number) =>
						table.setColumnSizing((previous) => ({
							...previous,
							[column.id]: clampTableSize(size, meta?.minSize, meta?.maxSize),
						}))
				: undefined,
		};
	});
}

export function createRenderRows<TItem>(
	table: Table<TItem>,
	renderExpandedContent?: (item: TItem, rowIndex: number) => React.ReactNode
): ContractTableRowRenderModel<TItem, React.ReactNode>[] {
	return table.getRowModel().rows.map((row) => ({
		id: row.id,
		original: row.original,
		depth: row.depth,
		cells: row.getVisibleCells().map((cell) => {
			const meta = cell.column.columnDef.meta as InternalColumnMeta | undefined;
			return {
				id: cell.id,
				columnId: cell.column.id,
				kind: meta?.kind ?? 'data',
				content: meta?.kind === 'data' ? renderCell(cell) : null,
				align: meta?.align ?? 'left',
				size: cell.column.getSize(),
				pinState: normalizePinState(cell.column.getIsPinned()),
				stickyOffset: getStickyOffset(cell.column),
			};
		}),
		canSelect: row.getCanSelect(),
		isSelected: row.getIsSelected(),
		toggleSelected: row.getCanSelect()
			? (next?: boolean) => row.toggleSelected(next)
			: undefined,
		canExpand: row.getCanExpand(),
		isExpanded: row.getIsExpanded(),
		toggleExpanded: row.getCanExpand()
			? (next?: boolean) => row.toggleExpanded(next)
			: undefined,
		expandedContent:
			row.getIsExpanded() && renderExpandedContent
				? renderExpandedContent(row.original, row.index)
				: undefined,
	}));
}
