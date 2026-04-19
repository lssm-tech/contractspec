import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const UtilsTypescriptFeature = defineFeature({
	meta: {
		key: 'libs.utils-typescript',
		version: '1.0.0',
		title: 'Utils Typescript',
		description: 'TypeScript utility types and helpers',
		domain: 'utils-typescript',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'utils-typescript'],
		stability: 'experimental',
	},
});
