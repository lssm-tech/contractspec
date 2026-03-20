'use client';

/**
 * Run List View - Shows agent execution runs with stats
 */
import {
	EmptyState,
	ErrorState,
	LoaderBlock,
	StatCard,
	StatCardGroup,
	StatusChip,
} from '@contractspec/lib.design-system';
import { type Run, useRunList } from '../hooks/useRunList';

interface RunListViewProps {
	agentId?: string;
	onRunClick?: (runId: string) => void;
}

function getStatusTone(
	status: Run['status']
): 'success' | 'warning' | 'neutral' | 'danger' {
	switch (status) {
		case 'COMPLETED':
			return 'success';
		case 'RUNNING':
			return 'warning';
		case 'QUEUED':
			return 'neutral';
		case 'FAILED':
		case 'CANCELLED':
			return 'danger';
		default:
			return 'neutral';
	}
}

function formatDuration(ms?: number): string {
	if (!ms) return '-';
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	return `${(ms / 60000).toFixed(1)}m`;
}

function formatTokens(tokens: number): string {
	if (tokens < 1000) return tokens.toString();
	if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
	return `${(tokens / 1000000).toFixed(2)}M`;
}

function formatCost(cost?: number): string {
	if (!cost) return '-';
	return `$${cost.toFixed(4)}`;
}

export function RunListView({ agentId, onRunClick }: RunListViewProps) {
	const { data, metrics, loading, error, refetch } = useRunList({ agentId });

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
			{/* Metrics Stats */}
			{metrics && (
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
			)}

			{/* Run List */}
			<div className="rounded-lg border border-border">
				<table className="w-full">
					<thead className="border-border border-b bg-muted/30">
						<tr>
							<th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
								Run
							</th>
							<th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
								Agent
							</th>
							<th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">
								Status
							</th>
							<th className="px-4 py-3 text-right font-medium text-muted-foreground text-sm">
								Tokens
							</th>
							<th className="px-4 py-3 text-right font-medium text-muted-foreground text-sm">
								Duration
							</th>
							<th className="px-4 py-3 text-right font-medium text-muted-foreground text-sm">
								Cost
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border">
						{data.items.map((run: Run) => (
							<tr
								key={run.id}
								className="cursor-pointer transition-colors hover:bg-muted/50"
								onClick={() => onRunClick?.(run.id)}
							>
								<td className="px-4 py-3">
									<div className="font-mono text-sm">{run.id.slice(-8)}</div>
									<div className="text-muted-foreground text-xs">
										{run.queuedAt.toLocaleString()}
									</div>
								</td>
								<td className="px-4 py-3">
									<span className="font-medium">{run.agentName}</span>
								</td>
								<td className="px-4 py-3">
									<StatusChip
										tone={getStatusTone(run.status)}
										label={run.status}
									/>
								</td>
								<td className="px-4 py-3 text-right font-mono text-sm">
									{formatTokens(run.totalTokens)}
								</td>
								<td className="px-4 py-3 text-right font-mono text-sm">
									{formatDuration(run.durationMs)}
								</td>
								<td className="px-4 py-3 text-right font-mono text-sm">
									{formatCost(run.estimatedCostUsd)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="text-center text-muted-foreground text-sm">
				Showing {data.items.length} of {data.total} runs
			</div>
		</div>
	);
}
