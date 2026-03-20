import type { VisualizationSurfaceItem } from '@contractspec/lib.design-system';
import type { Run } from '../ui/hooks/useRunList';
import {
	AgentRunActivityVisualization,
	AgentRunEfficiencyVisualization,
	AgentRunStatusVisualization,
} from './catalog';

function dayKey(value: Date | undefined): string {
	if (!value) return 'unknown';
	return value.toISOString().slice(0, 10);
}

export function createAgentVisualizationItems(
	runs: Run[]
): VisualizationSurfaceItem[] {
	const statusCounts = new Map<string, number>();
	const activityCounts = new Map<string, number>();

	for (const run of runs) {
		statusCounts.set(run.status, (statusCounts.get(run.status) ?? 0) + 1);
		activityCounts.set(dayKey(run.startedAt ?? run.queuedAt), (activityCounts.get(dayKey(run.startedAt ?? run.queuedAt)) ?? 0) + 1);
	}

	return [
		{
			key: 'run-status',
			spec: AgentRunStatusVisualization,
			data: {
				data: Array.from(statusCounts.entries()).map(([status, count]) => ({
					status,
					runs: count,
				})),
			},
			title: 'Run Status Breakdown',
			description: 'Completed, failed, running, and cancelled runs in the sample.',
			height: 260,
		},
		{
			key: 'run-activity',
			spec: AgentRunActivityVisualization,
			data: {
				data: Array.from(activityCounts.entries())
					.sort(([left], [right]) => left.localeCompare(right))
					.map(([day, count]) => ({ day, runs: count })),
			},
			title: 'Recent Run Activity',
			description: 'Daily run volume derived from run start times.',
		},
		{
			key: 'run-efficiency',
			spec: AgentRunEfficiencyVisualization,
			data: {
				data: runs
					.filter((run) => typeof run.durationMs === 'number')
					.map((run) => ({
						totalTokens: run.totalTokens,
						durationMs: run.durationMs ?? 0,
						estimatedCostUsd: run.estimatedCostUsd,
					})),
			},
			title: 'Duration vs Tokens',
			description: 'Operational scatter plot for spotting inefficient runs.',
		},
	];
}
