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

export function showAllColumns(
	columns: ContractTableController<unknown, React.ReactNode>['columns']
) {
	columns.forEach((column) => column.toggleVisibility?.(true));
}

export function canHideDataColumn(
	columns: ContractTableController<unknown, React.ReactNode>['columns'],
	column: ContractTableColumnRenderModel<React.ReactNode>
) {
	if (column.kind !== 'data' || !column.visible) return true;
	return (
		columns.filter(
			(candidate) => candidate.kind === 'data' && candidate.visible
		).length > 1
	);
}

export function ColumnVisibilityMenu({
	columns,
}: {
	columns: ContractTableController<unknown, React.ReactNode>['columns'];
}) {
	const dataColumns = columns.filter((column) => column.kind === 'data');
	const hideableColumns = dataColumns.filter((column) => column.canHide);
	const hiddenColumns = hideableColumns.filter((column) => !column.visible);
	const hasPinnedColumns = dataColumns.some((column) => column.pinState);
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
				{hideableColumns.map((column) => {
					const isLastVisibleColumn = !canHideDataColumn(columns, column);
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
							<div className="flex w-full items-center justify-between gap-3">
								<span>{column.label}</span>
								{isLastVisibleColumn ? (
									<span className="text-muted-foreground text-xs">
										Required
									</span>
								) : null}
							</div>
						</DropdownMenuCheckboxItem>
					);
				})}
				{hiddenColumns.length || hasPinnedColumns ? (
					<>
						<DropdownMenuSeparator />
						{hiddenColumns.length ? (
							<DropdownMenuItem onClick={() => showAllColumns(hideableColumns)}>
								Show All Columns
							</DropdownMenuItem>
						) : null}
						{hasPinnedColumns ? (
							<DropdownMenuItem
								onClick={() =>
									dataColumns.forEach((column) => column.pin?.(false))
								}
							>
								Reset Pins
							</DropdownMenuItem>
						) : null}
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
	const pendingDelta = React.useRef(0);
	const frameRef = React.useRef<number | null>(null);
	const removeListenersRef = React.useRef<(() => void) | null>(null);

	const flushResize = React.useCallback(() => {
		frameRef.current = null;
		if (!pendingDelta.current) return;
		column.resizeBy?.(pendingDelta.current);
		pendingDelta.current = 0;
	}, [column]);

	const scheduleResize = React.useCallback(
		(delta: number) => {
			if (!Number.isFinite(delta) || delta === 0) return;
			pendingDelta.current += delta;
			if (frameRef.current != null) return;
			frameRef.current = window.requestAnimationFrame(flushResize);
		},
		[flushResize]
	);

	const cleanupResize = React.useCallback(() => {
		lastX.current = null;
		removeListenersRef.current?.();
		removeListenersRef.current = null;
		if (frameRef.current != null) {
			window.cancelAnimationFrame(frameRef.current);
			frameRef.current = null;
		}
		if (!pendingDelta.current) return;
		column.resizeBy?.(pendingDelta.current);
		pendingDelta.current = 0;
	}, [column]);

	React.useEffect(() => {
		return cleanupResize;
	}, [cleanupResize]);

	const beginResize = React.useCallback(
		(
			clientX: number,
			moveEventName: 'mousemove' | 'pointermove',
			endEventNames: ('mouseup' | 'pointerup' | 'pointercancel')[]
		) => {
			cleanupResize();
			lastX.current = clientX;

			const onMove = (moveEvent: MouseEvent | PointerEvent) => {
				if (lastX.current == null) return;
				const delta = moveEvent.clientX - lastX.current;
				lastX.current = moveEvent.clientX;
				scheduleResize(delta);
			};
			const onEnd = () => cleanupResize();
			const removeListeners = () => {
				window.removeEventListener(moveEventName, onMove);
				for (const eventName of endEventNames) {
					window.removeEventListener(eventName, onEnd);
				}
			};

			removeListenersRef.current = removeListeners;
			window.addEventListener(moveEventName, onMove);
			for (const eventName of endEventNames) {
				window.addEventListener(eventName, onEnd);
			}
		},
		[cleanupResize, scheduleResize]
	);

	const onPointerDown = React.useCallback(
		(event: React.PointerEvent<HTMLSpanElement>) => {
			event.preventDefault();
			event.stopPropagation();
			event.currentTarget.setPointerCapture?.(event.pointerId);
			beginResize(event.clientX, 'pointermove', ['pointerup', 'pointercancel']);
		},
		[beginResize]
	);

	const onMouseDown = React.useCallback(
		(event: React.MouseEvent<HTMLSpanElement>) => {
			if (typeof window.PointerEvent === 'function') {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			beginResize(event.clientX, 'mousemove', ['mouseup']);
		},
		[beginResize]
	);

	return (
		<span
			role="separator"
			aria-label={`Resize ${column.label} column`}
			aria-orientation="vertical"
			tabIndex={-1}
			className="absolute inset-y-0 right-0 flex w-3 cursor-col-resize items-center justify-center"
			onPointerDown={onPointerDown}
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
