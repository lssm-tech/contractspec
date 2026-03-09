import { describe, expect, test } from 'bun:test';
import {
  getProviderOptions,
  THINKING_LEVEL_LABELS,
  THINKING_LEVEL_DESCRIPTIONS,
} from './thinking-levels';

describe('thinking-levels', () => {
  describe('getProviderOptions', () => {
    test('returns empty object for instant', () => {
      expect(getProviderOptions('instant', 'anthropic')).toEqual({});
      expect(getProviderOptions('instant', 'openai')).toEqual({});
    });

    test('returns empty object for undefined level', () => {
      expect(getProviderOptions(undefined, 'anthropic')).toEqual({});
    });

    test('returns Anthropic thinking config for anthropic provider', () => {
      expect(getProviderOptions('thinking', 'anthropic')).toEqual({
        anthropic: { thinking: { type: 'enabled', budgetTokens: 8000 } },
      });
      expect(getProviderOptions('extra_thinking', 'anthropic')).toEqual({
        anthropic: { thinking: { type: 'enabled', budgetTokens: 16000 } },
      });
      expect(getProviderOptions('max', 'anthropic')).toEqual({
        anthropic: { thinking: { type: 'enabled', budgetTokens: 32000 } },
      });
    });

    test('returns OpenAI reasoningEffort for openai provider', () => {
      expect(getProviderOptions('thinking', 'openai')).toEqual({
        openai: { reasoningEffort: 'low' },
      });
      expect(getProviderOptions('extra_thinking', 'openai')).toEqual({
        openai: { reasoningEffort: 'medium' },
      });
      expect(getProviderOptions('max', 'openai')).toEqual({
        openai: { reasoningEffort: 'high' },
      });
    });

    test('returns empty object for ollama, mistral, gemini', () => {
      expect(getProviderOptions('max', 'ollama')).toEqual({});
      expect(getProviderOptions('thinking', 'mistral')).toEqual({});
      expect(getProviderOptions('extra_thinking', 'gemini')).toEqual({});
    });
  });

  describe('THINKING_LEVEL_LABELS', () => {
    test('has labels for all levels', () => {
      expect(THINKING_LEVEL_LABELS.instant).toBe('Instant');
      expect(THINKING_LEVEL_LABELS.thinking).toBe('Thinking');
      expect(THINKING_LEVEL_LABELS.extra_thinking).toBe('Extra Thinking');
      expect(THINKING_LEVEL_LABELS.max).toBe('Max');
    });
  });

  describe('THINKING_LEVEL_DESCRIPTIONS', () => {
    test('has descriptions for all levels', () => {
      expect(THINKING_LEVEL_DESCRIPTIONS.instant).toContain('Fast');
      expect(THINKING_LEVEL_DESCRIPTIONS.max).toContain('Maximum');
    });
  });
});
