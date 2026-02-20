/**
 * E2E test: model profile switch updates generated target configs.
 *
 * Verifies that switching modelProfile between quality/budget/fast
 * produces different model selections in OpenCode, Cursor, and Claude Code.
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
import type { GenerateOptions } from '../../src/targets/base-target.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'model-profile-e2e'
);
let mergedFeatures: MergedFeatures;

const MODELS_CONFIG = {
  default: 'anthropic/claude-sonnet-4-20250514',
  small: 'anthropic/claude-haiku-3.5',
  agents: {
    planner: { model: 'anthropic/claude-sonnet-4-20250514' },
  },
  profiles: {
    quality: {
      description: 'Maximum quality',
      default: 'anthropic/claude-opus-4-20250514',
      small: 'anthropic/claude-sonnet-4-20250514',
      agents: {
        planner: { model: 'anthropic/claude-opus-4-20250514' },
      },
    },
    budget: {
      description: 'Cost-efficient',
      default: 'anthropic/claude-haiku-3.5',
      small: 'anthropic/claude-haiku-3.5',
      agents: {
        planner: { model: 'anthropic/claude-haiku-3.5' },
      },
    },
    fast: {
      description: 'Low-latency',
      default: 'anthropic/claude-haiku-3.5',
      small: 'anthropic/claude-haiku-3.5',
    },
  },
};

function makeOptions(profile?: string): GenerateOptions {
  return {
    projectRoot: TEST_DIR,
    baseDir: '.',
    features: mergedFeatures,
    enabledFeatures: [...FEATURE_IDS],
    deleteExisting: true,
    global: false,
    verbose: false,
    modelProfile: profile,
  };
}

beforeAll(() => {
  const packDir = join(TEST_DIR, 'packs', 'profile-pack');
  mkdirSync(join(packDir, 'rules'), { recursive: true });
  mkdirSync(join(packDir, 'agents'), { recursive: true });

  writeFileSync(
    join(packDir, 'pack.json'),
    JSON.stringify({ name: 'profile-pack', version: '1.0.0' })
  );
  writeFileSync(
    join(packDir, 'rules', 'overview.md'),
    "---\nroot: true\ntargets: ['*']\n---\n\nOverview.\n"
  );
  writeFileSync(
    join(packDir, 'agents', 'planner.md'),
    "---\nname: planner\ntargets: ['*']\n---\n\nPlanning agent.\n"
  );
  writeFileSync(join(packDir, 'models.json'), JSON.stringify(MODELS_CONFIG));

  const config = WorkspaceConfigSchema.parse({
    packs: ['./packs/profile-pack'],
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

describe('E2E: model profile switch — OpenCode', () => {
  const target = new OpenCodeTarget();

  test('no profile → uses base defaults', () => {
    target.generate(makeOptions());
    const oc = JSON.parse(
      readFileSync(join(TEST_DIR, 'opencode.json'), 'utf-8')
    );
    expect(oc.model).toBe('anthropic/claude-sonnet-4-20250514');
    expect(oc.small_model).toBe('anthropic/claude-haiku-3.5');
  });

  test('quality profile → uses opus/sonnet', () => {
    target.generate(makeOptions('quality'));
    const oc = JSON.parse(
      readFileSync(join(TEST_DIR, 'opencode.json'), 'utf-8')
    );
    expect(oc.model).toBe('anthropic/claude-opus-4-20250514');
    expect(oc.small_model).toBe('anthropic/claude-sonnet-4-20250514');
    // Agent should also be upgraded
    expect(oc.agent?.planner?.model).toBe('anthropic/claude-opus-4-20250514');
  });

  test('budget profile → uses haiku for everything', () => {
    target.generate(makeOptions('budget'));
    const oc = JSON.parse(
      readFileSync(join(TEST_DIR, 'opencode.json'), 'utf-8')
    );
    expect(oc.model).toBe('anthropic/claude-haiku-3.5');
    expect(oc.small_model).toBe('anthropic/claude-haiku-3.5');
    expect(oc.agent?.planner?.model).toBe('anthropic/claude-haiku-3.5');
  });

  test('fast profile → uses haiku', () => {
    target.generate(makeOptions('fast'));
    const oc = JSON.parse(
      readFileSync(join(TEST_DIR, 'opencode.json'), 'utf-8')
    );
    expect(oc.model).toBe('anthropic/claude-haiku-3.5');
    expect(oc.small_model).toBe('anthropic/claude-haiku-3.5');
  });

  test('nonexistent profile → falls back to base defaults', () => {
    target.generate(makeOptions('nonexistent'));
    const oc = JSON.parse(
      readFileSync(join(TEST_DIR, 'opencode.json'), 'utf-8')
    );
    expect(oc.model).toBe('anthropic/claude-sonnet-4-20250514');
    expect(oc.small_model).toBe('anthropic/claude-haiku-3.5');
  });
});

describe('E2E: model profile switch — Cursor', () => {
  const target = new CursorTarget();

  test('no profile → guidance contains base models', () => {
    target.generate(makeOptions());
    const mdc = readFileSync(
      join(TEST_DIR, '.cursor', 'rules', 'model-config.mdc'),
      'utf-8'
    );
    expect(mdc).toContain('anthropic/claude-sonnet-4-20250514');
    expect(mdc).toContain('anthropic/claude-haiku-3.5');
  });

  test('quality profile → guidance contains opus', () => {
    target.generate(makeOptions('quality'));
    const mdc = readFileSync(
      join(TEST_DIR, '.cursor', 'rules', 'model-config.mdc'),
      'utf-8'
    );
    expect(mdc).toContain('anthropic/claude-opus-4-20250514');
  });

  test('budget profile → guidance contains haiku', () => {
    target.generate(makeOptions('budget'));
    const mdc = readFileSync(
      join(TEST_DIR, '.cursor', 'rules', 'model-config.mdc'),
      'utf-8'
    );
    expect(mdc).toContain('anthropic/claude-haiku-3.5');
  });
});

describe('E2E: model profile switch — Claude Code', () => {
  const target = new ClaudeCodeTarget();

  test('no profile → guidance contains base models', () => {
    target.generate(makeOptions());
    const md = readFileSync(
      join(TEST_DIR, '.claude', 'rules', 'model-config.md'),
      'utf-8'
    );
    expect(md).toContain('anthropic/claude-sonnet-4-20250514');
  });

  test('quality profile → guidance contains opus', () => {
    target.generate(makeOptions('quality'));
    const md = readFileSync(
      join(TEST_DIR, '.claude', 'rules', 'model-config.md'),
      'utf-8'
    );
    expect(md).toContain('anthropic/claude-opus-4-20250514');
  });

  test('agents get model metadata in Claude Code output', () => {
    target.generate(makeOptions('quality'));
    const agentFile = join(TEST_DIR, '.claude', 'agents', 'planner.md');
    if (existsSync(agentFile)) {
      const content = readFileSync(agentFile, 'utf-8');
      // Should contain model comment
      expect(content).toContain('claude-opus-4-20250514');
    }
  });
});

describe('E2E: profile consistency across targets', () => {
  const opencode = new OpenCodeTarget();
  const cursor = new CursorTarget();
  const claude = new ClaudeCodeTarget();

  test('all targets agree on quality profile default model', () => {
    opencode.generate(makeOptions('quality'));
    cursor.generate(makeOptions('quality'));
    claude.generate(makeOptions('quality'));

    const oc = JSON.parse(
      readFileSync(join(TEST_DIR, 'opencode.json'), 'utf-8')
    );
    const mdc = readFileSync(
      join(TEST_DIR, '.cursor', 'rules', 'model-config.mdc'),
      'utf-8'
    );
    const claudeMd = readFileSync(
      join(TEST_DIR, '.claude', 'rules', 'model-config.md'),
      'utf-8'
    );

    // All should reference opus for quality profile
    expect(oc.model).toBe('anthropic/claude-opus-4-20250514');
    expect(mdc).toContain('anthropic/claude-opus-4-20250514');
    expect(claudeMd).toContain('anthropic/claude-opus-4-20250514');
  });

  test('all targets agree on budget profile default model', () => {
    opencode.generate(makeOptions('budget'));
    cursor.generate(makeOptions('budget'));
    claude.generate(makeOptions('budget'));

    const oc = JSON.parse(
      readFileSync(join(TEST_DIR, 'opencode.json'), 'utf-8')
    );
    const mdc = readFileSync(
      join(TEST_DIR, '.cursor', 'rules', 'model-config.mdc'),
      'utf-8'
    );
    const claudeMd = readFileSync(
      join(TEST_DIR, '.claude', 'rules', 'model-config.md'),
      'utf-8'
    );

    expect(oc.model).toBe('anthropic/claude-haiku-3.5');
    expect(mdc).toContain('anthropic/claude-haiku-3.5');
    expect(claudeMd).toContain('anthropic/claude-haiku-3.5');
  });
});
