import { defineVisualization } from '@contractspec/lib.contracts-spec/visualizations';

const SHOWCASE_QUERY_REF = {
	key: 'visualization-showcase.data.snapshot',
	version: '1.0.0',
} as const;

const META = {
	version: '1.0.0',
	domain: 'ui',
	stability: 'experimental' as const,
	owners: ['@example.visualization-showcase'],
	tags: ['visualization', 'showcase'],
};

export const ShowcaseLineVisualization = defineVisualization({
	meta: {
		...META,
		key: 'visualization-showcase.cartesian.line',
		title: 'Weekly Throughput',
		description: 'Line chart for weekly workflow throughput.',
		goal: 'Show a line chart primitive.',
		context: 'Operations trend view.',
	},
	source: { primary: SHOWCASE_QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'line',
		xDimension: 'week',
		yMeasures: ['throughput'],
		dimensions: [{ key: 'week', label: 'Week', dataPath: 'week', type: 'category' }],
		measures: [{ key: 'throughput', label: 'Throughput', dataPath: 'throughput', format: 'number', color: '#0f766e' }],
		table: { caption: 'Weekly throughput values.' },
	},
});

export const ShowcaseBarVisualization = defineVisualization({
	meta: {
		...META,
		key: 'visualization-showcase.cartesian.bar',
		title: 'Revenue by Segment',
		description: 'Bar chart for segment comparison.',
		goal: 'Show a bar chart primitive.',
		context: 'Commercial comparison view.',
	},
	source: { primary: SHOWCASE_QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'bar',
		xDimension: 'segment',
		yMeasures: ['revenue'],
		dimensions: [{ key: 'segment', label: 'Segment', dataPath: 'segment', type: 'category' }],
		measures: [{ key: 'revenue', label: 'Revenue', dataPath: 'revenue', format: 'currency', color: '#1d4ed8' }],
		table: { caption: 'Revenue by segment.' },
	},
});

export const ShowcaseAreaVisualization = defineVisualization({
	meta: {
		...META,
		key: 'visualization-showcase.cartesian.area',
		title: 'Retention Curve',
		description: 'Area chart for cohort retention.',
		goal: 'Show an area chart primitive.',
		context: 'Product health view.',
	},
	source: { primary: SHOWCASE_QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'area',
		xDimension: 'week',
		yMeasures: ['retention'],
		dimensions: [{ key: 'week', label: 'Week', dataPath: 'week', type: 'category' }],
		measures: [{ key: 'retention', label: 'Retention', dataPath: 'retention', format: 'percentage', color: '#16a34a' }],
		table: { caption: 'Weekly retention values.' },
	},
});

export const ShowcaseScatterVisualization = defineVisualization({
	meta: {
		...META,
		key: 'visualization-showcase.cartesian.scatter',
		title: 'Latency vs Accuracy',
		description: 'Scatter chart for response quality trade-offs.',
		goal: 'Show a scatter chart primitive.',
		context: 'Model quality comparison.',
	},
	source: { primary: SHOWCASE_QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'scatter',
		xDimension: 'latencyMs',
		yMeasures: ['accuracy'],
		dimensions: [{ key: 'latencyMs', label: 'Latency', dataPath: 'latencyMs', type: 'number' }],
		measures: [
			{ key: 'accuracy', label: 'Accuracy', dataPath: 'accuracy', format: 'percentage', color: '#7c3aed' },
			{ key: 'requests', label: 'Requests', dataPath: 'requests', format: 'number' },
		],
		series: [{ key: 'models', label: 'Models', measure: 'accuracy', type: 'scatter', color: '#7c3aed' }],
		table: { caption: 'Latency versus accuracy.' },
	},
});
