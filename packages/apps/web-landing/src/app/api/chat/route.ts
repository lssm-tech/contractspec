import { createProvider } from '@contractspec/lib.ai-providers';
import { createChatRoute } from '@contractspec/module.ai-chat/core';
import { AssistantSearchContract } from '@contractspec/example.ai-chat-assistant/contracts/assistant.operation';

const CHAT_ROUTE_CONTRACTS = [AssistantSearchContract] as const;
void CHAT_ROUTE_CONTRACTS;

const hasLiveChatProvider = Boolean(
	process.env.ANTHROPIC_API_KEY || process.env.CONTRACTSPEC_AI_PROXY_URL
);

const provider = createProvider({
	provider: 'anthropic',
	apiKey: process.env.ANTHROPIC_API_KEY,
	proxyUrl: process.env.CONTRACTSPEC_AI_PROXY_URL,
	organizationId: process.env.CONTRACTSPEC_ORG_ID,
});

const liveChatRoute = createChatRoute({
	provider,
	systemPrompt:
		'You are a helpful AI assistant. Be concise and accurate. When using tools, explain what you are doing.',
	sendSources: true,
	sendReasoning: true,
});

export async function POST(req: Request): Promise<Response> {
	if (!hasLiveChatProvider) {
		return new Response(
			JSON.stringify({
				error:
					'Live chat is unavailable in this environment. Set ANTHROPIC_API_KEY or CONTRACTSPEC_AI_PROXY_URL, or use the deterministic meetup example surfaces.',
				fallbacks: {
					sandbox: '/sandbox?template=ai-chat-assistant',
					docs: '/docs/examples/ai-chat-assistant',
					llms: '/llms/example.ai-chat-assistant',
				},
			}),
			{
				status: 503,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	return liveChatRoute(req);
}

/** Must be a static literal for Next.js 16 segment config validation */
export const maxDuration = 30;
