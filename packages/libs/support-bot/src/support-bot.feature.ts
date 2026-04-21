import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const SupportBotFeature = defineFeature({
	meta: {
		key: 'libs.support-bot',
		version: '1.0.0',
		title: 'Support Bot',
		description: 'AI support bot framework with RAG and ticket management',
		domain: 'support-bot',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'support-bot'],
		stability: 'experimental',
	},
});
