import { describe, expect, test } from 'bun:test';
import {
  resolveModels,
  resolveAgentModel,
  resolveProfileInheritance,
} from '../../src/core/profile-resolver.js';
import type { ModelsConfig, ModelProfile } from '../../src/features/models.js';

const SAMPLE_CONFIG: ModelsConfig = {
  default: 'anthropic/claude-sonnet-4-5',
  small: 'anthropic/claude-haiku-4-5',
  agents: {
    build: { model: 'anthropic/claude-opus-4-5', temperature: 0.3 },
    plan: { model: 'anthropic/claude-sonnet-4-5', temperature: 0.1 },
    explore: { model: 'anthropic/claude-haiku-4-5' },
  },
  profiles: {
    quality: {
      description: 'Maximum quality',
      default: 'anthropic/claude-opus-4-5',
      small: 'anthropic/claude-sonnet-4-5',
    },
    budget: {
      description: 'Cost-effective',
      default: 'anthropic/claude-sonnet-4-5',
      small: 'anthropic/claude-haiku-4-5',
    },
    fast: {
      description: 'Lowest latency',
      default: 'anthropic/claude-haiku-4-5',
      small: 'anthropic/claude-haiku-4-5',
    },
  },
  providers: {
    anthropic: {
      options: { timeout: 600000 },
      models: {
        'claude-sonnet-4-5': {
          options: { thinking: { type: 'enabled', budgetTokens: 16000 } },
          variants: {
            high: { thinking: { type: 'enabled', budgetTokens: 32000 } },
          },
        },
      },
    },
  },
  routing: [
    { when: { complexity: 'high' }, use: 'quality' },
    { when: { budget: 'limited' }, use: 'budget' },
  ],
  overrides: {
    opencode: { default: 'opencode/claude-sonnet-4-5' },
    cursor: { default: 'cursor:claude-sonnet-4-5' },
  },
};

describe('resolveModels', () => {
  test('returns base values with no profile', () => {
    const result = resolveModels(SAMPLE_CONFIG);
    expect(result.default).toBe('anthropic/claude-sonnet-4-5');
    expect(result.small).toBe('anthropic/claude-haiku-4-5');
    expect(result.agents.build.model).toBe('anthropic/claude-opus-4-5');
  });

  test('applies quality profile overlay', () => {
    const result = resolveModels(SAMPLE_CONFIG, 'quality');
    expect(result.default).toBe('anthropic/claude-opus-4-5');
    expect(result.small).toBe('anthropic/claude-sonnet-4-5');
    expect(result.activeProfile).toBe('quality');
  });

  test('applies fast profile overlay', () => {
    const result = resolveModels(SAMPLE_CONFIG, 'fast');
    expect(result.default).toBe('anthropic/claude-haiku-4-5');
    expect(result.small).toBe('anthropic/claude-haiku-4-5');
  });

  test('applies target-specific overrides', () => {
    const result = resolveModels(SAMPLE_CONFIG, undefined, 'opencode');
    expect(result.default).toBe('opencode/claude-sonnet-4-5');
    // small stays as base
    expect(result.small).toBe('anthropic/claude-haiku-4-5');
  });

  test('profile + target override combined', () => {
    const result = resolveModels(SAMPLE_CONFIG, 'quality', 'cursor');
    // Profile sets default to opus, but cursor override overrides to cursor:sonnet
    expect(result.default).toBe('cursor:claude-sonnet-4-5');
    // Profile sets small to sonnet
    expect(result.small).toBe('anthropic/claude-sonnet-4-5');
  });

  test('ignores unknown profile gracefully', () => {
    const result = resolveModels(SAMPLE_CONFIG, 'nonexistent');
    expect(result.default).toBe('anthropic/claude-sonnet-4-5');
  });

  test('ignores unknown target override gracefully', () => {
    const result = resolveModels(SAMPLE_CONFIG, undefined, 'geminicli');
    expect(result.default).toBe('anthropic/claude-sonnet-4-5');
  });

  test('passes through providers', () => {
    const result = resolveModels(SAMPLE_CONFIG);
    expect(result.providers.anthropic).toBeDefined();
    expect(result.providers.anthropic!.options!.timeout).toBe(600000);
  });

  test('passes through routing rules', () => {
    const result = resolveModels(SAMPLE_CONFIG);
    expect(result.routing).toHaveLength(2);
    expect(result.routing[0]!.use).toBe('quality');
  });

  test('includes profile names for guidance', () => {
    const result = resolveModels(SAMPLE_CONFIG);
    expect(result.profileNames).toEqual(['quality', 'budget', 'fast']);
  });

  test('handles empty config', () => {
    const result = resolveModels({});
    expect(result.default).toBeUndefined();
    expect(result.small).toBeUndefined();
    expect(Object.keys(result.agents)).toHaveLength(0);
    expect(result.routing).toHaveLength(0);
  });
});

describe('resolveAgentModel', () => {
  test('returns model from resolved agents', () => {
    const resolved = resolveModels(SAMPLE_CONFIG);
    const result = resolveAgentModel(resolved, 'build');
    expect(result.model).toBe('anthropic/claude-opus-4-5');
    expect(result.temperature).toBe(0.3);
  });

  test('falls back to frontmatter model', () => {
    const resolved = resolveModels(SAMPLE_CONFIG);
    const result = resolveAgentModel(
      resolved,
      'unknown-agent',
      'frontmatter/model'
    );
    expect(result.model).toBe('frontmatter/model');
  });

  test('models feature takes precedence over frontmatter', () => {
    const resolved = resolveModels(SAMPLE_CONFIG);
    const result = resolveAgentModel(resolved, 'build', 'should-be-ignored');
    expect(result.model).toBe('anthropic/claude-opus-4-5');
  });

  test('returns empty for unknown agent with no frontmatter', () => {
    const resolved = resolveModels(SAMPLE_CONFIG);
    const result = resolveAgentModel(resolved, 'unknown-agent');
    expect(result.model).toBeUndefined();
  });
});

describe('resolveProfileInheritance', () => {
  const profiles: Record<string, ModelProfile> = {
    base: {
      description: 'Base profile',
      default: 'claude-sonnet-4-20250514',
      small: 'claude-haiku-3-5-20250514',
      agents: {
        build: { model: 'claude-sonnet-4-20250514', temperature: 0.3 },
      },
    },
    premium: {
      extends: 'base',
      description: 'Premium tier',
      default: 'claude-opus-4-6',
      // small inherited from base
      agents: {
        review: { model: 'claude-opus-4-6', temperature: 0.1 },
      },
    },
    'premium-fast': {
      extends: 'premium',
      small: 'claude-haiku-3-5-20250514',
      // default inherited from premium → opus
    },
    standalone: {
      description: 'Standalone, no inheritance',
      default: 'gpt-4o',
    },
  };

  test('resolves profile without extends', () => {
    const result = resolveProfileInheritance('base', profiles);
    expect(result.default).toBe('claude-sonnet-4-20250514');
    expect(result.small).toBe('claude-haiku-3-5-20250514');
    expect(result.description).toBe('Base profile');
  });

  test('inherits from parent profile', () => {
    const result = resolveProfileInheritance('premium', profiles);
    expect(result.default).toBe('claude-opus-4-6');
    // Inherited from base
    expect(result.small).toBe('claude-haiku-3-5-20250514');
    expect(result.description).toBe('Premium tier');
  });

  test('inherits agents from parent and merges', () => {
    const result = resolveProfileInheritance('premium', profiles);
    // From base
    expect(result.agents?.build?.model).toBe('claude-sonnet-4-20250514');
    // From premium (child)
    expect(result.agents?.review?.model).toBe('claude-opus-4-6');
  });

  test('resolves multi-level inheritance', () => {
    const result = resolveProfileInheritance('premium-fast', profiles);
    // From premium → from base (not overridden in premium-fast)
    expect(result.default).toBe('claude-opus-4-6');
    // Overridden in premium-fast
    expect(result.small).toBe('claude-haiku-3-5-20250514');
  });

  test('detects circular inheritance', () => {
    const circular: Record<string, ModelProfile> = {
      a: { extends: 'b', default: 'model-a' },
      b: { extends: 'a', default: 'model-b' },
    };
    expect(() => resolveProfileInheritance('a', circular)).toThrow(
      /[Cc]ircular/
    );
  });

  test('throws for missing parent profile', () => {
    const broken: Record<string, ModelProfile> = {
      child: { extends: 'nonexistent', default: 'model' },
    };
    expect(() => resolveProfileInheritance('child', broken)).toThrow(
      /not found/
    );
  });

  test('throws for missing profile name', () => {
    expect(() => resolveProfileInheritance('missing', profiles)).toThrow(
      /not found/
    );
  });

  test('works with resolveModels for inherited profiles', () => {
    const config: ModelsConfig = {
      default: 'claude-sonnet-4-20250514',
      small: 'claude-haiku-3-5-20250514',
      profiles,
    };

    // Using "premium" profile which inherits from "base"
    const result = resolveModels(config, 'premium');
    expect(result.default).toBe('claude-opus-4-6');
    expect(result.small).toBe('claude-haiku-3-5-20250514');
    expect(result.activeProfile).toBe('premium');
  });
});
