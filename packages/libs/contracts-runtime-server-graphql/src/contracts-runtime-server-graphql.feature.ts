import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ContractsRuntimeServerGraphqlFeature = defineFeature({
	meta: {
		key: 'libs.contracts-runtime-server-graphql',
		version: '1.0.0',
		title: 'Contracts Runtime Server Graphql',
		description: 'GraphQL server runtime adapters for ContractSpec contracts',
		domain: 'contracts-runtime-server-graphql',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'contracts-runtime-server-graphql'],
		stability: 'experimental',
	},
});
