/**
 * AI Chat handler for ContractSpec API.
 *
 * Provides streaming chat completions by delegating to AgentChatService in the bundle.
 */

import { Elysia, t } from 'elysia';
import { appLogger } from '@contractspec/bundle.studio/infrastructure';
import {
  AgentChatService,
  type ChatOptions,
} from '@contractspec/bundle.studio/application/services';

/**
 * Service instance.
 * Note: Service is stateless regarding request context, but holds heavy singletons.
 * Ideally this comes from dependency injection.
 */
const chatService = new AgentChatService();

/**
 * Chat message schema.
 */
const chatMessageSchema = t.Object({
  role: t.Union([
    t.Literal('user'),
    t.Literal('assistant'),
    t.Literal('system'),
  ]),
  content: t.String(),
});

/**
 * Chat request schema.
 */
const chatRequestSchema = t.Object({
  messages: t.Array(chatMessageSchema),
  provider: t.Optional(
    t.Union([
      t.Literal('openai'),
      t.Literal('anthropic'),
      t.Literal('mistral'),
      t.Literal('gemini'),
    ])
  ),
  model: t.Optional(t.String()),
  systemPrompt: t.Optional(t.String()),
  maxTokens: t.Optional(t.Number()),
  temperature: t.Optional(t.Number()),
  stream: t.Optional(t.Boolean()),
});

/**
 * Chat handler with streaming support using AgentChatService.
 */
export const chatHandler = new Elysia().group('/api/chat', (app) =>
  app
    // Main chat endpoint
    .post(
      '/',
      async ({ body, headers, set }) => {
        const organizationId = headers['x-contractspec-org-id'];
        const userId = headers['x-contractspec-user-id'];

        appLogger.info('AI chat request received', {
          provider: body.provider,
          model: body.model,
          messageCount: body.messages.length,
          organizationId,
          stream: body.stream ?? true,
        });

        // Prepare chat options
        const options: ChatOptions = {
          provider: body.provider,
          model: body.model,
          systemPrompt: body.systemPrompt,
          maxTokens: body.maxTokens,
          temperature: body.temperature,
          organizationId,
          userId,
        };

        const messages = body.messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        if (body.stream !== false) {
          // Streaming response
          set.headers['Content-Type'] = 'text/event-stream';
          set.headers['Cache-Control'] = 'no-cache';
          set.headers['Connection'] = 'keep-alive';

          const encoder = new TextEncoder();

          const stream = new ReadableStream({
            async start(controller) {
              const iterator = chatService.streamChat(messages, options);

              for await (const part of iterator) {
                if (part.type === 'text') {
                  const data = JSON.stringify({
                    type: 'text',
                    content: part.content,
                  });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                } else if (part.type === 'done') {
                  const doneData = JSON.stringify({
                    type: 'done',
                    usage: part.usage,
                  });
                  controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
                } else if (part.type === 'error') {
                  const errorData = JSON.stringify({
                    type: 'error',
                    error: part.error,
                  });
                  controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                }
              }
              controller.close();
            },
          });

          return new Response(stream);
        } else {
          // Non-streaming response
          try {
            const result = await chatService.generateChat(messages, options);
            return result;
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            set.status = 500;
            return { error: errorMessage };
          }
        }
      },
      {
        body: chatRequestSchema,
      }
    )
    // List available providers - Simplified for now, or could move to service too
    .get('/providers', () => {
      return { message: 'Providers list requires service implementation' };
    })
);
