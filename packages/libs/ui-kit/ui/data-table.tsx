import type {
	ContractTableColumnRenderModel,
	ContractTableController,
	ContractTableRowRenderModel,
} from '@contractspec/lib.presentation-runtime-core';
import type { SharedDataTableProps } from '@contractspec/lib.ui-kit-core/interfaces';
import { ChevronDown, ChevronRight, Columns3 } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Pagination } from './atoms/Pagination';
import { Button } from './button';
import { Checkbox } from './checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './dropdown-menu';
import { Skeleton } from './skeleton';
import { HStack, VStack } from './stack';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './table';
import { Text } from './text';

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
	const leftColumns = controller.visibleColumns.filter(
		(column) => column.pinState === 'left'
	);
	const centerColumns = controller.visibleColumns.filter(
		(column) => !column.pinState
	);
	const rightColumns = controller.visibleColumns.filter(
		(column) => column.pinState === 'right'
	);

	return (
		<VStack gap="md" className={className}>
			<HStack justify="between" align="center">
				<View>{toolbar}</View>
				<ColumnVisibilityMenu columns={controller.columns} />
			</HStack>

			{loading ? (
				<VStack gap="sm">
					{Array.from({ length: 5 }).map((_, index) => (
						<Skeleton key={index} className="h-12 w-full" />
					))}
				</VStack>
			) : controller.rows.length === 0 ? (
				(emptyState ?? (
					<View className="rounded-md border border-border border-dashed p-6">
						<Text className="text-center text-muted-foreground">
							No rows available.
						</Text>
					</View>
				))
			) : (
				<View className="rounded-md border border-border">
					<HStack gap="none" align="start" wrap="nowrap">
						{leftColumns.length
							? renderSection(controller, leftColumns, onRowPress)
							: null}
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{renderSection(controller, centerColumns, onRowPress)}
						</ScrollView>
						{rightColumns.length
							? renderSection(controller, rightColumns, onRowPress)
							: null}
					</HStack>
				</View>
			)}

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
		</VStack>
	);
}

function renderSection<TItem>(
	controller: ContractTableController<TItem, React.ReactNode>,
	columns: ContractTableColumnRenderModel<React.ReactNode>[],
	onRowPress?: (
		row: ContractTableRowRenderModel<TItem, React.ReactNode>
	) => void
) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					{columns.map((column) => (
						<TableHead
							key={column.id}
							style={{ width: column.size, minWidth: column.size }}
						>
							<HStack gap="sm" align="center" justify="between" wrap="nowrap">
								<View>{renderHeaderContent(controller, column)}</View>
								{column.canResize ? <ResizeHandle column={column} /> : null}
							</HStack>
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{controller.rows.map((row) => {
					const cellsByColumnId = new Map(
						row.cells.map((cell) => [cell.columnId, cell])
					);

					return (
						<VStack key={row.id} gap="none">
							<TableRow onPress={() => onRowPress?.(row)}>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										style={{ width: column.size, minWidth: column.size }}
									>
										{renderCellContent(row, cellsByColumnId.get(column.id))}
									</TableCell>
								))}
							</TableRow>
							{row.isExpanded && row.expandedContent ? (
								<TableRow>
									<TableCell
										style={{
											width: columns.reduce(
												(sum, column) => sum + column.size,
												0
											),
										}}
									>
										{row.expandedContent}
									</TableCell>
								</TableRow>
							) : null}
						</VStack>
					);
				})}
			</TableBody>
		</Table>
	);
}

function ColumnVisibilityMenu({
	columns,
}: {
	columns: ContractTableController<unknown, React.ReactNode>['columns'];
}) {
	const dataColumns = columns.filter((column) => column.kind === 'data');
	const hideableColumns = dataColumns.filter((column) => column.canHide);
	const hiddenColumns = hideableColumns.filter((column) => !column.visible);
	const visibleDataColumns = dataColumns.filter((column) => column.visible);
	const hasPinnedColumns = dataColumns.some((column) => column.pinState);
	if (!hideableColumns.length) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					<Columns3 size={16} />
					<Text>Columns</Text>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{hideableColumns.map((column) => {
					const isLastVisibleColumn =
						column.visible && visibleDataColumns.length <= 1;
					return (
						<DropdownMenuCheckboxItem
							key={column.id}
							checked={column.visible}
							disabled={isLastVisibleColumn}
							onCheckedChange={(checked) => {
								const nextVisible = Boolean(checked);
								if (!nextVisible && isLastVisibleColumn) return;
								column.toggleVisibility?.(nextVisible);
							}}
						>
							<HStack justify="between" className="w-full">
								<Text>{column.label}</Text>
								{isLastVisibleColumn ? (
									<Text className="text-muted-foreground text-xs">
										Required
									</Text>
								) : null}
							</HStack>
						</DropdownMenuCheckboxItem>
					);
				})}
				{hiddenColumns.length || hasPinnedColumns ? (
					<>
						<DropdownMenuSeparator />
						{hiddenColumns.length ? (
							<DropdownMenuItem
								onPress={() =>
									hideableColumns.forEach((column) =>
										column.toggleVisibility?.(true)
									)
								}
							>
								<Text>Show All Columns</Text>
							</DropdownMenuItem>
						) : null}
						{hasPinnedColumns ? (
							<DropdownMenuItem
								onPress={() =>
									dataColumns.forEach((column) => column.pin?.(false))
								}
							>
								<Text>Reset Pins</Text>
							</DropdownMenuItem>
						) : null}
					</>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function ResizeHandle({
	column,
}: {
	column: ContractTableColumnRenderModel<React.ReactNode>;
}) {
	const lastTranslation = React.useRef(0);

	return (
		<PanGestureHandler
			onGestureEvent={(event) => {
				const delta = event.nativeEvent.translationX - lastTranslation.current;
				lastTranslation.current = event.nativeEvent.translationX;
				if (!Number.isFinite(delta) || delta === 0) return;
				column.resizeBy?.(delta);
			}}
			onEnded={() => {
				lastTranslation.current = 0;
			}}
			onCancelled={() => {
				lastTranslation.current = 0;
			}}
			onFailed={() => {
				lastTranslation.current = 0;
			}}
		>
			<View className="justify-center px-1">
				<Text className="text-muted-foreground text-xs">||</Text>
			</View>
		</PanGestureHandler>
	);
}

function renderHeaderContent<TItem>(
	controller: ContractTableController<TItem, React.ReactNode>,
	column: ContractTableColumnRenderModel<React.ReactNode>
) {
	if (column.kind === 'selection' && controller.selectionMode === 'multiple') {
		return (
			<Checkbox
				aria-label="Select all rows"
				accessibilityLabel="Select all rows"
				checked={controller.allRowsSelected || controller.someRowsSelected}
				onPress={(event: { stopPropagation?: () => void }) =>
					event.stopPropagation?.()
				}
				onCheckedChange={(checked) =>
					controller.toggleAllRowsSelected?.(Boolean(checked))
				}
			/>
		);
	}
	if (column.kind === 'expansion') return null;
	return typeof column.header === 'string' ? (
		<Text>{column.header}</Text>
	) : (
		column.header
	);
}

function renderCellContent<TItem>(
	row: ContractTableRowRenderModel<TItem, React.ReactNode>,
	cell:
		| ContractTableRowRenderModel<TItem, React.ReactNode>['cells'][number]
		| undefined
) {
	if (!cell) return null;
	if (cell.kind === 'selection') {
		return (
			<Checkbox
				aria-label={`Select row ${row.id}`}
				accessibilityLabel={`Select row ${row.id}`}
				checked={row.isSelected}
				onPress={(event: { stopPropagation?: () => void }) =>
					event.stopPropagation?.()
				}
				onCheckedChange={(checked) => row.toggleSelected?.(Boolean(checked))}
			/>
		);
	}
	if (cell.kind === 'expansion') {
		if (!row.canExpand) return null;
		return (
			<Button
				variant="ghost"
				size="icon"
				aria-label={
					row.isExpanded ? `Collapse row ${row.id}` : `Expand row ${row.id}`
				}
				accessibilityLabel={
					row.isExpanded ? `Collapse row ${row.id}` : `Expand row ${row.id}`
				}
				onPress={(event: { stopPropagation?: () => void }) => {
					event.stopPropagation?.();
					row.toggleExpanded?.();
				}}
			>
				{row.isExpanded ? (
					<ChevronDown size={16} />
				) : (
					<ChevronRight size={16} />
				)}
			</Button>
		);
	}
	return typeof cell.content === 'string' ? (
		<Text>{cell.content}</Text>
	) : (
		cell.content
	);
}
