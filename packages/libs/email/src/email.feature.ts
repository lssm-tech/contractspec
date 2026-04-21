import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const EmailFeature = defineFeature({
	meta: {
		key: 'libs.email',
		version: '1.0.0',
		title: 'Email',
		description:
			'ContractSpec package declaration for @contractspec/lib.email.',
		domain: 'email',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'email'],
		stability: 'experimental',
	},
});
