import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ExampleSharedUiFeature = defineFeature({
	meta: {
		key: 'libs.example-shared-ui',
		version: '1.0.0',
		title: 'Example Shared Ui',
		description:
			'ContractSpec package declaration for @contractspec/lib.example-shared-ui.',
		domain: 'example-shared-ui',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'example-shared-ui'],
		stability: 'experimental',
	},
});
