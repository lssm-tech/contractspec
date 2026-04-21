import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const GraphqlPrismaFeature = defineFeature({
	meta: {
		key: 'libs.graphql-prisma',
		version: '1.0.0',
		title: 'Graphql Prisma',
		description: 'Pothos + Prisma builder factory with injectable client/DMMF',
		domain: 'graphql-prisma',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'graphql-prisma'],
		stability: 'experimental',
	},
});
