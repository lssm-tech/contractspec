/**
 * Thinking level abstraction for AI chat.
 * Maps to provider-specific reasoning options (Anthropic budgetTokens, OpenAI reasoningEffort).
 */
import type { ProviderName } from '@contractspec/lib.ai-providers';

/**
 * Thinking level: controls how much internal reasoning the model performs.
 */
export type ThinkingLevel = 'instant' | 'thinking' | 'extra_thinking' | 'max';

/**
 * Human-readable labels for UI
 */
export const THINKING_LEVEL_LABELS: Record<ThinkingLevel, string> = {
  instant: 'Instant',
  thinking: 'Thinking',
  extra_thinking: 'Extra Thinking',
  max: 'Max',
};

/**
 * Descriptions for tooltips
 */
export const THINKING_LEVEL_DESCRIPTIONS: Record<ThinkingLevel, string> = {
  instant: 'Fast responses, minimal reasoning',
  thinking: 'Standard reasoning depth',
  extra_thinking: 'More thorough reasoning',
  max: 'Maximum reasoning depth',
};

/**
 * Provider options for streamText/generateText (AI SDK).
 * Keys match provider names; only the active provider's options are used.
 */
export interface ProviderOptionsMap {
  anthropic?: {
    thinking?: { type: 'enabled'; budgetTokens: number };
    effort?: 'low' | 'medium' | 'high';
  };
  openai?: {
    reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high' | 'xhigh';
  };
}

/**
 * Get provider-specific options for the given thinking level and provider.
 * Returns options suitable for AI SDK streamText/generateText providerOptions.
 */
export function getProviderOptions(
  level: ThinkingLevel | undefined,
  providerName: ProviderName
): ProviderOptionsMap {
  if (!level || level === 'instant') {
    return {};
  }

  switch (providerName) {
    case 'anthropic': {
      const budgetMap: Record<Exclude<ThinkingLevel, 'instant'>, number> = {
        thinking: 8000,
        extra_thinking: 16000,
        max: 32000,
      };
      return {
        anthropic: {
          thinking: { type: 'enabled', budgetTokens: budgetMap[level] },
        },
      };
    }
    case 'openai': {
      const effortMap: Record<Exclude<ThinkingLevel, 'instant'>, string> = {
        thinking: 'low',
        extra_thinking: 'medium',
        max: 'high',
      };
      return {
        openai: {
          reasoningEffort: effortMap[level] as
            | 'minimal'
            | 'low'
            | 'medium'
            | 'high'
            | 'xhigh',
        },
      };
    }
    case 'ollama':
    case 'mistral':
    case 'gemini':
      return {};
    default:
      return {};
  }
}
