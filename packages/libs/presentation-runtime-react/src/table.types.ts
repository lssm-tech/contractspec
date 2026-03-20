import type {
	DataViewField,
	DataViewSpec,
} from '@contractspec/lib.contracts-spec/data-views';
import type {
	ContractTableCellAlign,
	ContractTableColumnRenderModel,
	ContractTableController,
	ContractTableExecutionMode,
	ContractTableInitialState,
	ContractTablePinState,
	ContractTableRowRenderModel,
	ContractTableSelectionMode,
	ContractTableState,
} from '@contractspec/lib.presentation-runtime-core';
import * as React from 'react';

export interface ContractTableColumnDef<TItem> {
	id?: string;
	header: React.ReactNode;
	label?: string;
	accessorKey?: string;
	accessor?: (item: TItem, rowIndex: number) => unknown;
	cell?: (args: {
		item: TItem;
		value: unknown;
		rowId: string;
		rowIndex: number;
		columnId: string;
	}) => React.ReactNode;
	align?: ContractTableCellAlign;
	size?: number;
	minSize?: number;
	maxSize?: number;
	canSort?: boolean;
	canHide?: boolean;
	canResize?: boolean;
	canPin?: boolean;
	defaultPinned?: ContractTablePinState;
}

export interface UseContractTableOptions<TItem> {
	data: readonly TItem[];
	columns: readonly ContractTableColumnDef<TItem>[];
	executionMode?: ContractTableExecutionMode;
	selectionMode?: ContractTableSelectionMode;
	totalItems?: number;
	getRowId?: (item: TItem, rowIndex: number) => string;
	getCanExpand?: (item: TItem, rowIndex: number) => boolean;
	renderExpandedContent?: (item: TItem, rowIndex: number) => React.ReactNode;
	initialState?: ContractTableInitialState;
	state?: Partial<ContractTableState>;
	onStateChange?: (state: ContractTableState) => void;
	onSortingChange?: (state: ContractTableState['sorting']) => void;
	onPaginationChange?: (state: ContractTableState['pagination']) => void;
	onColumnVisibilityChange?: (
		state: ContractTableState['columnVisibility']
	) => void;
	onColumnSizingChange?: (state: ContractTableState['columnSizing']) => void;
	onColumnPinningChange?: (state: ContractTableState['columnPinning']) => void;
	onExpandedChange?: (state: ContractTableState['expanded']) => void;
	onRowSelectionChange?: (state: ContractTableState['rowSelection']) => void;
}

export interface UseDataViewTableOptions<TItem extends Record<string, unknown>>
	extends Omit<
		UseContractTableOptions<TItem>,
		'columns' | 'renderExpandedContent'
	> {
	spec: DataViewSpec;
	renderValue?: (args: {
		item: TItem;
		field: DataViewField;
		value: unknown;
		rowIndex: number;
	}) => React.ReactNode;
	renderExpandedContent?: (args: {
		item: TItem;
		fields: DataViewField[];
		rowIndex: number;
	}) => React.ReactNode;
}

export type {
	ContractTableColumnRenderModel,
	ContractTableController,
	ContractTableRowRenderModel,
};
