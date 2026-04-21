import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ErrorFeature = defineFeature({
	meta: {
		key: 'libs.error',
		version: '1.0.0',
		title: 'Error',
		description: 'Structured error handling and HTTP error utilities',
		domain: 'error',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'error'],
		stability: 'experimental',
	},
});
