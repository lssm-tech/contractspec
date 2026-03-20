import type { VisualizationSurfaceItem } from '@contractspec/lib.design-system';
import type { Project } from '../handlers/saas.handlers';
import {
	SaasProjectActivityVisualization,
	SaasProjectStatusVisualization,
	SaasProjectTierVisualization,
	SaasProjectUsageVisualization,
} from './catalog';

type DateLike = Date | string;

interface ProjectLike extends Pick<Project, 'status' | 'tier'> {
	createdAt: DateLike;
}

function toDayKey(value: DateLike): string {
	const date = value instanceof Date ? value : new Date(value);
	return date.toISOString().slice(0, 10);
}

export function createSaasVisualizationItems(
	projects: ProjectLike[],
	projectLimit = 10
): VisualizationSurfaceItem[] {
	const statusCounts = new Map<string, number>();
	const tierCounts = new Map<string, number>();
	const activityCounts = new Map<string, number>();

	for (const project of projects) {
		statusCounts.set(
			project.status,
			(statusCounts.get(project.status) ?? 0) + 1
		);
		tierCounts.set(project.tier, (tierCounts.get(project.tier) ?? 0) + 1);
		const day = toDayKey(project.createdAt);
		activityCounts.set(day, (activityCounts.get(day) ?? 0) + 1);
	}

	return [
		{
			key: 'saas-capacity',
			spec: SaasProjectUsageVisualization,
			data: { data: [{ totalProjects: projects.length, projectLimit }] },
			title: 'Project Capacity',
			description: 'Current project count compared to the active limit.',
			height: 220,
		},
		{
			key: 'saas-status',
			spec: SaasProjectStatusVisualization,
			data: {
				data: Array.from(statusCounts.entries()).map(([status, count]) => ({
					status,
					projects: count,
				})),
			},
			title: 'Project Status',
			description: 'Status mix across the current project portfolio.',
			height: 260,
		},
		{
			key: 'saas-tier',
			spec: SaasProjectTierVisualization,
			data: {
				data: Array.from(tierCounts.entries()).map(([tier, count]) => ({
					tier,
					projects: count,
				})),
			},
			title: 'Tier Comparison',
			description: 'How projects are distributed across tiers.',
		},
		{
			key: 'saas-activity',
			spec: SaasProjectActivityVisualization,
			data: {
				data: Array.from(activityCounts.entries())
					.sort(([left], [right]) => left.localeCompare(right))
					.map(([day, count]) => ({ day, projects: count })),
			},
			title: 'Recent Project Activity',
			description: 'Daily project creation activity.',
		},
	];
}
