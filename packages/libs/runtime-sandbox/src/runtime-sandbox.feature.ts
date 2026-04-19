import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const RuntimeSandboxFeature = defineFeature({
	meta: {
		key: 'libs.runtime-sandbox',
		version: '1.0.0',
		title: 'Runtime Sandbox',
		description:
			'ContractSpec package declaration for @contractspec/lib.runtime-sandbox.',
		domain: 'runtime-sandbox',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'runtime-sandbox'],
		stability: 'experimental',
	},
});
