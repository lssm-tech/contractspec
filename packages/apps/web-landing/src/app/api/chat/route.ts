import { createProvider } from '@contractspec/lib.ai-providers';
import { createChatRoute } from '@contractspec/module.ai-chat/core';

const provider = createProvider({
	provider: 'anthropic',
	apiKey: process.env.ANTHROPIC_API_KEY,
});

export const POST = createChatRoute({
	provider,
	systemPrompt:
		'You are a helpful AI assistant. Be concise and accurate. When using tools, explain what you are doing.',
	sendSources: true,
	sendReasoning: true,
});

/** Must be a static literal for Next.js 16 segment config validation */
export const maxDuration = 30;
