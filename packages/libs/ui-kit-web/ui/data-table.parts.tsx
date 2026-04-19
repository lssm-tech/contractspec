'use client';

import type {
	ContractTableColumnRenderModel,
	ContractTableController,
	ContractTableRowRenderModel,
} from '@contractspec/lib.presentation-runtime-core';
import {
	ChevronDown,
	ChevronRight,
	Columns3,
	GripVertical,
	PanelLeft,
	PanelRight,
	PinOff,
} from 'lucide-react';
import * as React from 'react';
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

export function ColumnVisibilityMenu({
	columns,
}: {
	columns: ContractTableController<unknown, React.ReactNode>['columns'];
}) {
	const hideableColumns = columns.filter((column) => column.canHide);
	const hasHiddenColumns = hideableColumns.some((column) => !column.visible);
	if (!hideableColumns.length) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					<Columns3 className="h-4 w-4" />
					Columns
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{hideableColumns.map((column) => (
					<DropdownMenuCheckboxItem
						key={column.id}
						checked={column.visible}
						onCheckedChange={(checked) =>
							column.toggleVisibility?.(Boolean(checked))
						}
					>
						{column.label}
					</DropdownMenuCheckboxItem>
				))}
				{hasHiddenColumns ? (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								hideableColumns.forEach((column) =>
									column.toggleVisibility?.(true)
								);
							}}
						>
							Show All Columns
						</DropdownMenuItem>
					</>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function PinMenu({
	column,
}: {
	column: ContractTableColumnRenderModel<React.ReactNode>;
}) {
	if (!column.canPin) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6"
					onClick={(event) => event.stopPropagation()}
				>
					<Columns3 className="h-3.5 w-3.5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem onClick={() => column.pin?.('left')}>
					<PanelLeft className="h-4 w-4" />
					Pin Left
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => column.pin?.('right')}>
					<PanelRight className="h-4 w-4" />
					Pin Right
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => column.pin?.(false)}>
					<PinOff className="h-4 w-4" />
					Unpin
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function ResizeHandle({
	column,
}: {
	column: ContractTableColumnRenderModel<React.ReactNode>;
}) {
	const lastX = React.useRef<number | null>(null);
	const removeListenersRef = React.useRef<(() => void) | null>(null);

	React.useEffect(() => {
		return () => {
			removeListenersRef.current?.();
		};
	}, []);

	const onMouseDown = React.useCallback(
		(event: React.MouseEvent<HTMLSpanElement>) => {
			event.preventDefault();
			event.stopPropagation();
			lastX.current = event.clientX;

			const onMouseMove = (moveEvent: MouseEvent) => {
				if (lastX.current == null) return;
				const delta = moveEvent.clientX - lastX.current;
				lastX.current = moveEvent.clientX;
				column.resizeBy?.(delta);
			};

			const onMouseUp = () => {
				lastX.current = null;
				window.removeEventListener('mousemove', onMouseMove);
				window.removeEventListener('mouseup', onMouseUp);
			};

			removeListenersRef.current = onMouseUp;
			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUp);
		},
		[column]
	);

	return (
		<span
			role="separator"
			aria-label={`Resize ${column.label} column`}
			aria-orientation="vertical"
			tabIndex={-1}
			className="absolute inset-y-0 right-0 flex w-3 cursor-col-resize items-center justify-center"
			onMouseDown={onMouseDown}
		>
			<GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
		</span>
	);
}

export function renderHeaderContent<TItem>(
	controller: ContractTableController<TItem, React.ReactNode>,
	column: ContractTableColumnRenderModel<React.ReactNode>
) {
	if (column.kind === 'selection' && controller.selectionMode === 'multiple') {
		return (
			<Checkbox
				aria-label="Select all rows"
				checked={
					controller.allRowsSelected ||
					(controller.someRowsSelected ? 'indeterminate' : false)
				}
				onCheckedChange={(checked) =>
					controller.toggleAllRowsSelected?.(Boolean(checked))
				}
				onClick={(event) => event.stopPropagation()}
			/>
		);
	}
	if (column.kind === 'expansion') return null;
	return column.header;
}

export function renderCellContent<TItem>(
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
				checked={row.isSelected}
				onCheckedChange={(checked) => row.toggleSelected?.(Boolean(checked))}
				onClick={(event) => event.stopPropagation()}
			/>
		);
	}
	if (cell.kind === 'expansion') {
		return row.canExpand ? (
			<Button
				variant="ghost"
				size="icon"
				className="h-7 w-7"
				aria-label={
					row.isExpanded ? `Collapse row ${row.id}` : `Expand row ${row.id}`
				}
				onClick={(event) => {
					event.stopPropagation();
					row.toggleExpanded?.();
				}}
			>
				{row.isExpanded ? (
					<ChevronDown className="h-4 w-4" />
				) : (
					<ChevronRight className="h-4 w-4" />
				)}
			</Button>
		) : null;
	}
	return cell.content;
}

export function stickyStyle(
	column: ContractTableColumnRenderModel<React.ReactNode>,
	isHeader = false
) {
	return {
		width: column.size,
		minWidth: column.size,
		maxWidth: column.size,
		left: column.pinState === 'left' ? column.stickyOffset : undefined,
		right: column.pinState === 'right' ? column.stickyOffset : undefined,
		position: column.pinState ? 'sticky' : 'relative',
		zIndex: column.pinState ? (isHeader ? 30 : 20) : undefined,
	} as React.CSSProperties;
}

export function ariaSortValue(
	column: ContractTableColumnRenderModel<React.ReactNode>
) {
	if (column.kind !== 'data' || !column.canSort) return undefined;
	if (column.sortDirection === 'asc') return 'ascending';
	if (column.sortDirection === 'desc') return 'descending';
	return 'none';
}
