import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ExecutionLanesFeature = defineFeature({
	meta: {
		key: 'libs.execution-lanes',
		version: '1.0.0',
		title: 'Execution Lanes',
		description:
			'Execution lanes orchestration contracts and runtime for ContractSpec.',
		domain: 'execution-lanes',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'execution-lanes'],
		stability: 'experimental',
	},
});
