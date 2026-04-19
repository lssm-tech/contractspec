'use client';

import { Button } from '../atoms/Button';
import { FiltersToolbar } from '../molecules/FiltersToolbar';
import {
	type DataTableToolbarProps,
	getHiddenDataColumns,
	showHiddenDataColumns,
} from './DataTableToolbar.shared';

export function DataTableToolbar<TItem>({
	controller,
	className,
	searchPlaceholder,
	searchValue,
	onSearchChange,
	onSearchSubmit,
	debounceMs,
	activeChips = [],
	onClearAll,
	actionsStart,
	actionsEnd,
	selectionSummary,
}: DataTableToolbarProps<TItem>) {
	const hiddenColumns = getHiddenDataColumns(controller);
	const resolvedSelectionSummary =
		selectionSummary === undefined && controller.selectionMode !== 'none' ? (
			<span className="text-muted-foreground text-sm">
				Selected {controller.selectedRowIds.length}
			</span>
		) : (
			selectionSummary
		);

	return (
		<FiltersToolbar
			className={className}
			searchPlaceholder={searchPlaceholder}
			searchValue={searchValue}
			onSearchChange={onSearchChange}
			onSearchSubmit={onSearchSubmit}
			debounceMs={debounceMs}
			activeChips={activeChips}
			onClearAll={onClearAll}
			right={
				<div className="flex flex-wrap items-center justify-end gap-2">
					{resolvedSelectionSummary}
					{hiddenColumns.length ? (
						<Button
							variant="outline"
							size="sm"
							onPress={() => showHiddenDataColumns(controller)}
						>
							Show {hiddenColumns.length} Hidden
						</Button>
					) : null}
					{actionsEnd}
				</div>
			}
		>
			{actionsStart}
		</FiltersToolbar>
	);
}

export type { DataTableToolbarProps } from './DataTableToolbar.shared';
