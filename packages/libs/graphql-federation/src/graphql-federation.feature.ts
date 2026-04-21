import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const GraphqlFederationFeature = defineFeature({
	meta: {
		key: 'libs.graphql-federation',
		version: '1.0.0',
		title: 'Graphql Federation',
		description:
			'Pothos federation helpers and subgraph schema export utilities',
		domain: 'graphql-federation',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'graphql-federation'],
		stability: 'experimental',
	},
});
