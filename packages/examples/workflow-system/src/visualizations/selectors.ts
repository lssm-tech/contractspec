import type { VisualizationSurfaceItem } from '@contractspec/lib.design-system';
import type { WorkflowInstance } from '../handlers/workflow.handlers';
import {
	WorkflowActiveMetricVisualization,
	WorkflowCompletedMetricVisualization,
	WorkflowInstanceStatusVisualization,
	WorkflowThroughputVisualization,
} from './catalog';

type DateLike = Date | string;

interface WorkflowInstanceLike extends Pick<WorkflowInstance, 'status'> {
	startedAt: DateLike;
}

function toDayKey(value: DateLike): string {
	const date = value instanceof Date ? value : new Date(value);
	return date.toISOString().slice(0, 10);
}

export function createWorkflowVisualizationSections(
	instances: WorkflowInstanceLike[]
) {
	const statusCounts = new Map<string, number>();
	const throughput = new Map<string, number>();
	let activeCount = 0;
	let completedCount = 0;

	for (const instance of instances) {
		statusCounts.set(
			instance.status,
			(statusCounts.get(instance.status) ?? 0) + 1
		);
		const day = toDayKey(instance.startedAt);
		throughput.set(day, (throughput.get(day) ?? 0) + 1);
		if (instance.status === 'PENDING' || instance.status === 'IN_PROGRESS') {
			activeCount += 1;
		}
		if (instance.status === 'COMPLETED') {
			completedCount += 1;
		}
	}

	const primaryItems: VisualizationSurfaceItem[] = [
		{
			key: 'workflow-status',
			spec: WorkflowInstanceStatusVisualization,
			data: {
				data: Array.from(statusCounts.entries()).map(([status, count]) => ({
					status,
					instances: count,
				})),
			},
			title: 'Instance Status Breakdown',
			description: 'Status mix across workflow instances.',
			height: 260,
		},
		{
			key: 'workflow-throughput',
			spec: WorkflowThroughputVisualization,
			data: {
				data: Array.from(throughput.entries())
					.sort(([left], [right]) => left.localeCompare(right))
					.map(([day, count]) => ({ day, instances: count })),
			},
			title: 'Run Throughput',
			description: 'Daily workflow starts from current instances.',
		},
	];

	const comparisonItems: VisualizationSurfaceItem[] = [
		{
			key: 'workflow-active',
			spec: WorkflowActiveMetricVisualization,
			data: { data: [{ value: activeCount }] },
			title: 'Active Work',
			description: 'Pending and in-progress workflows.',
			height: 200,
		},
		{
			key: 'workflow-completed',
			spec: WorkflowCompletedMetricVisualization,
			data: { data: [{ value: completedCount }] },
			title: 'Completed Work',
			description: 'Completed workflows in the current sample.',
			height: 200,
		},
	];

	return {
		primaryItems,
		comparisonItems,
	};
}
