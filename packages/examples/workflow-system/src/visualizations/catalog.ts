import {
	defineVisualization,
	VisualizationRegistry,
} from '@contractspec/lib.contracts-spec/visualizations';

const INSTANCE_LIST_REF = {
	key: 'workflow.instance.list',
	version: '1.0.0',
} as const;
const META = {
	version: '1.0.0',
	domain: 'workflow',
	stability: 'experimental' as const,
	owners: ['@example.workflow-system'],
	tags: ['workflow', 'visualization', 'operations'],
};

export const WorkflowInstanceStatusVisualization = defineVisualization({
	meta: {
		...META,
		key: 'workflow-system.visualization.instance-status',
		title: 'Instance Status Breakdown',
		description: 'Distribution of workflow instance states.',
		goal: 'Surface the current workload mix.',
		context: 'Workflow operations overview.',
	},
	source: { primary: INSTANCE_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'pie',
		nameDimension: 'status',
		valueMeasure: 'instances',
		dimensions: [
			{ key: 'status', label: 'Status', dataPath: 'status', type: 'category' },
		],
		measures: [
			{
				key: 'instances',
				label: 'Instances',
				dataPath: 'instances',
				format: 'number',
			},
		],
		table: { caption: 'Workflow instance counts by status.' },
	},
});

export const WorkflowThroughputVisualization = defineVisualization({
	meta: {
		...META,
		key: 'workflow-system.visualization.throughput',
		title: 'Run Throughput',
		description: 'Daily workflow instance starts.',
		goal: 'Show operational throughput over time.',
		context: 'Workflow trend monitoring.',
	},
	source: { primary: INSTANCE_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'line',
		xDimension: 'day',
		yMeasures: ['instances'],
		dimensions: [{ key: 'day', label: 'Day', dataPath: 'day', type: 'time' }],
		measures: [
			{
				key: 'instances',
				label: 'Instances',
				dataPath: 'instances',
				format: 'number',
				color: '#0f766e',
			},
		],
		table: { caption: 'Daily workflow instance starts.' },
	},
});

export const WorkflowActiveMetricVisualization = defineVisualization({
	meta: {
		...META,
		key: 'workflow-system.visualization.active-work',
		title: 'Active Work',
		description: 'Current in-flight or pending workflow instances.',
		goal: 'Expose active operational workload.',
		context: 'Workflow workload comparison.',
	},
	source: { primary: INSTANCE_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'metric',
		measure: 'value',
		measures: [
			{ key: 'value', label: 'Instances', dataPath: 'value', format: 'number' },
		],
		table: { caption: 'Active workflow count.' },
	},
});

export const WorkflowCompletedMetricVisualization = defineVisualization({
	meta: {
		...META,
		key: 'workflow-system.visualization.completed-work',
		title: 'Completed Work',
		description: 'Completed workflow instances in the current sample.',
		goal: 'Show output against active workload.',
		context: 'Workflow workload comparison.',
	},
	source: { primary: INSTANCE_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'metric',
		measure: 'value',
		measures: [
			{ key: 'value', label: 'Instances', dataPath: 'value', format: 'number' },
		],
		table: { caption: 'Completed workflow count.' },
	},
});

export const WorkflowVisualizationSpecs = [
	WorkflowInstanceStatusVisualization,
	WorkflowThroughputVisualization,
	WorkflowActiveMetricVisualization,
	WorkflowCompletedMetricVisualization,
] as const;

export const WorkflowVisualizationRegistry = new VisualizationRegistry([
	...WorkflowVisualizationSpecs,
]);

export const WorkflowVisualizationRefs = WorkflowVisualizationSpecs.map(
	(spec) => ({
		key: spec.meta.key,
		version: spec.meta.version,
	})
);
