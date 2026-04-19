import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const LoggerFeature = defineFeature({
	meta: {
		key: 'libs.logger',
		version: '1.0.0',
		title: 'Logger',
		description:
			'Comprehensive logging library optimized for Bun with ElysiaJS integration',
		domain: 'logger',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'logger'],
		stability: 'experimental',
	},
});
