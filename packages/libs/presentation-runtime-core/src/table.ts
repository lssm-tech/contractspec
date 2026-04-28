export type ContractTableExecutionMode = 'client' | 'server';

export type ContractTableSelectionMode = 'none' | 'single' | 'multiple';

export type ContractTablePinState = false | 'left' | 'right';

export type ContractTableCellAlign = 'left' | 'center' | 'right';

export type ContractTableOverflowBehavior =
	| 'truncate'
	| 'wrap'
	| 'expand'
	| 'none';

export interface ContractTableSort {
	id: string;
	desc: boolean;
}

export interface ContractTablePaginationState {
	pageIndex: number;
	pageSize: number;
}

export interface ContractTablePinningState {
	left: string[];
	right: string[];
}

export type ContractTableVisibilityState = Record<string, boolean>;

export type ContractTableSizingState = Record<string, number>;

export type ContractTableExpandedState = Record<string, boolean>;

export type ContractTableRowSelectionState = Record<string, boolean>;

export interface ContractTableState {
	sorting: ContractTableSort[];
	pagination: ContractTablePaginationState;
	columnVisibility: ContractTableVisibilityState;
	columnSizing: ContractTableSizingState;
	columnPinning: ContractTablePinningState;
	expanded: ContractTableExpandedState;
	rowSelection: ContractTableRowSelectionState;
}

export type ContractTableInitialState = Partial<ContractTableState>;

export interface ContractTableColumnRenderModel<TContent = unknown> {
	id: string;
	kind: 'data' | 'selection' | 'expansion';
	header: TContent;
	label: string;
	align: ContractTableCellAlign;
	size: number;
	minSize?: number;
	maxSize?: number;
	overflow?: ContractTableOverflowBehavior;
	pinState: ContractTablePinState;
	stickyOffset?: number;
	canSort: boolean;
	sortDirection: false | 'asc' | 'desc';
	canHide: boolean;
	visible: boolean;
	canPin: boolean;
	canResize: boolean;
	isResizing: boolean;
	toggleSorting?: () => void;
	toggleVisibility?: (next?: boolean) => void;
	pin?: (next: ContractTablePinState) => void;
	resizeBy?: (delta: number) => void;
	setSize?: (size: number) => void;
}

export interface ContractTableCellRenderModel<TContent = unknown> {
	id: string;
	columnId: string;
	kind: 'data' | 'selection' | 'expansion';
	content: TContent;
	align: ContractTableCellAlign;
	size: number;
	overflow?: ContractTableOverflowBehavior;
	pinState: ContractTablePinState;
	stickyOffset?: number;
}

export interface ContractTableRowRenderModel<
	TItem = unknown,
	TContent = unknown,
> {
	id: string;
	original: TItem;
	depth: number;
	cells: ContractTableCellRenderModel<TContent>[];
	canSelect: boolean;
	isSelected: boolean;
	toggleSelected?: (next?: boolean) => void;
	canExpand: boolean;
	isExpanded: boolean;
	toggleExpanded?: (next?: boolean) => void;
	expandedContent?: TContent;
}

export interface ContractTableController<TItem = unknown, TContent = unknown> {
	executionMode: ContractTableExecutionMode;
	selectionMode: ContractTableSelectionMode;
	columns: ContractTableColumnRenderModel<TContent>[];
	visibleColumns: ContractTableColumnRenderModel<TContent>[];
	rows: ContractTableRowRenderModel<TItem, TContent>[];
	selectedRowIds: string[];
	allRowsSelected: boolean;
	someRowsSelected: boolean;
	toggleAllRowsSelected?: (next?: boolean) => void;
	pageIndex: number;
	pageSize: number;
	pageCount: number;
	totalItems: number;
	canNextPage: boolean;
	canPreviousPage: boolean;
	nextPage: () => void;
	previousPage: () => void;
	setPageIndex: (pageIndex: number) => void;
	setPageSize: (pageSize: number) => void;
}

export function createEmptyTableState(): ContractTableState {
	return {
		sorting: [],
		pagination: {
			pageIndex: 0,
			pageSize: 25,
		},
		columnVisibility: {},
		columnSizing: {},
		columnPinning: {
			left: [],
			right: [],
		},
		expanded: {},
		rowSelection: {},
	};
}
