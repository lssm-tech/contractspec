'use client';

import { DataTable } from '@contractspec/lib.design-system';
import type { ContractTableSort } from '@contractspec/lib.presentation-runtime-core';
import {
	useContractTable,
	useDataViewTable,
} from '@contractspec/lib.presentation-runtime-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { DataTable as WebPrimitiveDataTable } from '@contractspec/lib.ui-kit-web/ui/data-table';
import * as React from 'react';
import { DataGridShowcaseDataView } from '../contracts/data-grid-showcase.data-view';
import { useShowcaseColumns } from './data-grid-showcase.columns';
import {
	fetchShowcaseRows,
	SHOWCASE_ROWS,
	type ShowcaseRow,
} from './data-grid-showcase.data';
import {
	ExpandedRowContent,
	formatCurrency,
	formatDate,
	formatDateTime,
	ShowcaseHeaderActions,
	ShowcaseToolbar,
	StatusBadge,
} from './data-grid-showcase.parts';

function logRowPress(
	label: string,
	row: ShowcaseRow,
	onEvent?: (message: string) => void
) {
	onEvent?.(`${label}: pressed row "${row.account}" (${row.status})`);
}

export function ClientModeTable({
	onEvent,
}: {
	onEvent?: (message: string) => void;
}) {
	const columns = useShowcaseColumns();
	const [loading, setLoading] = React.useState(false);
	const [showEmpty, setShowEmpty] = React.useState(false);
	const rows = showEmpty ? [] : SHOWCASE_ROWS;
	const controller = useContractTable<ShowcaseRow>({
		data: rows,
		columns,
		selectionMode: 'multiple',
		initialState: {
			sorting: [{ id: 'arr', desc: true }],
			pagination: { pageIndex: 0, pageSize: 4 },
			columnVisibility: { notes: false },
			columnPinning: { left: ['account'], right: [] },
		},
		renderExpandedContent: (row) => <ExpandedRowContent row={row} />,
		getCanExpand: () => true,
	});

	return (
		<DataTable
			controller={controller}
			title="Client Controller + Design System"
			description="The design-system wrapper adds title, description, header actions, toolbar, footer, loading, and empty states on top of the shared headless controller."
			headerActions={
				<ShowcaseHeaderActions
					label="Client"
					loading={loading}
					showEmpty={showEmpty}
					onToggleLoading={() => {
						setLoading((current) => !current);
						onEvent?.('Client: toggled simulated loading');
					}}
					onToggleEmpty={() => {
						setShowEmpty((current) => !current);
						onEvent?.('Client: toggled empty-state mode');
					}}
					onReset={() => {
						setLoading(false);
						setShowEmpty(false);
						onEvent?.('Client: reset header actions');
					}}
				/>
			}
			loading={loading}
			emptyState={
				<div className="rounded-md border border-dashed p-6 text-center text-muted-foreground text-sm">
					Client mode is showing the empty state on purpose.
				</div>
			}
			toolbar={
				<ShowcaseToolbar
					controller={controller}
					label="Client mode"
					primaryColumnId="account"
					toggleColumnId="notes"
					pinColumnId="owner"
					sortColumnIds={['arr', 'renewalDate']}
					onAction={onEvent}
				/>
			}
			footer={`Page ${controller.pageIndex + 1} of ${controller.pageCount}`}
			onRowPress={(row) => logRowPress('Client', row.original, onEvent)}
		/>
	);
}

export function ServerModeTable({
	onEvent,
}: {
	onEvent?: (message: string) => void;
}) {
	const columns = useShowcaseColumns();
	const [sorting, setSorting] = React.useState<ContractTableSort[]>([
		{ id: 'arr', desc: true },
	]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 3,
	});
	const [rows, setRows] = React.useState<ShowcaseRow[]>([]);
	const [total, setTotal] = React.useState(SHOWCASE_ROWS.length);
	const [loading, setLoading] = React.useState(true);
	const [showEmpty, setShowEmpty] = React.useState(false);
	const [forceLoading, setForceLoading] = React.useState(false);

	React.useEffect(() => {
		let active = true;
		setLoading(true);
		void fetchShowcaseRows({
			pageIndex: pagination.pageIndex,
			pageSize: pagination.pageSize,
			sorting,
			empty: showEmpty,
		}).then((result) => {
			if (!active) return;
			setRows(result.items);
			setTotal(result.total);
			setLoading(false);
		});
		return () => {
			active = false;
		};
	}, [pagination.pageIndex, pagination.pageSize, showEmpty, sorting]);

	const controller = useContractTable<ShowcaseRow>({
		data: rows,
		columns,
		executionMode: 'server',
		selectionMode: 'single',
		totalItems: total,
		state: { sorting, pagination },
		onSortingChange: (nextSorting) => {
			setSorting(nextSorting);
			setPagination((current) => ({ ...current, pageIndex: 0 }));
		},
		onPaginationChange: setPagination,
		initialState: {
			columnVisibility: { notes: false },
			columnPinning: { left: ['account'], right: [] },
		},
		renderExpandedContent: (row) => <ExpandedRowContent row={row} />,
		getCanExpand: () => true,
	});

	return (
		<DataTable
			controller={controller}
			title="Server Controller + Design System"
			description="The same headless controller can stay fully remote for sorting and pagination while still rendering selection, pinning, resizing, and expansion locally."
			headerActions={
				<ShowcaseHeaderActions
					label="Server"
					loading={forceLoading}
					showEmpty={showEmpty}
					onToggleLoading={() => {
						setForceLoading((current) => !current);
						onEvent?.('Server: toggled forced loading');
					}}
					onToggleEmpty={() => {
						setShowEmpty((current) => !current);
						setPagination((current) => ({ ...current, pageIndex: 0 }));
						onEvent?.('Server: toggled empty-state mode');
					}}
					onReset={() => {
						setForceLoading(false);
						setShowEmpty(false);
						setSorting([{ id: 'arr', desc: true }]);
						setPagination({ pageIndex: 0, pageSize: 3 });
						onEvent?.('Server: reset controller state');
					}}
				/>
			}
			loading={loading || forceLoading}
			emptyState={
				<div className="rounded-md border border-dashed p-6 text-center text-muted-foreground text-sm">
					Server mode is returning an empty remote page.
				</div>
			}
			toolbar={
				<ShowcaseToolbar
					controller={controller}
					label="Server mode"
					primaryColumnId="account"
					toggleColumnId="notes"
					pinColumnId="owner"
					sortColumnIds={['arr', 'renewalDate']}
					onAction={onEvent}
				/>
			}
			footer={`Remote rows ${rows.length} / ${total}`}
			onRowPress={(row) => logRowPress('Server', row.original, onEvent)}
		/>
	);
}

export function DataViewModeTable({
	onEvent,
}: {
	onEvent?: (message: string) => void;
}) {
	const [loading, setLoading] = React.useState(false);
	const [showEmpty, setShowEmpty] = React.useState(false);
	const rows = showEmpty ? [] : SHOWCASE_ROWS;
	const controller = useDataViewTable<ShowcaseRow>({
		spec: DataGridShowcaseDataView,
		data: rows,
		renderValue: ({ field, value }) => {
			if (field.key === 'status') {
				return <StatusBadge status={value as ShowcaseRow['status']} />;
			}
			if (field.key === 'arr') {
				return formatCurrency(Number(value));
			}
			if (field.key === 'renewalDate') {
				return formatDate(String(value));
			}
			if (field.key === 'lastActivityAt') {
				return formatDateTime(String(value));
			}
			return String(value ?? '');
		},
		renderExpandedContent: ({ item }) => <ExpandedRowContent row={item} />,
	});

	return (
		<DataTable
			controller={controller}
			title="DataView Contract + Design System"
			description="The declarative DataView contract maps onto the exact same table controller, so sorting, visibility, pinning, expansion, and pagination stay aligned with the contract."
			headerActions={
				<ShowcaseHeaderActions
					label="DataView"
					loading={loading}
					showEmpty={showEmpty}
					onToggleLoading={() => {
						setLoading((current) => !current);
						onEvent?.('DataView: toggled simulated loading');
					}}
					onToggleEmpty={() => {
						setShowEmpty((current) => !current);
						onEvent?.('DataView: toggled empty-state mode');
					}}
					onReset={() => {
						setLoading(false);
						setShowEmpty(false);
						onEvent?.('DataView: reset header actions');
					}}
				/>
			}
			loading={loading}
			emptyState={
				<div className="rounded-md border border-dashed p-6 text-center text-muted-foreground text-sm">
					The declarative DataView lane is intentionally empty.
				</div>
			}
			toolbar={
				<ShowcaseToolbar
					controller={controller}
					label="DataView mode"
					primaryColumnId="account"
					toggleColumnId="notes"
					pinColumnId="owner"
					sortColumnIds={['arr', 'renewalDate']}
					onAction={onEvent}
				/>
			}
			footer={`DataView rows ${controller.totalItems}`}
			onRowPress={(row) => logRowPress('DataView', row.original, onEvent)}
		/>
	);
}

export function WebPrimitiveTable({
	onEvent,
}: {
	onEvent?: (message: string) => void;
}) {
	const columns = useShowcaseColumns();
	const [loading, setLoading] = React.useState(false);
	const [showEmpty, setShowEmpty] = React.useState(false);
	const rows = showEmpty ? [] : SHOWCASE_ROWS;
	const controller = useContractTable<ShowcaseRow>({
		data: rows,
		columns,
		selectionMode: 'single',
		initialState: {
			sorting: [{ id: 'lastActivityAt', desc: true }],
			pagination: { pageIndex: 0, pageSize: 4 },
			columnVisibility: { notes: false },
			columnPinning: { left: ['account'], right: [] },
		},
		renderExpandedContent: (row) => <ExpandedRowContent row={row} />,
		getCanExpand: () => true,
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Raw Web Primitive</CardTitle>
				<CardDescription>
					This lane renders the unwrapped <code>ui-kit-web/ui/data-table</code>{' '}
					component directly. It still supports loading, empty state, selection,
					visibility, resizing, pinning, expansion, and pagination, but title,
					description, and header actions are intentionally owned by the
					design-system wrapper.
				</CardDescription>
				<ShowcaseHeaderActions
					label="Web primitive"
					loading={loading}
					showEmpty={showEmpty}
					onToggleLoading={() => {
						setLoading((current) => !current);
						onEvent?.('Web primitive: toggled simulated loading');
					}}
					onToggleEmpty={() => {
						setShowEmpty((current) => !current);
						onEvent?.('Web primitive: toggled empty-state mode');
					}}
					onReset={() => {
						setLoading(false);
						setShowEmpty(false);
						onEvent?.('Web primitive: reset header actions');
					}}
				/>
			</CardHeader>
			<CardContent>
				<WebPrimitiveDataTable
					controller={controller}
					loading={loading}
					emptyState={
						<div className="rounded-md border border-dashed p-6 text-center text-muted-foreground text-sm">
							The raw primitive is intentionally showing its empty state.
						</div>
					}
					toolbar={
						<ShowcaseToolbar
							controller={controller}
							label="Web primitive"
							primaryColumnId="account"
							toggleColumnId="notes"
							pinColumnId="owner"
							sortColumnIds={['arr', 'renewalDate']}
							onAction={onEvent}
						/>
					}
					footer={`Single-select primitive rows ${controller.totalItems}`}
					onRowPress={(row) =>
						logRowPress('Web primitive', row.original, onEvent)
					}
				/>
			</CardContent>
		</Card>
	);
}
