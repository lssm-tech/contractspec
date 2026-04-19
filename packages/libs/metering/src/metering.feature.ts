import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const MeteringFeature = defineFeature({
	meta: {
		key: 'libs.metering',
		version: '1.0.0',
		title: 'Metering',
		description:
			'Usage metering and billing core module for ContractSpec applications',
		domain: 'metering',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'metering'],
		stability: 'experimental',
	},
	operations: [
		{ key: 'metric.define', version: '1.0.0' },
		{ key: 'metric.update', version: '1.0.0' },
		{ key: 'metric.delete', version: '1.0.0' },
		{ key: 'metric.get', version: '1.0.0' },
		{ key: 'metric.list', version: '1.0.0' },
		{ key: 'usage.record', version: '1.0.0' },
		{ key: 'usage.recordBatch', version: '1.0.0' },
		{ key: 'usage.get', version: '1.0.0' },
		{ key: 'usage.getSummary', version: '1.0.0' },
		{ key: 'threshold.create', version: '1.0.0' },
		{ key: 'threshold.update', version: '1.0.0' },
		{ key: 'threshold.delete', version: '1.0.0' },
		{ key: 'threshold.list', version: '1.0.0' },
	],
	events: [
		{ key: 'metric.defined', version: '1.0.0' },
		{ key: 'metric.updated', version: '1.0.0' },
		{ key: 'usage.recorded', version: '1.0.0' },
		{ key: 'usage.batch_recorded', version: '1.0.0' },
		{ key: 'usage.aggregated', version: '1.0.0' },
		{ key: 'threshold.created', version: '1.0.0' },
		{ key: 'threshold.exceeded', version: '1.0.0' },
		{ key: 'threshold.approaching', version: '1.0.0' },
		{ key: 'model.selected', version: '1.0.0' },
	],
});
