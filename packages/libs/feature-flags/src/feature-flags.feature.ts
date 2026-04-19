import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const FeatureFlagsFeature = defineFeature({
	meta: {
		key: 'libs.feature-flags',
		version: '1.0.0',
		title: 'Feature Flags',
		description:
			'Feature flags and experiments module for ContractSpec applications',
		domain: 'feature-flags',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'feature-flags'],
		stability: 'experimental',
	},
	operations: [
		{ key: 'flag.create', version: '1.0.0' },
		{ key: 'flag.update', version: '1.0.0' },
		{ key: 'flag.delete', version: '1.0.0' },
		{ key: 'flag.toggle', version: '1.0.0' },
		{ key: 'flag.get', version: '1.0.0' },
		{ key: 'flag.list', version: '1.0.0' },
		{ key: 'flag.evaluate', version: '1.0.0' },
		{ key: 'flag.rule.create', version: '1.0.0' },
		{ key: 'flag.rule.delete', version: '1.0.0' },
		{ key: 'experiment.create', version: '1.0.0' },
		{ key: 'experiment.start', version: '1.0.0' },
		{ key: 'experiment.stop', version: '1.0.0' },
		{ key: 'experiment.get', version: '1.0.0' },
	],
	events: [
		{ key: 'flag.created', version: '1.0.0' },
		{ key: 'flag.updated', version: '1.0.0' },
		{ key: 'flag.deleted', version: '1.0.0' },
		{ key: 'flag.toggled', version: '1.0.0' },
		{ key: 'flag.rule_created', version: '1.0.0' },
		{ key: 'flag.rule_deleted', version: '1.0.0' },
		{ key: 'experiment.created', version: '1.0.0' },
		{ key: 'experiment.started', version: '1.0.0' },
		{ key: 'experiment.stopped', version: '1.0.0' },
		{ key: 'flag.evaluated', version: '1.0.0' },
		{ key: 'experiment.variant_assigned', version: '1.0.0' },
	],
});
