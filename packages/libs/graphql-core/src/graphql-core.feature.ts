import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const GraphqlCoreFeature = defineFeature({
	meta: {
		key: 'libs.graphql-core',
		version: '1.0.0',
		title: 'Graphql Core',
		description:
			'Shared GraphQL core: Pothos builder factory, scalars, tracing & complexity',
		domain: 'graphql-core',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'graphql-core'],
		stability: 'experimental',
	},
});
