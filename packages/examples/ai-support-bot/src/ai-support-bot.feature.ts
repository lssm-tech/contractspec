import { defineFeature } from '@contractspec/lib.contracts-spec';

export const AiSupportBotFeature = defineFeature({
	meta: {
		key: 'ai-support-bot',
		version: '1.0.0',
		title: 'AI Support Bot',
		description:
			'AI support ticket classification and resolution using grounded knowledge',
		domain: 'support',
		owners: ['@examples'],
		tags: ['ai', 'support', 'knowledge', 'tickets'],
		stability: 'experimental',
	},

	knowledge: [{ key: 'ai-support-bot.knowledge.articles', version: '1.0.0' }],

	docs: ['docs.examples.ai-support-bot', 'docs.examples.ai-support-bot.usage'],
});
