import { VisualizationRegistry, defineVisualization } from '@contractspec/lib.contracts-spec/visualizations';

const INTEGRATION_LIST_REF = { key: 'integration.list', version: '1.0.0' } as const;
const CONNECTION_LIST_REF = { key: 'integration.connection.list', version: '1.0.0' } as const;
const SYNC_CONFIG_REF = { key: 'integration.syncConfig.list', version: '1.0.0' } as const;
const META = {
	version: '1.0.0',
	domain: 'integration',
	stability: 'experimental' as const,
	owners: ['@example.integration-hub'],
	tags: ['integration', 'visualization', 'sync'],
};

export const IntegrationTypeVisualization = defineVisualization({
	meta: {
		...META,
		key: 'integration-hub.visualization.integration-types',
		title: 'Integration Types',
		description: 'Distribution of configured integration categories.',
		goal: 'Show where integration coverage is concentrated.',
		context: 'Integration overview.',
	},
	source: { primary: INTEGRATION_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'pie',
		nameDimension: 'type',
		valueMeasure: 'count',
		dimensions: [{ key: 'type', label: 'Type', dataPath: 'type', type: 'category' }],
		measures: [{ key: 'count', label: 'Count', dataPath: 'count', format: 'number' }],
		table: { caption: 'Integration counts by type.' },
	},
});

export const ConnectionStatusVisualization = defineVisualization({
	meta: {
		...META,
		key: 'integration-hub.visualization.connection-status',
		title: 'Connection Status',
		description: 'Status distribution across configured connections.',
		goal: 'Highlight connection health and instability.',
		context: 'Connection monitoring.',
	},
	source: { primary: CONNECTION_LIST_REF, resultPath: 'data' },
	visualization: {
		kind: 'cartesian',
		variant: 'bar',
		xDimension: 'status',
		yMeasures: ['count'],
		dimensions: [{ key: 'status', label: 'Status', dataPath: 'status', type: 'category' }],
		measures: [{ key: 'count', label: 'Connections', dataPath: 'count', format: 'number', color: '#1d4ed8' }],
		table: { caption: 'Connection counts by status.' },
	},
});

export const HealthySyncMetricVisualization = defineVisualization({
	meta: {
		...META,
		key: 'integration-hub.visualization.sync-healthy',
		title: 'Healthy Syncs',
		description: 'Sync configurations currently healthy or recently successful.',
		goal: 'Summarize healthy synchronization capacity.',
		context: 'Sync-state comparison.',
	},
	source: { primary: SYNC_CONFIG_REF, resultPath: 'data' },
	visualization: {
		kind: 'metric',
		measure: 'value',
		measures: [{ key: 'value', label: 'Syncs', dataPath: 'value', format: 'number' }],
		table: { caption: 'Healthy sync count.' },
	},
});

export const AttentionSyncMetricVisualization = defineVisualization({
	meta: {
		...META,
		key: 'integration-hub.visualization.sync-attention',
		title: 'Attention Needed',
		description: 'Sync configurations paused, failing, or otherwise needing review.',
		goal: 'Summarize syncs needing action.',
		context: 'Sync-state comparison.',
	},
	source: { primary: SYNC_CONFIG_REF, resultPath: 'data' },
	visualization: {
		kind: 'metric',
		measure: 'value',
		measures: [{ key: 'value', label: 'Syncs', dataPath: 'value', format: 'number' }],
		table: { caption: 'Syncs requiring attention.' },
	},
});

export const IntegrationVisualizationSpecs = [
	IntegrationTypeVisualization,
	ConnectionStatusVisualization,
	HealthySyncMetricVisualization,
	AttentionSyncMetricVisualization,
] as const;

export const IntegrationVisualizationRegistry = new VisualizationRegistry([
	...IntegrationVisualizationSpecs,
]);

export const IntegrationVisualizationRefs = IntegrationVisualizationSpecs.map(
	(spec) => ({
		key: spec.meta.key,
		version: spec.meta.version,
	})
);
