'use client';

import type {
	ContractTableController,
	ContractTableRowRenderModel,
} from '@contractspec/lib.presentation-runtime-core';
import type { SharedDataTableProps } from '@contractspec/lib.ui-kit-core/interfaces';
import { cn } from '@contractspec/lib.ui-kit-core/utils';
import * as React from 'react';
import { Pagination } from './atoms/Pagination';
import {
	ariaSortValue,
	ColumnVisibilityMenu,
	PinMenu,
	ResizeHandle,
	renderCellContent,
	renderHeaderContent,
	stickyStyle,
} from './data-table.parts';
import { Skeleton } from './skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './table';

export interface DataTableProps<TItem = unknown>
	extends SharedDataTableProps<TItem> {
	controller: ContractTableController<TItem, React.ReactNode>;
	onRowPress?: (
		row: ContractTableRowRenderModel<TItem, React.ReactNode>
	) => void;
}

export function DataTable<TItem>({
	controller,
	className,
	toolbar,
	footer,
	emptyState,
	loading,
	onRowPress,
}: DataTableProps<TItem>) {
	return (
		<div className={cn('space-y-3', className)}>
			<div
				className={cn(
					'flex items-center gap-3',
					toolbar ? 'justify-between' : 'justify-end'
				)}
			>
				<div>{toolbar}</div>
				<ColumnVisibilityMenu columns={controller.columns} />
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						{controller.visibleColumns.map((column) => (
							<TableHead
								key={column.id}
								aria-sort={ariaSortValue(column)}
								className="relative bg-background"
								style={stickyStyle(column, true)}
							>
								<div className="flex items-center gap-2">
									{column.kind === 'data' && column.canSort ? (
										<button
											type="button"
											className="inline-flex items-center gap-2 text-left font-medium text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
											onClick={column.toggleSorting}
										>
											{renderHeaderContent(controller, column)}
											{column.sortDirection ? (
												<span className="text-muted-foreground text-xs uppercase">
													{column.sortDirection}
												</span>
											) : null}
										</button>
									) : (
										<>
											{renderHeaderContent(controller, column)}
											{column.kind === 'data' && column.sortDirection ? (
												<span className="text-muted-foreground text-xs uppercase">
													{column.sortDirection}
												</span>
											) : null}
										</>
									)}
									{column.kind === 'data' ? <PinMenu column={column} /> : null}
								</div>
								{column.canResize ? <ResizeHandle column={column} /> : null}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{loading
						? Array.from({ length: 5 }).map((_, rowIndex) => (
								<TableRow key={`loading-${rowIndex}`}>
									{controller.visibleColumns.map((column) => (
										<TableCell
											key={`${column.id}-${rowIndex}`}
											style={stickyStyle(column)}
										>
											<Skeleton className="h-4 w-full" />
										</TableCell>
									))}
								</TableRow>
							))
						: controller.rows.map((row) =>
								(() => {
									const cellsByColumnId = new Map(
										row.cells.map((cell) => [cell.columnId, cell])
									);
									return (
										<React.Fragment key={row.id}>
											<TableRow
												data-state={row.isSelected ? 'selected' : undefined}
												className={onRowPress ? 'cursor-pointer' : undefined}
												onClick={() => onRowPress?.(row)}
											>
												{controller.visibleColumns.map((column) => (
													<TableCell
														key={column.id}
														style={stickyStyle(column)}
													>
														{renderCellContent(
															row,
															cellsByColumnId.get(column.id)
														)}
													</TableCell>
												))}
											</TableRow>
											{row.isExpanded && row.expandedContent ? (
												<TableRow>
													<TableCell
														className="bg-muted/20 text-muted-foreground text-sm"
														colSpan={controller.visibleColumns.length}
													>
														{row.expandedContent}
													</TableCell>
												</TableRow>
											) : null}
										</React.Fragment>
									);
								})()
							)}
				</TableBody>
			</Table>

			{!loading && controller.rows.length === 0
				? (emptyState ?? (
						<div className="rounded-md border border-dashed p-8 text-center text-muted-foreground text-sm">
							No rows available.
						</div>
					))
				: null}

			{controller.pageCount > 0 ? (
				<Pagination
					currentPage={controller.pageIndex + 1}
					totalPages={controller.pageCount}
					totalItems={controller.totalItems}
					itemsPerPage={controller.pageSize}
					onPageChange={(page) => controller.setPageIndex(page - 1)}
					onItemsPerPageChange={(pageSize) => controller.setPageSize(pageSize)}
				/>
			) : null}

			{footer}
		</div>
	);
}
