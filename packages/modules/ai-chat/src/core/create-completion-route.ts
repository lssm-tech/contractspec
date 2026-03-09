/**
 * Server route helper for AI SDK–compatible completion streaming.
 *
 * Use with @ai-sdk/react useCompletion for non-chat completion (inline suggestions, etc.).
 *
 * @example
 * ```ts
 * // app/api/completion/route.ts (Next.js App Router)
 * import { createCompletionRoute } from '@contractspec/module.ai-chat/core';
 * import { createProvider } from '@contractspec/lib.ai-providers';
 *
 * const provider = createProvider({ provider: 'openai', apiKey: process.env.OPENAI_API_KEY });
 * export const POST = createCompletionRoute({ provider });
 * ```
 */
import { streamText } from 'ai';
import type { Provider as ChatProvider } from '@contractspec/lib.ai-providers';

export interface CreateCompletionRouteOptions {
  /** LLM provider (from createProvider) */
  provider: ChatProvider;
  /** System prompt override */
  systemPrompt?: string;
}

/**
 * Create a route handler for text completion (single prompt, no chat history).
 *
 * Compatible with @ai-sdk/react useCompletion.
 *
 * @param options - Provider and optional system prompt
 * @returns A function (req: Request) => Promise<Response>
 */
export function createCompletionRoute(
  options: CreateCompletionRouteOptions
): (req: Request) => Promise<Response> {
  const { provider, systemPrompt } = options;

  return async (req: Request): Promise<Response> => {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let body: { prompt?: string };
    try {
      body = (await req.json()) as { prompt?: string };
    } catch {
      return new Response('Invalid JSON body', { status: 400 });
    }

    const prompt = body.prompt ?? '';
    if (!prompt || typeof prompt !== 'string') {
      return new Response('prompt string required', { status: 400 });
    }

    const model = provider.getModel();

    const result = streamText({
      model,
      prompt,
      system: systemPrompt,
    });

    return result.toTextStreamResponse();
  };
}
