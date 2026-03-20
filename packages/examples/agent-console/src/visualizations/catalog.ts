import { VisualizationRegistry, defineVisualization } from '@contractspec/lib.contracts-spec/visualizations';

const RUN_LIST_REF = { key: 'agent.run.list', version: '1.0.0' } as const;
const META = {
	version: '1.0.0',
	domain: 'ai-ops',
	stability: 'experimental' as const,
	owners: ['@example.agent-console'],
	tags: ['agent-console', 'visualization', 'operations'],
};

export const AgentRunStatusVisualization = defineVisualization({
	meta: {
		...META,
		key: 'agent-console.visualization.run-status',
		title: 'Run Status Breakdown',
		description: 'Distribution of run outcomes across the current sample.',
		goal: 'Make operational success and failure mix visible at a glance.',
		context: 'Agent operations overview.',
	},
	source: { primary: RUN_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'pie',
		nameDimension: 'status',
		valueMeasure: 'runs',
		dimensions: [{ key: 'status', label: 'Status', dataPath: 'status', type: 'category' }],
		measures: [{ key: 'runs', label: 'Runs', dataPath: 'runs', format: 'number' }],
		table: { caption: 'Run counts by status.' },
	},
});

export const AgentRunActivityVisualization = defineVisualization({
	meta: {
		...META,
		key: 'agent-console.visualization.run-activity',
		title: 'Recent Run Activity',
		description: 'Daily run volume across the current sample.',
		goal: 'Show whether agent activity is rising or slowing down.',
		context: 'Operations trend monitoring.',
	},
	source: { primary: RUN_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'line',
		xDimension: 'day',
		yMeasures: ['runs'],
		dimensions: [{ key: 'day', label: 'Day', dataPath: 'day', type: 'time' }],
		measures: [{ key: 'runs', label: 'Runs', dataPath: 'runs', format: 'number', color: '#0f766e' }],
		table: { caption: 'Daily run counts.' },
	},
});

export const AgentRunEfficiencyVisualization = defineVisualization({
	meta: {
		...META,
		key: 'agent-console.visualization.run-efficiency',
		title: 'Duration vs Tokens',
		description: 'Scatter chart comparing token consumption and runtime.',
		goal: 'Reveal outlier runs that are slow relative to their token usage.',
		context: 'Operational performance diagnostics.',
	},
	source: { primary: RUN_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'scatter',
		xDimension: 'totalTokens',
		yMeasures: ['durationMs'],
		dimensions: [{ key: 'totalTokens', label: 'Total Tokens', dataPath: 'totalTokens', type: 'number' }],
		measures: [
			{ key: 'durationMs', label: 'Duration', dataPath: 'durationMs', format: 'duration', color: '#7c3aed' },
			{ key: 'estimatedCostUsd', label: 'Cost', dataPath: 'estimatedCostUsd', format: 'currency' },
		],
		series: [{ key: 'runs', label: 'Runs', measure: 'durationMs', type: 'scatter', color: '#7c3aed' }],
		table: { caption: 'Run duration versus token usage.' },
	},
});

export const AgentVisualizationSpecs = [
	AgentRunStatusVisualization,
	AgentRunActivityVisualization,
	AgentRunEfficiencyVisualization,
] as const;

export const AgentVisualizationRegistry = new VisualizationRegistry([
	...AgentVisualizationSpecs,
]);

export const AgentVisualizationRefs = AgentVisualizationSpecs.map((spec) => ({
	key: spec.meta.key,
	version: spec.meta.version,
}));
