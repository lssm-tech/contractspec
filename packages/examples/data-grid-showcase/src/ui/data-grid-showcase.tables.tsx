'use client';

import { DataTable } from '@contractspec/lib.design-system';
import type { ContractTableSort } from '@contractspec/lib.presentation-runtime-core';
import {
	useContractTable,
	useDataViewTable,
} from '@contractspec/lib.presentation-runtime-react';
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
	ShowcaseToolbar,
	StatusBadge,
} from './data-grid-showcase.parts';

export function ClientModeTable() {
	const columns = useShowcaseColumns();
	const controller = useContractTable<ShowcaseRow>({
		data: SHOWCASE_ROWS,
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
			title="Generic Client"
			description="All table features driven by the shared headless controller with local data."
			toolbar={
				<ShowcaseToolbar
					controller={controller}
					label="Client mode"
					primaryColumnId="account"
					toggleColumnId="notes"
					pinColumnId="owner"
				/>
			}
			footer={`Page ${controller.pageIndex + 1} of ${controller.pageCount}`}
		/>
	);
}

export function ServerModeTable() {
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

	React.useEffect(() => {
		let active = true;
		setLoading(true);
		void fetchShowcaseRows({
			pageIndex: pagination.pageIndex,
			pageSize: pagination.pageSize,
			sorting,
		}).then((result) => {
			if (!active) return;
			setRows(result.items);
			setTotal(result.total);
			setLoading(false);
		});
		return () => {
			active = false;
		};
	}, [pagination.pageIndex, pagination.pageSize, sorting]);

	const controller = useContractTable<ShowcaseRow>({
		data: rows,
		columns,
		executionMode: 'server',
		selectionMode: 'multiple',
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
			title="Generic Server"
			description="Same API, but sorting and pagination stay remote to simulate larger datasets."
			loading={loading}
			toolbar={
				<ShowcaseToolbar
					controller={controller}
					label="Server mode"
					primaryColumnId="account"
					toggleColumnId="notes"
					pinColumnId="owner"
				/>
			}
			footer={`Remote rows ${rows.length} / ${total}`}
		/>
	);
}

export function DataViewModeTable() {
	const controller = useDataViewTable<ShowcaseRow>({
		spec: DataGridShowcaseDataView,
		data: SHOWCASE_ROWS,
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
			title="DataView Adapter"
			description="Declarative DataView contract adapted onto the same table primitive."
			toolbar={
				<ShowcaseToolbar
					controller={controller}
					label="DataView mode"
					primaryColumnId="account"
					toggleColumnId="notes"
					pinColumnId="owner"
				/>
			}
			footer={`DataView rows ${controller.totalItems}`}
		/>
	);
}
