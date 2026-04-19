import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const SourceExtractorsFeature = defineFeature({
	meta: {
		key: 'libs.source-extractors',
		version: '1.0.0',
		title: 'Source Extractors',
		description:
			'Extract contract candidates from TypeScript source code across multiple frameworks (NestJS, Express, Fastify, Hono, Elysia, tRPC, Next.js)',
		domain: 'source-extractors',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'source-extractors'],
		stability: 'experimental',
	},
});
