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

export const ShowcaseMetricVisualization = defineVisualization({
	meta: {
		...META,
		key: 'visualization-showcase.metric.snapshot',
		title: 'Monthly Contract Value',
		description: 'Current contract value with prior-period comparison.',
		goal: 'Show a metric primitive with comparison and sparkline support.',
		context: 'Executive dashboard header.',
	},
	source: { primary: SHOWCASE_QUERY_REF, resultPath: 'data' },
	visualization: {
		kind: 'metric',
		measure: 'value',
		comparisonMeasure: 'priorValue',
		dimensions: [{ key: 'month', label: 'Month', dataPath: 'month', type: 'time' }],
		measures: [
			{ key: 'value', label: 'Value', dataPath: 'value', format: 'currency' },
			{
				key: 'priorValue',
				label: 'Prior Value',
				dataPath: 'priorValue',
				format: 'currency',
			},
		],
		sparkline: { dimension: 'month', measure: 'value' },
		table: { caption: 'Monthly contract value trend.' },
	},
});
