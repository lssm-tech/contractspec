/**
 * Server route helper for AI SDK–compatible chat streaming.
 *
 * Use with @ai-sdk/react useChat for full AI SDK parity including tool approval.
 *
 * @example
 * ```ts
 * // app/api/chat/route.ts (Next.js App Router)
 * import { createChatRoute, CHAT_ROUTE_MAX_DURATION } from '@contractspec/module.ai-chat/core';
 * import { createProvider } from '@contractspec/lib.ai-providers';
 *
 * const provider = createProvider({ provider: 'openai', apiKey: process.env.OPENAI_API_KEY });
 * export const POST = createChatRoute({ provider });
 * export const maxDuration = CHAT_ROUTE_MAX_DURATION;
 * ```
 */

import type { Provider as ChatProvider } from '@contractspec/lib.ai-providers';
import {
	convertToModelMessages,
	type LanguageModel,
	streamText,
	type ToolSet,
	type UIMessage,
} from 'ai';
import { z } from 'zod';
import type { ThinkingLevel } from './thinking-levels';
import { getProviderOptions } from './thinking-levels';

/** Recommended maxDuration for Next.js route handlers (Vercel/serverless). */
export const CHAT_ROUTE_MAX_DURATION = 30;

const REQUEST_BODY_SCHEMA = z.object({
	messages: z.array(z.unknown()).min(1, 'messages array required'),
	thinkingLevel: z
		.enum(['instant', 'thinking', 'extra_thinking', 'max'])
		.optional(),
	model: z.string().optional(),
});

export interface CreateChatRouteOptions {
	/** LLM provider (from createProvider) */
	provider: ChatProvider;
	/** System prompt override */
	systemPrompt?: string;
	/** Tools for the model */
	tools?: ToolSet;
	/** Default thinking level (can be overridden by request body) */
	thinkingLevel?: ThinkingLevel;
	/** Send source citations to client (e.g. Perplexity). Default: true when thinkingLevel is set. */
	sendSources?: boolean;
	/** Send reasoning parts to client (extended thinking). Default: true when thinkingLevel is set and not instant. */
	sendReasoning?: boolean;
	/** Resolve model from request body (for model picker). If not provided, uses provider.getModel(). */
	getModel?: (body: { model?: string }) => LanguageModel;
}

const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant.`;

function defaultSendReasoning(
	thinkingLevel: ThinkingLevel | undefined
): boolean {
	return Boolean(thinkingLevel && thinkingLevel !== 'instant');
}

/** Default true for AI Elements parity (citations from Perplexity, etc.). */
function defaultSendSources(): boolean {
	return true;
}

/**
 * Create a route handler that streams chat using streamText + toUIMessageStreamResponse.
 *
 * Compatible with @ai-sdk/react useChat when used as the API endpoint.
 * Supports tool approval when tools have needsApproval.
 *
 * @param options - Provider, system prompt, optional tools, sendSources, sendReasoning
 * @returns A function (req: Request) => Promise<Response> suitable for Next.js route handlers
 */
export function createChatRoute(
	options: CreateChatRouteOptions
): (req: Request) => Promise<Response> {
	const {
		provider,
		systemPrompt = DEFAULT_SYSTEM_PROMPT,
		tools,
		thinkingLevel: defaultThinkingLevel,
		sendSources = defaultSendSources(),
		sendReasoning = defaultSendReasoning(defaultThinkingLevel),
		getModel,
	} = options;

	return async (req: Request): Promise<Response> => {
		if (req.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		let rawBody: unknown;
		try {
			rawBody = await req.json();
		} catch {
			return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const parsed = REQUEST_BODY_SCHEMA.safeParse(rawBody);
		if (!parsed.success) {
			const message = parsed.error.issues[0]?.message ?? 'Invalid request body';
			return new Response(JSON.stringify({ error: message }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const body = parsed.data;
		const thinkingLevel =
			(body.thinkingLevel as ThinkingLevel | undefined) ?? defaultThinkingLevel;
		const providerOptions = getProviderOptions(thinkingLevel, provider.name);

		const model = getModel ? getModel(body) : provider.getModel();

		try {
			const result = streamText({
				model,
				messages: await convertToModelMessages(body.messages as UIMessage[]),
				system: systemPrompt,
				tools,
				providerOptions:
					Object.keys(providerOptions).length > 0
						? (providerOptions as Parameters<
								typeof streamText
							>[0]['providerOptions'])
						: undefined,
			});

			return result.toUIMessageStreamResponse({
				sendSources,
				sendReasoning,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'An error occurred';
			return new Response(JSON.stringify({ error: message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	};
}
