import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ContractsFeature = defineFeature({
	meta: {
		key: 'libs.contracts',
		version: '1.0.0',
		title: 'Contracts',
		description:
			'Deprecated monolith package split into contracts-spec, contracts-integrations, and contracts-runtime-* packages',
		domain: 'contracts',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'contracts'],
		stability: 'experimental',
	},
});
