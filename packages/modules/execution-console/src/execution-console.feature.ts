import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ExecutionConsoleFeature = defineFeature({
	meta: {
		key: 'modules.execution-console',
		version: '1.0.0',
		title: 'Execution Console',
		description: 'Operator-facing execution lane console module.',
		domain: 'execution-console',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'execution-console'],
		stability: 'experimental',
	},
});
