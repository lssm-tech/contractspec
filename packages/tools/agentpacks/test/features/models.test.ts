import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import {
  parseModels,
  mergeModelsConfigs,
  scanModelsForSecrets,
  ModelsSchema,
} from '../../src/features/models.js';

const TEST_DIR = join(import.meta.dirname, '..', '__fixtures__', 'models-test');

const SAMPLE_MODELS = {
  default: 'anthropic/claude-sonnet-4-5',
  small: 'anthropic/claude-haiku-4-5',
  agents: {
    build: { model: 'anthropic/claude-opus-4-5', temperature: 0.3 },
    plan: { model: 'anthropic/claude-sonnet-4-5', temperature: 0.1 },
    explore: { model: 'anthropic/claude-haiku-4-5' },
  },
  profiles: {
    quality: {
      description: 'Maximum quality, higher cost',
      default: 'anthropic/claude-opus-4-5',
      small: 'anthropic/claude-sonnet-4-5',
    },
    budget: {
      description: 'Cost-effective for most tasks',
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
          options: {
            thinking: { type: 'enabled', budgetTokens: 16000 },
          },
          variants: {
            high: { thinking: { type: 'enabled', budgetTokens: 32000 } },
            low: { thinking: { type: 'enabled', budgetTokens: 8000 } },
          },
        },
      },
    },
  },
  routing: [
    { when: { complexity: 'high', urgency: 'low' }, use: 'quality' },
    { when: { complexity: 'low', urgency: 'high' }, use: 'fast' },
    { when: { budget: 'limited' }, use: 'budget' },
  ],
  overrides: {
    opencode: { default: 'opencode/claude-sonnet-4-5' },
    cursor: { default: 'cursor:claude-sonnet-4-5' },
  },
};

beforeAll(() => {
  mkdirSync(TEST_DIR, { recursive: true });
  writeFileSync(join(TEST_DIR, 'models.json'), JSON.stringify(SAMPLE_MODELS));
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('ModelsSchema', () => {
  test('validates a complete models config', () => {
    const result = ModelsSchema.parse(SAMPLE_MODELS);
    expect(result.default).toBe('anthropic/claude-sonnet-4-5');
    expect(result.small).toBe('anthropic/claude-haiku-4-5');
  });

  test('validates an empty config', () => {
    const result = ModelsSchema.parse({});
    expect(result.default).toBeUndefined();
    expect(result.small).toBeUndefined();
  });

  test('validates agents with model and temperature', () => {
    const result = ModelsSchema.parse({
      agents: {
        build: { model: 'anthropic/claude-opus-4-5', temperature: 0.3 },
      },
    });
    expect(result.agents!.build!.model).toBe('anthropic/claude-opus-4-5');
    expect(result.agents!.build!.temperature).toBe(0.3);
  });

  test('rejects temperature out of range', () => {
    expect(() =>
      ModelsSchema.parse({
        agents: { build: { model: 'x', temperature: 5 } },
      })
    ).toThrow();
  });
});

describe('parseModels', () => {
  test('parses models.json from a pack', () => {
    const models = parseModels(TEST_DIR, 'test-pack');
    expect(models).not.toBeNull();
    expect(models!.packName).toBe('test-pack');
    expect(models!.config.default).toBe('anthropic/claude-sonnet-4-5');
  });

  test('returns null when no models.json', () => {
    const models = parseModels('/nonexistent/path', 'test-pack');
    expect(models).toBeNull();
  });

  test('parses profiles correctly', () => {
    const models = parseModels(TEST_DIR, 'test-pack')!;
    expect(Object.keys(models.config.profiles!)).toHaveLength(3);
    expect(models.config.profiles!.quality!.description).toBe(
      'Maximum quality, higher cost'
    );
  });

  test('parses routing rules correctly', () => {
    const models = parseModels(TEST_DIR, 'test-pack')!;
    expect(models.config.routing).toHaveLength(3);
    expect(models.config.routing![0]!.use).toBe('quality');
  });

  test('parses per-target overrides correctly', () => {
    const models = parseModels(TEST_DIR, 'test-pack')!;
    expect(models.config.overrides!.opencode!.default).toBe(
      'opencode/claude-sonnet-4-5'
    );
  });

  test('parses providers with model options and variants', () => {
    const models = parseModels(TEST_DIR, 'test-pack')!;
    const anthropic = models.config.providers!.anthropic!;
    expect(anthropic.options!.timeout).toBe(600000);
    expect(
      anthropic.models!['claude-sonnet-4-5']!.variants!.high!.thinking
    ).toEqual({ type: 'enabled', budgetTokens: 32000 });
  });
});

describe('mergeModelsConfigs', () => {
  test('merges configs from multiple packs', () => {
    const config1 = parseModels(TEST_DIR, 'pack-a')!;
    const config2 = {
      packName: 'pack-b',
      sourcePath: '/fake',
      config: {
        default: 'other/model',
        agents: {
          review: { model: 'anthropic/claude-opus-4-5' },
        },
        profiles: {
          custom: { description: 'Custom profile' },
        },
      },
    };

    const { config, warnings } = mergeModelsConfigs([config1, config2]);
    // First-pack-wins for default
    expect(config.default).toBe('anthropic/claude-sonnet-4-5');
    // Additive agents
    expect(config.agents!.review).toBeDefined();
    // Additive profiles
    expect(config.profiles!.custom).toBeDefined();
    // Warning for duplicate default
    expect(warnings.some((w) => w.includes('"default"'))).toBe(true);
  });

  test('first-pack-wins for same agent name', () => {
    const configs = [
      {
        packName: 'pack-a',
        sourcePath: '/a',
        config: { agents: { build: { model: 'model-a' } } },
      },
      {
        packName: 'pack-b',
        sourcePath: '/b',
        config: { agents: { build: { model: 'model-b' } } },
      },
    ];

    const { config, warnings } = mergeModelsConfigs(configs);
    expect(config.agents!.build!.model).toBe('model-a');
    expect(warnings.some((w) => w.includes('build'))).toBe(true);
  });

  test('routing rules are additive', () => {
    const configs = [
      {
        packName: 'a',
        sourcePath: '/a',
        config: {
          routing: [{ when: { complexity: 'high' }, use: 'quality' }],
        },
      },
      {
        packName: 'b',
        sourcePath: '/b',
        config: {
          routing: [{ when: { budget: 'limited' }, use: 'budget' }],
        },
      },
    ];

    const { config } = mergeModelsConfigs(configs);
    expect(config.routing).toHaveLength(2);
  });

  test('returns empty config for no inputs', () => {
    const { config, warnings } = mergeModelsConfigs([]);
    expect(config.default).toBeUndefined();
    expect(warnings).toHaveLength(0);
  });
});

describe('scanModelsForSecrets', () => {
  test('detects no secrets in clean config', () => {
    const warnings = scanModelsForSecrets(SAMPLE_MODELS);
    expect(warnings).toHaveLength(0);
  });

  test('detects api key in config', () => {
    const config = {
      default: 'model-x',
      providers: {
        openai: {
          options: { apiKey: 'sk-abc123456789012345678901234567890' } as Record<
            string,
            unknown
          >,
        },
      },
    };
    const warnings = scanModelsForSecrets(config);
    expect(warnings.length).toBeGreaterThan(0);
  });

  test('detects bearer token in config', () => {
    const config = {
      default: 'model-x',
      providers: {
        custom: {
          options: {
            auth: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
          } as Record<string, unknown>,
        },
      },
    };
    const warnings = scanModelsForSecrets(config);
    expect(warnings.length).toBeGreaterThan(0);
  });

  test('detects password in config', () => {
    const config = {
      default: 'model-x',
      providers: {
        custom: {
          options: { password: 'my-secret-pass' } as Record<string, unknown>,
        },
      },
    };
    const warnings = scanModelsForSecrets(config);
    expect(warnings.length).toBeGreaterThan(0);
  });
});
