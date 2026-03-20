/**
 * Adapter interface for agent mode in ai-chat.
 * Allows ContractSpecAgent or UnifiedAgent to be used as the chat backend.
 */
export interface ChatAgentAdapter {
	generate(params: { prompt: string; signal?: AbortSignal }): Promise<{
		text: string;
		toolCalls?: {
			toolCallId: string;
			toolName: string;
			args: unknown;
		}[];
		toolResults?: {
			toolCallId: string;
			toolName: string;
			output: unknown;
		}[];
		usage?: { inputTokens: number; outputTokens: number };
	}>;
}

/**
 * Wraps a ContractSpecAgent or similar agent for use with useChat agent mode.
 * Maps AgentGenerateResult to ChatAgentAdapter format.
 */
export function createChatAgentAdapter(agent: {
	generate(params: {
		prompt: string;
		systemOverride?: string;
		signal?: AbortSignal;
	}): Promise<{
		text: string;
		toolCalls?: {
			toolCallId: string;
			toolName: string;
			args: unknown;
		}[];
		toolResults?: {
			toolCallId: string;
			toolName: string;
			output: unknown;
		}[];
		usage?: { inputTokens: number; outputTokens: number };
	}>;
}): ChatAgentAdapter {
	return {
		async generate({ prompt, signal }) {
			const result = await agent.generate({ prompt, signal });
			return {
				text: result.text,
				toolCalls: result.toolCalls,
				toolResults: result.toolResults,
				usage: result.usage,
			};
		},
	};
}
