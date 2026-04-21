import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const SchemaFeature = defineFeature({
	meta: {
		key: 'libs.schema',
		version: '1.0.0',
		title: 'Schema',
		description: 'Schema utilities for Zod, JSON Schema, and GraphQL',
		domain: 'schema',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'schema'],
		stability: 'experimental',
	},
});
