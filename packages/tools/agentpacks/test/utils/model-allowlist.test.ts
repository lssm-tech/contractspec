/**
 * Tests for model ID allowlist validation.
 */
import { describe, test, expect } from 'bun:test';
import {
  validateModelId,
  scanModelsForUnknownIds,
} from '../../src/utils/model-allowlist.js';

describe('validateModelId', () => {
  describe('known models', () => {
    test('recognizes Anthropic models', () => {
      expect(validateModelId('claude-sonnet-4-20250514').known).toBe(true);
      expect(validateModelId('claude-opus-4-6').known).toBe(true);
      expect(validateModelId('claude-haiku-3-5-20250514').known).toBe(true);
      expect(validateModelId('anthropic/claude-sonnet-4-20250514').known).toBe(
        true
      );
    });

    test('recognizes OpenAI models', () => {
      expect(validateModelId('gpt-4o').known).toBe(true);
      expect(validateModelId('gpt-4-turbo').known).toBe(true);
      expect(validateModelId('o1-preview').known).toBe(true);
      expect(validateModelId('openai/gpt-4o').known).toBe(true);
    });

    test('recognizes Google models', () => {
      expect(validateModelId('gemini-2.5-flash').known).toBe(true);
      expect(validateModelId('gemini-pro').known).toBe(true);
      expect(validateModelId('google/gemini-pro').known).toBe(true);
    });

    test('recognizes Meta models', () => {
      expect(validateModelId('llama-3.1-70b').known).toBe(true);
      expect(validateModelId('meta/llama-3-8b').known).toBe(true);
      expect(validateModelId('codellama-34b').known).toBe(true);
    });

    test('recognizes Mistral models', () => {
      expect(validateModelId('mistral-large').known).toBe(true);
      expect(validateModelId('mixtral-8x7b').known).toBe(true);
      expect(validateModelId('codestral-latest').known).toBe(true);
    });

    test('recognizes DeepSeek models', () => {
      expect(validateModelId('deepseek-coder').known).toBe(true);
      expect(validateModelId('deepseek/deepseek-chat').known).toBe(true);
    });

    test('recognizes xAI models', () => {
      expect(validateModelId('grok-2').known).toBe(true);
      expect(validateModelId('xai/grok-3').known).toBe(true);
    });

    test('returns provider name for known models', () => {
      const result = validateModelId('claude-sonnet-4-20250514');
      expect(result.provider).toBe('Anthropic');
    });
  });

  describe('unknown models', () => {
    test('returns warning for unknown model IDs', () => {
      const result = validateModelId('my-custom-model-v1');
      expect(result.known).toBe(false);
      expect(result.warning).toContain('Unknown model ID');
    });

    test('returns warning for empty model ID', () => {
      const result = validateModelId('');
      expect(result.known).toBe(false);
      expect(result.warning).toContain('Empty');
    });
  });
});

describe('scanModelsForUnknownIds', () => {
  test('returns empty for known models', () => {
    const warnings = scanModelsForUnknownIds({
      default: 'claude-sonnet-4-20250514',
      small: 'gpt-4o',
    });
    expect(warnings).toHaveLength(0);
  });

  test('warns about unknown default model', () => {
    const warnings = scanModelsForUnknownIds({
      default: 'totally-fake-model',
    });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('default model');
  });

  test('warns about unknown agent model', () => {
    const warnings = scanModelsForUnknownIds({
      agents: {
        reviewer: { model: 'unknown-agent-model' },
      },
    });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('agent "reviewer"');
  });

  test('warns about unknown profile models', () => {
    const warnings = scanModelsForUnknownIds({
      profiles: {
        premium: {
          default: 'fake-premium-model',
          small: 'gpt-4o',
        },
      },
    });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('profile "premium"');
  });

  test('deduplicates model IDs', () => {
    const warnings = scanModelsForUnknownIds({
      default: 'fake-model',
      profiles: {
        fast: { default: 'fake-model' },
      },
    });
    // Should only warn once even though same ID appears twice
    expect(warnings).toHaveLength(1);
  });

  test('handles empty config', () => {
    const warnings = scanModelsForUnknownIds({});
    expect(warnings).toHaveLength(0);
  });
});
