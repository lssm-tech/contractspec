import { describe, it, expect, beforeEach } from 'bun:test';
import { PromptBuilder } from './prompt-builder';
import { createImageGenI18n, resetI18nRegistry } from '../i18n/messages';
import type { ImageBrief } from '../types';
import type { LLMProvider } from '@contractspec/lib.contracts-integrations/integrations/providers/llm';

// =============================================================================
// Helpers
// =============================================================================

function makeBrief(overrides?: Partial<ImageBrief>): ImageBrief {
  return {
    content: {
      title: 'AI for DevOps',
      summary: 'Automate infrastructure with AI',
      problems: ['manual deploys', 'slow reviews'],
      solutions: ['auto-scaling', 'smart alerts', 'predictive monitoring'],
      audience: { role: 'DevOps', industry: 'fintech' },
    },
    purpose: 'blog-hero',
    ...overrides,
  };
}

function makeResolvedStyle() {
  return {
    styleTokens: ['professional photography', 'high resolution'],
    negativeTokens: ['blurry', 'low quality'],
    dimensions: { width: 1920, height: 1080 },
  };
}

function makeMockLlm(responseText: string): LLMProvider {
  return {
    chat: async () => ({
      message: {
        role: 'assistant' as const,
        content: [{ type: 'text' as const, text: responseText }],
      },
    }),
    stream: async function* () {
      /* noop */
    },
    countTokens: async () => ({ promptTokens: 0 }),
  };
}

function makeFailingLlm(): LLMProvider {
  return {
    chat: async () => {
      throw new Error('LLM unavailable');
    },
    stream: async function* () {
      /* noop */
    },
    countTokens: async () => ({ promptTokens: 0 }),
  };
}

// =============================================================================
// Deterministic mode (no LLM)
// =============================================================================

describe('PromptBuilder - deterministic mode', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should produce a prompt from title, i18n description, and style tokens', () => {
    const i18n = createImageGenI18n('en');
    const builder = new PromptBuilder({ i18n });
    const brief = makeBrief();
    const result = builder.build(brief, makeResolvedStyle());

    return result.then((prompt) => {
      expect(prompt.text).toContain('AI for DevOps');
      expect(prompt.text).toContain(
        'Generate a photorealistic image for blog-hero'
      );
      expect(prompt.text).toContain('professional photography');
      expect(prompt.style).toBe('photorealistic');
      expect(prompt.format).toBe('png');
      expect(prompt.dimensions).toEqual({ width: 1920, height: 1080 });
    });
  });

  it('should include featuring fragment when solutions are present', () => {
    const i18n = createImageGenI18n('en');
    const builder = new PromptBuilder({ i18n });
    const brief = makeBrief();
    const result = builder.build(brief, makeResolvedStyle());

    return result.then((prompt) => {
      expect(prompt.text).toContain(
        'featuring auto-scaling, smart alerts, predictive monitoring'
      );
    });
  });

  it('should not include featuring fragment when solutions are empty', () => {
    const i18n = createImageGenI18n('en');
    const builder = new PromptBuilder({ i18n });
    const brief = makeBrief({
      content: {
        title: 'Empty',
        summary: 'No solutions',
        problems: [],
        solutions: [],
        audience: { role: 'Tester' },
      },
    });
    const result = builder.build(brief, makeResolvedStyle());

    return result.then((prompt) => {
      expect(prompt.text).not.toContain('featuring');
    });
  });

  it('should include industry context when audience.industry is set', () => {
    const i18n = createImageGenI18n('en');
    const builder = new PromptBuilder({ i18n });
    const brief = makeBrief();
    const result = builder.build(brief, makeResolvedStyle());

    return result.then((prompt) => {
      expect(prompt.text).toContain('fintech context');
    });
  });

  it('should not include industry context when audience has no industry', () => {
    const i18n = createImageGenI18n('en');
    const builder = new PromptBuilder({ i18n });
    const brief = makeBrief({
      content: {
        title: 'No Industry',
        summary: 'Test',
        problems: [],
        solutions: [],
        audience: { role: 'DevOps' },
      },
    });
    const result = builder.build(brief, makeResolvedStyle());

    return result.then((prompt) => {
      expect(prompt.text).not.toContain('context');
    });
  });

  it('should use brief.style when provided', () => {
    const i18n = createImageGenI18n('en');
    const builder = new PromptBuilder({ i18n });
    const brief = makeBrief({ style: 'abstract' });
    const result = builder.build(brief, makeResolvedStyle());

    return result.then((prompt) => {
      expect(prompt.style).toBe('abstract');
    });
  });

  it('should default style to photorealistic', () => {
    const i18n = createImageGenI18n('en');
    const builder = new PromptBuilder({ i18n });
    const brief = makeBrief();
    const result = builder.build(brief, makeResolvedStyle());

    return result.then((prompt) => {
      expect(prompt.style).toBe('photorealistic');
    });
  });

  it('should use brief.format when provided', () => {
    const i18n = createImageGenI18n('en');
    const builder = new PromptBuilder({ i18n });
    const brief = makeBrief({ format: 'webp' });
    const result = builder.build(brief, makeResolvedStyle());

    return result.then((prompt) => {
      expect(prompt.format).toBe('webp');
    });
  });

  it('should default format to png', () => {
    const i18n = createImageGenI18n('en');
    const builder = new PromptBuilder({ i18n });
    const brief = makeBrief();
    const result = builder.build(brief, makeResolvedStyle());

    return result.then((prompt) => {
      expect(prompt.format).toBe('png');
    });
  });

  it('should produce i18n strings in French', () => {
    const i18n = createImageGenI18n('fr');
    const builder = new PromptBuilder({ i18n });
    const brief = makeBrief();
    const result = builder.build(brief, makeResolvedStyle());

    return result.then((prompt) => {
      expect(prompt.text).toContain('Générer une image');
      expect(prompt.text).toContain('mettant en avant');
      expect(prompt.text).toContain('contexte fintech');
    });
  });

  it('should set negativeText from resolved negative tokens', () => {
    const i18n = createImageGenI18n('en');
    const builder = new PromptBuilder({ i18n });
    const brief = makeBrief();
    const result = builder.build(brief, makeResolvedStyle());

    return result.then((prompt) => {
      expect(prompt.negativeText).toBe('blurry, low quality');
    });
  });
});

// =============================================================================
// LLM mode
// =============================================================================

describe('PromptBuilder - LLM mode', () => {
  beforeEach(() => {
    resetI18nRegistry();
  });

  it('should use LLM response text as prompt when LLM succeeds', async () => {
    const i18n = createImageGenI18n('en');
    const llm = makeMockLlm(
      'A vibrant photorealistic hero image of AI-driven DevOps dashboards'
    );
    const builder = new PromptBuilder({ i18n, llm });
    const brief = makeBrief();
    const prompt = await builder.build(brief, makeResolvedStyle());

    expect(prompt.text).toBe(
      'A vibrant photorealistic hero image of AI-driven DevOps dashboards'
    );
    expect(prompt.negativeText).toBe('blurry, low quality');
    expect(prompt.style).toBe('photorealistic');
  });

  it('should fall back to deterministic on LLM error', async () => {
    const i18n = createImageGenI18n('en');
    const llm = makeFailingLlm();
    const builder = new PromptBuilder({ i18n, llm });
    const brief = makeBrief();
    const prompt = await builder.build(brief, makeResolvedStyle());

    // Deterministic output: should contain the title
    expect(prompt.text).toContain('AI for DevOps');
    expect(prompt.text).toContain('Generate a photorealistic image');
  });

  it('should pass temperature to LLM', async () => {
    const i18n = createImageGenI18n('en');
    let capturedTemperature: number | undefined;
    const llm: LLMProvider = {
      chat: async (_messages, options) => {
        capturedTemperature = options?.temperature;
        return {
          message: {
            role: 'assistant',
            content: [{ type: 'text', text: 'test prompt' }],
          },
        };
      },
      stream: async function* () {
        /* noop */
      },
      countTokens: async () => ({ promptTokens: 0 }),
    };
    const builder = new PromptBuilder({ i18n, llm, temperature: 0.8 });
    await builder.build(makeBrief(), makeResolvedStyle());

    expect(capturedTemperature).toBe(0.8);
  });

  it('should default temperature to 0.4', async () => {
    const i18n = createImageGenI18n('en');
    let capturedTemperature: number | undefined;
    const llm: LLMProvider = {
      chat: async (_messages, options) => {
        capturedTemperature = options?.temperature;
        return {
          message: {
            role: 'assistant',
            content: [{ type: 'text', text: 'test' }],
          },
        };
      },
      stream: async function* () {
        /* noop */
      },
      countTokens: async () => ({ promptTokens: 0 }),
    };
    const builder = new PromptBuilder({ i18n, llm });
    await builder.build(makeBrief(), makeResolvedStyle());

    expect(capturedTemperature).toBe(0.4);
  });
});
