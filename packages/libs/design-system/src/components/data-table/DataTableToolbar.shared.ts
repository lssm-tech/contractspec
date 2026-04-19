import type { ContractTableController } from '@contractspec/lib.presentation-runtime-react';
import type * as React from 'react';

export interface DataTableToolbarChip {
	key: string;
	label: React.ReactNode;
	onRemove?: () => void;
}

export interface DataTableToolbarProps<TItem = unknown> {
	controller: ContractTableController<TItem, React.ReactNode>;
	className?: string;
	searchPlaceholder?: string;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	onSearchSubmit?: () => void;
	debounceMs?: number;
	activeChips?: DataTableToolbarChip[];
	onClearAll?: () => void;
	actionsStart?: React.ReactNode;
	actionsEnd?: React.ReactNode;
	selectionSummary?: React.ReactNode;
}

export function getHiddenDataColumns<TItem>(
	controller: ContractTableController<TItem, React.ReactNode>
) {
	return controller.columns.filter(
		(column) => column.kind === 'data' && column.canHide && !column.visible
	);
}

export function showHiddenDataColumns<TItem>(
	controller: ContractTableController<TItem, React.ReactNode>
) {
	getHiddenDataColumns(controller).forEach((column) =>
		column.toggleVisibility?.(true)
	);
}
