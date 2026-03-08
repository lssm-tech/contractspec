/**
 * Server route helper for AI SDK–compatible chat streaming.
 *
 * Use with @ai-sdk/react useChat for full AI SDK parity including tool approval.
 *
 * @example
 * ```ts
 * // app/api/chat/route.ts (Next.js App Router)
 * import { createChatRoute } from '@contractspec/module.ai-chat/core';
 * import { createProvider } from '@contractspec/lib.ai-providers';
 *
 * const provider = createProvider({ provider: 'openai', apiKey: process.env.OPENAI_API_KEY });
 * export const POST = createChatRoute({ provider });
 * ```
 */
import {
  convertToModelMessages,
  streamText,
  type ToolSet,
  type UIMessage,
} from 'ai';
import type { Provider as ChatProvider } from '@contractspec/lib.ai-providers';

export interface CreateChatRouteOptions {
  /** LLM provider (from createProvider) */
  provider: ChatProvider;
  /** System prompt override */
  systemPrompt?: string;
  /** Tools for the model */
  tools?: ToolSet;
}

const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant.`;

/**
 * Create a route handler that streams chat using streamText + toUIMessageStreamResponse.
 *
 * Compatible with @ai-sdk/react useChat when used as the API endpoint.
 * Supports tool approval when tools have needsApproval.
 *
 * @param options - Provider, system prompt, and optional tools
 * @returns A function (req: Request) => Promise<Response> suitable for Next.js route handlers
 */
export function createChatRoute(
  options: CreateChatRouteOptions
): (req: Request) => Promise<Response> {
  const { provider, systemPrompt = DEFAULT_SYSTEM_PROMPT, tools } = options;

  return async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let body: { messages?: unknown[] };
    try {
      body = (await req.json()) as { messages?: unknown[] };
    } catch {
      return new Response('Invalid JSON body', { status: 400 });
    }

    const messages = body.messages ?? [];
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response('messages array required', { status: 400 });
    }

    const model = provider.getModel();

    const result = streamText({
      model,
      messages: await convertToModelMessages(messages as UIMessage[]),
      system: systemPrompt,
      tools,
    });

    return result.toUIMessageStreamResponse();
  };
}
