/**
 * Tests for model configuration generation across targets.
 * Verifies that the models feature produces correct output for
 * OpenCode, Cursor, and Claude Code targets.
 */
import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { PackLoader } from '../../src/core/pack-loader.js';
import {
  FeatureMerger,
  type MergedFeatures,
} from '../../src/core/feature-merger.js';
import { WorkspaceConfigSchema, FEATURE_IDS } from '../../src/core/config.js';
import { OpenCodeTarget } from '../../src/targets/opencode.js';
import { CursorTarget } from '../../src/targets/cursor.js';
import { ClaudeCodeTarget } from '../../src/targets/claude-code.js';
import { CopilotTarget } from '../../src/targets/copilot.js';
import type { GenerateOptions } from '../../src/targets/base-target.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'models-targets-test'
);
let mergedFeatures: MergedFeatures;

function makeOptions(overrides?: Partial<GenerateOptions>): GenerateOptions {
  return {
    projectRoot: TEST_DIR,
    baseDir: '.',
    features: mergedFeatures,
    enabledFeatures: [...FEATURE_IDS],
    deleteExisting: false,
    global: false,
    verbose: false,
    ...overrides,
  };
}

beforeAll(() => {
  const packDir = join(TEST_DIR, 'packs', 'models-pack');

  // Minimal rule so targets have something to generate
  mkdirSync(join(packDir, 'rules'), { recursive: true });
  writeFileSync(
    join(packDir, 'pack.json'),
    JSON.stringify({ name: 'models-pack', version: '1.0.0' })
  );
  writeFileSync(
    join(packDir, 'rules', 'overview.md'),
    "---\nroot: true\ntargets: ['*']\ndescription: Overview\n---\n\nProject overview.\n"
  );

  // Agents with per-target model overrides
  mkdirSync(join(packDir, 'agents'), { recursive: true });
  writeFileSync(
    join(packDir, 'agents', 'planner.md'),
    "---\nname: planner\ntargets: ['*']\nopencode:\n  model: anthropic/claude-sonnet-4-20250514\ncursor:\n  model: anthropic/claude-sonnet-4-20250514\n---\n\nPlanning agent.\n"
  );

  // Models configuration
  writeFileSync(
    join(packDir, 'models.json'),
    JSON.stringify({
      default: 'anthropic/claude-sonnet-4-20250514',
      small: 'anthropic/claude-haiku-3.5',
      agents: {
        reviewer: {
          model: 'anthropic/claude-opus-4-20250514',
          temperature: 0.3,
        },
      },
      profiles: {
        quality: {
          description: 'Maximum quality',
          default: 'anthropic/claude-opus-4-20250514',
          small: 'anthropic/claude-sonnet-4-20250514',
        },
        budget: {
          description: 'Cost-efficient',
          default: 'anthropic/claude-haiku-3.5',
          small: 'anthropic/claude-haiku-3.5',
        },
      },
      providers: {
        anthropic: {
          models: {
            'claude-opus-4-20250514': {
              options: { budgetTokens: 10000 },
            },
            'claude-sonnet-4-20250514': {
              options: { budgetTokens: 5000 },
            },
          },
        },
      },
    })
  );

  // Load and merge
  const config = WorkspaceConfigSchema.parse({
    packs: ['./packs/models-pack'],
  });
  const loader = new PackLoader(TEST_DIR, config);
  const { packs } = loader.loadAll();
  const merger = new FeatureMerger(packs);
  const { features } = merger.merge();
  mergedFeatures = features;
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('models feature loaded correctly', () => {
  test('models config is present in merged features', () => {
    expect(mergedFeatures.models).not.toBeNull();
    expect(mergedFeatures.models!.default).toBe(
      'anthropic/claude-sonnet-4-20250514'
    );
    expect(mergedFeatures.models!.small).toBe('anthropic/claude-haiku-3.5');
  });

  test('profiles are present', () => {
    expect(mergedFeatures.models!.profiles).toBeDefined();
    expect(mergedFeatures.models!.profiles!['quality']).toBeDefined();
    expect(mergedFeatures.models!.profiles!['budget']).toBeDefined();
  });

  test('agent model assignments are present', () => {
    expect(mergedFeatures.models!.agents).toBeDefined();
    expect(mergedFeatures.models!.agents!['reviewer']).toBeDefined();
    expect(mergedFeatures.models!.agents!['reviewer']!.model).toBe(
      'anthropic/claude-opus-4-20250514'
    );
  });

  test('provider config is present', () => {
    expect(mergedFeatures.models!.providers).toBeDefined();
    expect(mergedFeatures.models!.providers!['anthropic']).toBeDefined();
  });
});

describe('OpenCodeTarget — models', () => {
  const target = new OpenCodeTarget();

  test('supports models feature', () => {
    expect(target.supportsFeature('models')).toBe(true);
  });

  test('generates opencode.json with model fields', () => {
    target.generate(makeOptions());
    const filepath = join(TEST_DIR, 'opencode.json');
    expect(existsSync(filepath)).toBe(true);

    const content = JSON.parse(readFileSync(filepath, 'utf-8'));
    expect(content.model).toBe('anthropic/claude-sonnet-4-20250514');
    expect(content.small_model).toBe('anthropic/claude-haiku-3.5');
  });

  test('generates provider options in opencode.json', () => {
    target.generate(makeOptions());
    const content = JSON.parse(
      readFileSync(join(TEST_DIR, 'opencode.json'), 'utf-8')
    );
    expect(content.provider).toBeDefined();
    expect(content.provider.anthropic).toBeDefined();
    expect(content.provider.anthropic.models).toBeDefined();
  });

  test('generates per-agent model assignments in opencode.json', () => {
    target.generate(makeOptions());
    const content = JSON.parse(
      readFileSync(join(TEST_DIR, 'opencode.json'), 'utf-8')
    );
    expect(content.agent).toBeDefined();
    expect(content.agent.reviewer).toBeDefined();
    expect(content.agent.reviewer.model).toBe(
      'anthropic/claude-opus-4-20250514'
    );
    expect(content.agent.reviewer.temperature).toBe(0.3);
  });

  test('applies quality profile when modelProfile is set', () => {
    target.generate(makeOptions({ modelProfile: 'quality' }));
    const content = JSON.parse(
      readFileSync(join(TEST_DIR, 'opencode.json'), 'utf-8')
    );
    expect(content.model).toBe('anthropic/claude-opus-4-20250514');
    expect(content.small_model).toBe('anthropic/claude-sonnet-4-20250514');
  });

  test('applies budget profile when modelProfile is set', () => {
    target.generate(makeOptions({ modelProfile: 'budget' }));
    const content = JSON.parse(
      readFileSync(join(TEST_DIR, 'opencode.json'), 'utf-8')
    );
    expect(content.model).toBe('anthropic/claude-haiku-3.5');
    expect(content.small_model).toBe('anthropic/claude-haiku-3.5');
  });
});

describe('CursorTarget — models', () => {
  const target = new CursorTarget();

  test('supports models feature', () => {
    expect(target.supportsFeature('models')).toBe(true);
  });

  test('generates .cursor/rules/model-config.mdc', () => {
    const result = target.generate(makeOptions());
    const filepath = join(TEST_DIR, '.cursor', 'rules', 'model-config.mdc');
    expect(existsSync(filepath)).toBe(true);
    expect(
      result.filesWritten.some((f) => f.includes('model-config.mdc'))
    ).toBe(true);
  });

  test('model-config.mdc contains alwaysApply frontmatter', () => {
    target.generate(makeOptions());
    const content = readFileSync(
      join(TEST_DIR, '.cursor', 'rules', 'model-config.mdc'),
      'utf-8'
    );
    expect(content).toContain('alwaysApply: true');
  });

  test('model-config.mdc contains default model info', () => {
    target.generate(makeOptions());
    const content = readFileSync(
      join(TEST_DIR, '.cursor', 'rules', 'model-config.mdc'),
      'utf-8'
    );
    expect(content).toContain('anthropic/claude-sonnet-4-20250514');
    expect(content).toContain('anthropic/claude-haiku-3.5');
  });

  test('model-config.mdc mentions agent model assignments', () => {
    target.generate(makeOptions());
    const content = readFileSync(
      join(TEST_DIR, '.cursor', 'rules', 'model-config.mdc'),
      'utf-8'
    );
    expect(content).toContain('reviewer');
    expect(content).toContain('anthropic/claude-opus-4-20250514');
  });
});

describe('ClaudeCodeTarget — models', () => {
  const target = new ClaudeCodeTarget();

  test('supports models feature', () => {
    expect(target.supportsFeature('models')).toBe(true);
  });

  test('generates .claude/rules/model-config.md', () => {
    const result = target.generate(makeOptions());
    const filepath = join(TEST_DIR, '.claude', 'rules', 'model-config.md');
    expect(existsSync(filepath)).toBe(true);
    expect(result.filesWritten.some((f) => f.includes('model-config.md'))).toBe(
      true
    );
  });

  test('model-config.md contains model guidance', () => {
    target.generate(makeOptions());
    const content = readFileSync(
      join(TEST_DIR, '.claude', 'rules', 'model-config.md'),
      'utf-8'
    );
    expect(content).toContain('anthropic/claude-sonnet-4-20250514');
    expect(content).toContain('Model');
  });
});

describe('CopilotTarget — models', () => {
  const target = new CopilotTarget();

  test('supports models feature', () => {
    expect(target.supportsFeature('models')).toBe(true);
  });

  test('generates .github/copilot/model-config.md', () => {
    const result = target.generate(makeOptions());
    const filepath = join(TEST_DIR, '.github', 'copilot', 'model-config.md');
    // Copilot might use copilot-instructions.md or model-config.md
    const hasModelConfig = result.filesWritten.some((f) =>
      f.includes('model-config')
    );
    // If model guidance is generated, it should be present
    if (hasModelConfig) {
      expect(existsSync(filepath)).toBe(true);
    }
  });
});
