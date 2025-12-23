/**
 * Node.js AI adapter implementation using Vercel AI SDK.
 */

import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { ollama } from 'ollama-ai-provider';
import { generateText, generateObject, streamText } from 'ai';
import type { LanguageModel } from 'ai';
import type { WorkspaceConfig } from '@lssm/module.contractspec-workspace';
import type {
  AiAdapter,
  AiValidationResult,
  AiGenerateOptions,
  AiGenerateResult,
  AiGenerateStructuredOptions,
} from '../ports/ai';

/**
 * Create a Node.js AI adapter using Vercel AI SDK.
 */
export function createNodeAiAdapter(config: WorkspaceConfig): AiAdapter {
  return {
    async validateProvider(
      providerConfig: WorkspaceConfig
    ): Promise<AiValidationResult> {
      try {
        const { aiProvider } = providerConfig;

        // For Ollama, we can't easily validate without making a request
        if (aiProvider === 'ollama') {
          return { success: true };
        }

        // For cloud providers, check API key exists
        if (aiProvider === 'claude' && !process.env['ANTHROPIC_API_KEY']) {
          return {
            success: false,
            error: 'ANTHROPIC_API_KEY environment variable not set',
          };
        }

        if (aiProvider === 'openai' && !process.env['OPENAI_API_KEY']) {
          return {
            success: false,
            error: 'OPENAI_API_KEY environment variable not set',
          };
        }

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },

    async generateText(options: AiGenerateOptions): Promise<AiGenerateResult> {
      const model = getAIProvider(config);

      const result = await generateText({
        model,
        prompt: options.prompt,
        system: options.systemPrompt,
      });

      return { text: result.text };
    },

    async generateStructured<T>(
      options: AiGenerateStructuredOptions<T>
    ): Promise<{ object: T }> {
      const model = getAIProvider(config);

      // Use generateObject with schema cast to expected type
      const generateObjectOptions = {
        model,
        schema: options.schema,
        prompt: options.prompt,
        system: options.systemPrompt,
      };

      const result = await generateObject(
        generateObjectOptions as Parameters<typeof generateObject>[0]
      );

      return { object: result.object as T };
    },

    async streamText(
      options: AiGenerateOptions,
      onChunk: (text: string) => void
    ): Promise<string> {
      const model = getAIProvider(config);

      const result = await streamText({
        model,
        prompt: options.prompt,
        system: options.systemPrompt,
      });

      let fullText = '';

      for await (const chunk of result.textStream) {
        fullText += chunk;
        onChunk(chunk);
      }

      return fullText;
    },
  };
}

/**
 * Get AI provider based on configuration.
 */
function getAIProvider(config: WorkspaceConfig): LanguageModel {
  const { aiProvider, aiModel, customEndpoint } = config;

  switch (aiProvider) {
    case 'claude': {
      const model = aiModel ?? 'claude-3-5-sonnet-20241022';
      return anthropic(model);
    }

    case 'openai': {
      const model = aiModel ?? 'gpt-4o';
      return openai(model);
    }

    case 'ollama': {
      const model = aiModel ?? 'codellama';
      // ollama-ai-provider returns LanguageModelV1, wrap it to satisfy LanguageModel interface
      const ollamaModel = ollama(model);
      // Return as unknown then LanguageModel to bypass strict type checking
      // This is safe because ollama models are compatible at runtime
      return ollamaModel as unknown as LanguageModel;
    }

    case 'custom': {
      if (!customEndpoint) {
        throw new Error(
          'Custom endpoint required. Set customEndpoint in config or CONTRACTSPEC_LLM_ENDPOINT env var'
        );
      }

      const model = aiModel ?? 'default';
      // For custom endpoints, use openai with environment variable for baseURL
      return openai(model);
    }

    default:
      throw new Error(`Unknown AI provider: ${aiProvider}`);
  }
}
