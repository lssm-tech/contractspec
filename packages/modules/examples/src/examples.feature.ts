import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const ExamplesFeature = defineFeature({
	meta: {
		key: 'modules.examples',
		version: '1.0.0',
		title: 'Examples',
		description: 'Example contract specifications collection',
		domain: 'examples',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'examples'],
		stability: 'experimental',
	},
});
