'use client';

import { DataTable } from '@contractspec/lib.design-system';
import type { ContractTableSort } from '@contractspec/lib.presentation-runtime-core';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';
import * as React from 'react';
import type { Run } from '../hooks/useRunList';
import { createRunTableColumns } from './run-data-table.columns';
import { RunExpandedContent, RunTableToolbar } from './run-list.shared';

interface RunDataTableProps {
	runs: Run[];
	totalItems: number;
	pageIndex: number;
	pageSize: number;
	sorting: ContractTableSort[];
	loading?: boolean;
	onSortingChange: (nextSorting: ContractTableSort[]) => void;
	onPaginationChange: (nextPagination: {
		pageIndex: number;
		pageSize: number;
	}) => void;
	onRunClick?: (runId: string) => void;
}

export function RunDataTable({
	runs,
	totalItems,
	pageIndex,
	pageSize,
	sorting,
	loading,
	onSortingChange,
	onPaginationChange,
	onRunClick,
}: RunDataTableProps) {
	const columns = React.useMemo(() => createRunTableColumns(), []);
	const controller = useContractTable<Run>({
		data: runs,
		columns,
		executionMode: 'server',
		totalItems,
		state: {
			sorting,
			pagination: { pageIndex, pageSize },
		},
		onSortingChange,
		onPaginationChange,
		initialState: {
			columnVisibility: { estimatedCostUsd: false },
		},
		getRowId: (run) => run.id,
		renderExpandedContent: (run) => <RunExpandedContent run={run} />,
		getCanExpand: () => true,
	});

	return (
		<DataTable
			controller={controller}
			title="Run History"
			description="Server-mode ContractSpec table with shared pagination, sorting, visibility, and expansion."
			loading={loading}
			onRowPress={(row) => onRunClick?.(row.id)}
			toolbar={
				<RunTableToolbar controller={controller} totalRuns={totalItems} />
			}
			emptyState={
				<div className="rounded-md border border-dashed p-8 text-center text-muted-foreground text-sm">
					No runs yet
				</div>
			}
		/>
	);
}
