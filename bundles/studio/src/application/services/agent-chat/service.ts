import { getModelInfo } from '@contractspec/lib.ai-providers';
import { CostTracker } from '@contractspec/lib.cost-tracking';
import { appLogger } from '../../../infrastructure';
import { createAgent } from './factory';
import { trackChatEvent } from './telemetry';
import type { AgentDependencies, ChatOptions, StreamPart } from './types';

/**
 * Service for handling AI chat interactions using ContractSpecAgent.
 */
export class AgentChatService {
  private readonly costTracker: CostTracker;
  private readonly dependencies?: AgentDependencies;

  constructor(dependencies?: AgentDependencies) {
    this.dependencies = dependencies;
    this.costTracker = new CostTracker({
      onSampleRecorded: (sample, total) => {
        appLogger.debug('AI chat cost recorded', {
          operation: sample.operation,
          tenant: sample.tenantId,
          totalCost: total,
        });
      },
    });
  }

  /**
   * Process a chat request and return a stream of text deltas.
   */
  async *streamChat(
    messages: { role: string; content: string }[],
    options: ChatOptions
  ): AsyncGenerator<StreamPart, void, unknown> {
    const startTime = Date.now();
    const { organizationId, userId } = options;

    // Prepare prompt
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== 'user') {
      throw new Error('Last message must be from user');
    }
    const prompt = lastMessage.content;

    const historyMessages = messages.slice(0, -1);
    const historyContext = historyMessages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');

    const systemOverride = historyContext
      ? `PREVIOUS CONVERSATION HISTORY:\n${historyContext}\n\nCURRENT INSTRUCTIONS:\n`
      : undefined;

    let provider = 'unknown';
    let modelName = 'unknown';

    try {
      const {
        agent,
        provider: p,
        modelName: m,
      } = await createAgent(options, this.dependencies);
      provider = p;
      modelName = m;

      const streamResult = await agent.stream({
        prompt,
        systemOverride,
        options: {
          tenantId: organizationId,
          actorId: userId,
        },
      });

      let inputTokens = 0;
      let outputTokens = 0;

      for await (const part of streamResult.fullStream) {
        if (part.type === 'text-delta') {
          // Fixed: using part.text if available, part.textDelta is deprecated in recent AI SDK
          // However, in previous step I used part.text. I will stick to part.text.
          // Wait, previous file had part.text.
          yield { type: 'text', content: part.text };
        } else if (part.type === 'finish') {
          // @ts-expect-error AI SDK beta stream parts may have usage property not in types
          const usage = part.usage as
            | { promptTokens?: number; completionTokens?: number }
            | undefined;
          if (usage) {
            inputTokens += usage.promptTokens ?? 0;
            outputTokens += usage.completionTokens ?? 0;
          }
        }
      }

      // Final usage tracking
      const durationMs = Date.now() - startTime;
      const modelInfo = getModelInfo(modelName);
      const costs = modelInfo?.costPerMillion ?? { input: 0, output: 0 };
      const estimatedCost =
        (inputTokens * costs.input + outputTokens * costs.output) / 1_000_000;

      this.costTracker.recordSample({
        operation: 'ai_chat.completion',
        tenantId: organizationId,
        computeMs: durationMs,
        externalCalls: [{ provider, cost: estimatedCost }],
      });

      await trackChatEvent('completion', {
        provider,
        model: modelName,
        inputTokens,
        outputTokens,
        durationMs,
        estimatedCost,
        organizationId,
        userId,
        success: true,
      });

      yield { type: 'done', usage: { inputTokens, outputTokens } };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      await trackChatEvent('error', {
        provider,
        model: modelName,
        error: errorMessage,
        organizationId,
        userId,
      });

      appLogger.error('AI chat stream error (service)', {
        error: errorMessage,
      });

      yield {
        type: 'error',
        error: { code: 'stream_failed', message: errorMessage },
      };
    }
  }

  /**
   * Process a chat request and return a single response.
   */
  async generateChat(
    messages: { role: string; content: string }[],
    options: ChatOptions
  ): Promise<{
    text: string;
    usage: { inputTokens: number; outputTokens: number };
    finishReason: string;
  }> {
    const startTime = Date.now();
    const { organizationId, userId } = options;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== 'user') {
      throw new Error('Last message must be from user');
    }
    const prompt = lastMessage.content;

    const historyMessages = messages.slice(0, -1);
    const historyContext = historyMessages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');

    const systemOverride = historyContext
      ? `PREVIOUS CONVERSATION HISTORY:\n${historyContext}\n\nCURRENT INSTRUCTIONS:\n`
      : undefined;

    const { agent, provider, modelName } = await createAgent(
      options,
      this.dependencies
    );

    try {
      const result = await agent.generate({
        prompt,
        systemOverride,
        options: {
          tenantId: organizationId,
          actorId: userId,
        },
      });

      const durationMs = Date.now() - startTime;
      // @ts-expect-error - usage type mismatch
      const inputTokens = result.usage?.promptTokens ?? 0;
      // @ts-expect-error - usage type mismatch
      const outputTokens = result.usage?.completionTokens ?? 0;

      const modelInfo = getModelInfo(modelName);
      const costs = modelInfo?.costPerMillion ?? { input: 0, output: 0 };
      const estimatedCost =
        (inputTokens * costs.input + outputTokens * costs.output) / 1_000_000;

      this.costTracker.recordSample({
        operation: 'ai_chat.completion',
        tenantId: organizationId,
        computeMs: durationMs,
        externalCalls: [{ provider, cost: estimatedCost }],
      });

      await trackChatEvent('completion', {
        provider,
        model: modelName,
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      await trackChatEvent('error', {
        provider,
        model: modelName,
        error: errorMessage,
        organizationId,
        userId,
      });

      appLogger.error('AI chat error (service)', {
        provider,
        model: modelName,
        error: errorMessage,
      });

      throw error;
    }
  }
}
