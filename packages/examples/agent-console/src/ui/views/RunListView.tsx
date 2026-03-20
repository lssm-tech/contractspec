'use client';

/**
 * Run List View - Shows agent execution runs with shared ContractSpec table primitives
 */
import type { ContractTableSort } from '@contractspec/lib.presentation-runtime-core';
import {
	EmptyState,
	ErrorState,
	LoaderBlock,
	StatCard,
	StatCardGroup,
} from '@contractspec/lib.design-system';
import { useState } from 'react';
import { useRunList } from '../hooks/useRunList';
import { formatTokens } from './run-list.shared';
import { RunDataTable } from './RunDataTable';

interface RunListViewProps {
	agentId?: string;
	onRunClick?: (runId: string) => void;
}

export function RunListView({ agentId, onRunClick }: RunListViewProps) {
	const [sorting, setSorting] = useState<ContractTableSort[]>([
		{ id: 'queuedAt', desc: true },
	]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 3,
	});
	const { data, metrics, loading, error, refetch } = useRunList({
		agentId,
		pageIndex: pagination.pageIndex,
		pageSize: pagination.pageSize,
		sorting,
	});

	if (loading && !data) {
		return <LoaderBlock label="Loading runs..." />;
	}

	if (error) {
		return (
			<ErrorState
				title="Failed to load runs"
				description={error.message}
				onRetry={refetch}
				retryLabel="Retry"
			/>
		);
	}

	if (!data?.items.length) {
		return (
			<EmptyState
				title="No runs yet"
				description="Execute an agent to see run history here."
			/>
		);
	}

	return (
		<div className="space-y-6">
			{metrics ? (
				<StatCardGroup>
					<StatCard label="Total Runs" value={metrics.totalRuns} />
					<StatCard
						label="Success Rate"
						value={`${(metrics.successRate * 100).toFixed(1)}%`}
					/>
					<StatCard
						label="Total Tokens"
						value={formatTokens(metrics.totalTokens)}
					/>
					<StatCard
						label="Total Cost"
						value={`$${metrics.totalCostUsd.toFixed(2)}`}
					/>
				</StatCardGroup>
			) : null}

			<RunDataTable
				runs={data.items}
				totalItems={data.total}
				pageIndex={pagination.pageIndex}
				pageSize={pagination.pageSize}
				sorting={sorting}
				loading={loading}
				onSortingChange={(nextSorting) => {
					setSorting(nextSorting);
					setPagination((current) => ({ ...current, pageIndex: 0 }));
				}}
				onPaginationChange={setPagination}
				onRunClick={onRunClick}
			/>
		</div>
	);
}
