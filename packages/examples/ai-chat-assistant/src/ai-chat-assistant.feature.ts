import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const AiChatAssistantFeature = defineFeature({
	meta: {
		key: 'ai-chat-assistant',
		version: '1.0.0',
		title: 'AI Chat Assistant',
		description:
			'Focused assistant example with chat UX and search-backed retrieval.',
		domain: 'example',
		owners: ['@platform.core'],
		tags: ['ai', 'chat', 'assistant', 'example'],
		stability: 'beta',
	},

	operations: [{ key: 'assistant.search', version: '1.0.0' }],
});
