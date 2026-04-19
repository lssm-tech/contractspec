import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const AiChatFeature = defineFeature({
	meta: {
		key: 'modules.ai-chat',
		version: '1.0.0',
		title: 'Ai Chat',
		description: 'AI chat interface module',
		domain: 'ai-chat',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'ai-chat'],
		stability: 'experimental',
	},
	operations: [
		{ key: 'ai-chat.send', version: '1.0.0' },
		{ key: 'ai-chat.stream', version: '1.0.0' },
		{ key: 'ai-chat.conversations.list', version: '1.0.0' },
		{ key: 'ai-chat.conversations.get', version: '1.0.0' },
		{ key: 'ai-chat.conversations.delete', version: '1.0.0' },
		{ key: 'ai-chat.providers.list', version: '1.0.0' },
		{ key: 'ai-chat.context.scan', version: '1.0.0' },
	],
	events: [
		{ key: 'ai-chat.message.sent', version: '1.0.0' },
		{ key: 'ai-chat.message.received', version: '1.0.0' },
		{ key: 'ai-chat.conversation.created', version: '1.0.0' },
		{ key: 'ai-chat.conversation.deleted', version: '1.0.0' },
		{ key: 'ai-chat.error', version: '1.0.0' },
	],
});
