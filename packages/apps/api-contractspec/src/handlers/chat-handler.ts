/**
 * AI Chat handler for ContractSpec API.
 *
 * Provides streaming chat completions with metering, cost tracking, and PostHog analytics.
 * Supports managed keys (API proxy) for cloud providers.
 */

import { Elysia, t } from 'elysia';
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { mistral } from '@ai-sdk/mistral';
import { openai } from '@ai-sdk/openai';
import { appLogger } from '@lssm/bundle.contractspec-studio/infrastructure';
import { CostTracker } from '@lssm/lib.cost-tracking';
import {
  getModelInfo,
  getModelsForProvider,
} from '@lssm/lib.ai-providers';

/**
 * PostHog configuration from environment.
 */
const POSTHOG_HOST = process.env.POSTHOG_HOST ?? 'https://eu.posthog.com';
const POSTHOG_PROJECT_KEY = process.env.POSTHOG_PROJECT_KEY ?? '';

/**
 * API keys from environment (managed keys mode).
 */
const MANAGED_KEYS = {
  openai: process.env.OPENAI_API_KEY,
  anthropic: process.env.ANTHROPIC_API_KEY,
  mistral: process.env.MISTRAL_API_KEY,
  gemini: process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY,
};

/**
 * Default models per provider.
 */
const DEFAULT_MODELS: Record<string, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-20250514',
  mistral: 'mistral-large-latest',
  gemini: 'gemini-2.0-flash',
};

/**
 * Cost per 1M tokens (approximate, for tracking purposes).
 */
const TOKEN_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 2.5, output: 10 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'claude-sonnet-4-20250514': { input: 3, output: 15 },
  'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
  'mistral-large-latest': { input: 2, output: 6 },
  'gemini-2.0-flash': { input: 0.075, output: 0.3 },
};

/**
 * Cost tracker instance.
 */
const costTracker = new CostTracker({
  onSampleRecorded: (sample, total) => {
    appLogger.debug('AI chat cost recorded', {
      operation: sample.operation,
      tenant: sample.tenantId,
      totalCost: total,
    });
  },
});

/**
 * Send telemetry to PostHog.
 */
async function trackChatEvent(
  event: string,
  properties: Record<string, unknown>
): Promise<void> {
  if (!POSTHOG_PROJECT_KEY) return;

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_PROJECT_KEY,
        event: `contractspec.ai_chat.${event}`,
        distinct_id: properties.userId ?? properties.organizationId ?? 'anonymous',
        properties: {
          ...properties,
          $lib: 'contractspec-api',
          timestamp: new Date().toISOString(),
        },
      }),
    });
  } catch (error) {
    appLogger.warn('Failed to track chat event', { error, event });
  }
}

/**
 * Get the language model for a provider.
 */
function getModel(provider: string, model: string) {
  const apiKey = MANAGED_KEYS[provider as keyof typeof MANAGED_KEYS];

  if (!apiKey) {
    throw new Error(
      `No API key configured for provider: ${provider}. ` +
        `Set the appropriate environment variable.`
    );
  }

  switch (provider) {
    case 'openai':
      return openai(model, { apiKey });
    case 'anthropic':
      return anthropic(model, { apiKey });
    case 'mistral':
      return mistral(model, { apiKey });
    case 'gemini':
      return google(model, { apiKey });
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Chat message schema.
 */
const chatMessageSchema = t.Object({
  role: t.Union([t.Literal('user'), t.Literal('assistant'), t.Literal('system')]),
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
 * Chat handler with streaming support.
 */
export const chatHandler = new Elysia().group('/api/chat', (app) =>
  app
    // Main chat endpoint
    .post(
      '/',
      async ({ body, headers, set }) => {
        const startTime = Date.now();
        const provider = body.provider ?? 'openai';
        const providerKey = provider as keyof typeof PROVIDER_DEFAULT_MODELS;
        const model = body.model ?? PROVIDER_DEFAULT_MODELS[providerKey] ?? 'gpt-4o';
        const organizationId = headers['x-contractspec-org-id'];
        const userId = headers['x-contractspec-user-id'];

        appLogger.info('AI chat request received', {
          provider,
          model,
          messageCount: body.messages.length,
          organizationId,
          stream: body.stream ?? true,
        });

        try {
          const languageModel = getModel(provider, model);

          // Build messages array
          const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> =
            [];

          // Add system prompt if provided
          if (body.systemPrompt) {
            messages.push({ role: 'system', content: body.systemPrompt });
          }

          // Add conversation messages
          for (const msg of body.messages) {
            messages.push({ role: msg.role, content: msg.content });
          }

          if (body.stream !== false) {
            // Streaming response
            const result = streamText({
              model: languageModel,
              messages,
              maxTokens: body.maxTokens,
              temperature: body.temperature,
            });

            // Set streaming headers
            set.headers['Content-Type'] = 'text/event-stream';
            set.headers['Cache-Control'] = 'no-cache';
            set.headers['Connection'] = 'keep-alive';

            // Create readable stream
            const encoder = new TextEncoder();

            const stream = new ReadableStream({
              async start(controller) {
                let inputTokens = 0;
                let outputTokens = 0;

                try {
                  for await (const chunk of result.textStream) {
                    const data = JSON.stringify({ type: 'text', content: chunk });
                    controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                  }

                  // Get final usage
                  const finalResult = await result;
                  if (finalResult.usage) {
                    inputTokens = finalResult.usage.promptTokens;
                    outputTokens = finalResult.usage.completionTokens;
                  }

                  // Send done event with usage
                  const doneData = JSON.stringify({
                    type: 'done',
                    usage: { inputTokens, outputTokens },
                  });
                  controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
                  controller.close();

                  // Track usage
                  const durationMs = Date.now() - startTime;
                  const costs = getTokenCosts(model);
                  const estimatedCost =
                    (inputTokens * costs.input + outputTokens * costs.output) / 1_000_000;

                  costTracker.recordSample({
                    operation: 'ai_chat.completion',
                    tenantId: organizationId,
                    computeMs: durationMs,
                    externalCalls: [{ provider, cost: estimatedCost }],
                  });

                  await trackChatEvent('completion', {
                    provider,
                    model,
                    inputTokens,
                    outputTokens,
                    durationMs,
                    estimatedCost,
                    organizationId,
                    userId,
                    success: true,
                  });

                  appLogger.info('AI chat completed', {
                    provider,
                    model,
                    inputTokens,
                    outputTokens,
                    durationMs,
                    estimatedCost,
                  });
                } catch (error) {
                  const errorMessage =
                    error instanceof Error ? error.message : String(error);
                  const errorData = JSON.stringify({
                    type: 'error',
                    error: { code: 'stream_failed', message: errorMessage },
                  });
                  controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                  controller.close();

                  await trackChatEvent('error', {
                    provider,
                    model,
                    error: errorMessage,
                    organizationId,
                    userId,
                  });

                  appLogger.error('AI chat stream error', { error: errorMessage });
                }
              },
            });

            return new Response(stream);
          } else {
            // Non-streaming response
            const { generateText } = await import('ai');
            const result = await generateText({
              model: languageModel,
              messages,
              maxTokens: body.maxTokens,
              temperature: body.temperature,
            });

            const durationMs = Date.now() - startTime;
            const inputTokens = result.usage?.promptTokens ?? 0;
            const outputTokens = result.usage?.completionTokens ?? 0;
            const costs = getTokenCosts(model);
            const estimatedCost =
              (inputTokens * costs.input + outputTokens * costs.output) / 1_000_000;

            costTracker.recordSample({
              operation: 'ai_chat.completion',
              tenantId: organizationId,
              computeMs: durationMs,
              externalCalls: [{ provider, cost: estimatedCost }],
            });

            await trackChatEvent('completion', {
              provider,
              model,
              inputTokens,
              outputTokens,
              durationMs,
              estimatedCost,
              organizationId,
              userId,
              success: true,
            });

            return {
              text: result.text,
              usage: { inputTokens, outputTokens },
              finishReason: result.finishReason,
            };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);

          await trackChatEvent('error', {
            provider,
            model,
            error: errorMessage,
            organizationId,
            userId,
          });

          appLogger.error('AI chat error', { provider, model, error: errorMessage });

          set.status = 500;
          return { error: errorMessage };
        }
      },
      {
        body: chatRequestSchema,
        detail: {
          summary: 'Send chat message',
          description:
            'Send a chat message and receive a streaming or non-streaming response.',
          tags: ['ai-chat'],
        },
      }
    )

    // List available providers
    .get('/providers', () => {
      const providerNames = ['openai', 'anthropic', 'mistral', 'gemini'] as const;

      const providers = providerNames.map((name) => ({
        provider: name,
        available: !!MANAGED_KEYS[name],
        models: getModelsForProvider(name).map((m) => ({
          id: m.id,
          name: m.name,
          contextWindow: m.contextWindow,
          capabilities: m.capabilities,
          costPerMillion: m.costPerMillion,
        })),
      }));

      return { providers };
    })

    // Get usage/cost summary
    .get('/usage', ({ headers }) => {
      const organizationId = headers['x-contractspec-org-id'];
      const totals = costTracker.getTotals({ tenantId: organizationId });

      return {
        totals,
        // Note: In production, this would query from a database
        // For now, we return in-memory totals
      };
    })

    // Health check
    .get('/', () => ({
      status: 'ok',
      providers: {
        openai: !!MANAGED_KEYS.openai,
        anthropic: !!MANAGED_KEYS.anthropic,
        mistral: !!MANAGED_KEYS.mistral,
        gemini: !!MANAGED_KEYS.gemini,
      },
    }))
);

