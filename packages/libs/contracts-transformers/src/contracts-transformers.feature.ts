import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ContractsTransformersFeature = defineFeature({
	meta: {
		key: 'libs.contracts-transformers',
		version: '1.0.0',
		title: 'Contracts Transformers',
		description:
			'Contract format transformations: import/export between ContractSpec and external formats (OpenAPI, AsyncAPI, etc.)',
		domain: 'contracts-transformers',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'contracts-transformers'],
		stability: 'experimental',
	},
});
