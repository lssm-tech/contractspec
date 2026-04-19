import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ContractsLibraryFeature = defineFeature({
	meta: {
		key: 'libs.contracts-library',
		version: '1.0.0',
		title: 'Contracts Library',
		description:
			'ContractSpec package declaration for @contractspec/lib.contracts-library.',
		domain: 'contracts-library',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'contracts-library'],
		stability: 'experimental',
	},
});
