import { VisualizationRegistry, defineVisualization } from '@contractspec/lib.contracts-spec/visualizations';

const PROJECT_LIST_REF = { key: 'saas.project.list', version: '1.0.0' } as const;
const META = {
	version: '1.0.0',
	domain: 'saas',
	stability: 'experimental' as const,
	owners: ['@example.saas-boilerplate'],
	tags: ['saas', 'visualization', 'projects'],
};

export const SaasProjectUsageVisualization = defineVisualization({
	meta: {
		...META,
		key: 'saas-boilerplate.visualization.project-usage',
		title: 'Project Capacity',
		description: 'Current project count against the current plan limit.',
		goal: 'Show usage against the active plan allowance.',
		context: 'SaaS account overview.',
	},
	source: { primary: PROJECT_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'metric',
		measure: 'totalProjects',
		comparisonMeasure: 'projectLimit',
		measures: [
			{ key: 'totalProjects', label: 'Projects', dataPath: 'totalProjects', format: 'number' },
			{ key: 'projectLimit', label: 'Plan Limit', dataPath: 'projectLimit', format: 'number' },
		],
		table: { caption: 'Current project count and plan limit.' },
	},
});

export const SaasProjectStatusVisualization = defineVisualization({
	meta: {
		...META,
		key: 'saas-boilerplate.visualization.project-status',
		title: 'Project Status',
		description: 'Distribution of project states.',
		goal: 'Show the mix of active, draft, and archived projects.',
		context: 'Project portfolio overview.',
	},
	source: { primary: PROJECT_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'pie',
		nameDimension: 'status',
		valueMeasure: 'projects',
		dimensions: [{ key: 'status', label: 'Status', dataPath: 'status', type: 'category' }],
		measures: [{ key: 'projects', label: 'Projects', dataPath: 'projects', format: 'number' }],
		table: { caption: 'Project counts by status.' },
	},
});

export const SaasProjectTierVisualization = defineVisualization({
	meta: {
		...META,
		key: 'saas-boilerplate.visualization.project-tiers',
		title: 'Tier Comparison',
		description: 'Distribution of projects across tiers.',
		goal: 'Compare how the current portfolio is distributed by tier.',
		context: 'Plan and packaging overview.',
	},
	source: { primary: PROJECT_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'bar',
		xDimension: 'tier',
		yMeasures: ['projects'],
		dimensions: [{ key: 'tier', label: 'Tier', dataPath: 'tier', type: 'category' }],
		measures: [{ key: 'projects', label: 'Projects', dataPath: 'projects', format: 'number', color: '#1d4ed8' }],
		table: { caption: 'Project counts by tier.' },
	},
});

export const SaasProjectActivityVisualization = defineVisualization({
	meta: {
		...META,
		key: 'saas-boilerplate.visualization.project-activity',
		title: 'Recent Project Activity',
		description: 'Daily project creation activity.',
		goal: 'Show recent project activity over time.',
		context: 'Project portfolio trend view.',
	},
	source: { primary: PROJECT_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'line',
		xDimension: 'day',
		yMeasures: ['projects'],
		dimensions: [{ key: 'day', label: 'Day', dataPath: 'day', type: 'time' }],
		measures: [{ key: 'projects', label: 'Projects', dataPath: 'projects', format: 'number', color: '#0f766e' }],
		table: { caption: 'Daily project creation counts.' },
	},
});

export const SaasVisualizationSpecs = [
	SaasProjectUsageVisualization,
	SaasProjectStatusVisualization,
	SaasProjectTierVisualization,
	SaasProjectActivityVisualization,
] as const;

export const SaasVisualizationRegistry = new VisualizationRegistry([
	...SaasVisualizationSpecs,
]);

export const SaasVisualizationRefs = SaasVisualizationSpecs.map((spec) => ({
	key: spec.meta.key,
	version: spec.meta.version,
}));
