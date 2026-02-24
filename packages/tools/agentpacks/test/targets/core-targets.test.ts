/**
 * Integration tests for all core target generators.
 * Loads a pack, merges features, generates output for each target,
 * and verifies output files are created correctly.
 */
import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { PackLoader } from '../../src/core/pack-loader.js';
import {
  FeatureMerger,
  type MergedFeatures,
} from '../../src/core/feature-merger.js';
import {
  WorkspaceConfigSchema,
  FEATURE_IDS,
  type FeatureId,
} from '../../src/core/config.js';
import { OpenCodeTarget } from '../../src/targets/opencode.js';
import { CursorTarget } from '../../src/targets/cursor.js';
import { ClaudeCodeTarget } from '../../src/targets/claude-code.js';
import { CodexCliTarget } from '../../src/targets/codex-cli.js';
import { GeminiCliTarget } from '../../src/targets/gemini-cli.js';
import { CopilotTarget } from '../../src/targets/copilot.js';
import { AgentsMdTarget } from '../../src/targets/agents-md.js';
import type { GenerateOptions } from '../../src/targets/base-target.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'core-targets-test'
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
  const packDir = join(TEST_DIR, 'packs', 'test-pack');

  // Rules
  mkdirSync(join(packDir, 'rules'), { recursive: true });
  writeFileSync(
    join(packDir, 'pack.json'),
    JSON.stringify({ name: 'test-pack', version: '1.0.0' })
  );
  writeFileSync(
    join(packDir, 'rules', 'overview.md'),
    "---\nroot: true\ntargets: ['*']\ndescription: Overview\n---\n\nProject overview rules.\n"
  );
  writeFileSync(
    join(packDir, 'rules', 'security.md'),
    "---\nroot: false\ntargets: ['*']\n---\n\nSecurity guidelines.\n"
  );

  // Commands
  mkdirSync(join(packDir, 'commands'), { recursive: true });
  writeFileSync(
    join(packDir, 'commands', 'lint.md'),
    "---\ntargets: ['*']\n---\n\nRun the linter.\n"
  );

  // Agents
  mkdirSync(join(packDir, 'agents'), { recursive: true });
  writeFileSync(
    join(packDir, 'agents', 'reviewer.md'),
    "---\nname: reviewer\ntargets: ['*']\n---\n\nReview code.\n"
  );

  // Skills
  mkdirSync(join(packDir, 'skills', 'migrate'), { recursive: true });
  writeFileSync(
    join(packDir, 'skills', 'migrate', 'SKILL.md'),
    "---\nname: migrate\ntargets: ['*']\n---\n\nMigration steps.\n"
  );

  // Hooks
  mkdirSync(join(packDir, 'hooks'), { recursive: true });
  writeFileSync(
    join(packDir, 'hooks', 'hooks.json'),
    JSON.stringify(
      {
        version: 1,
        hooks: {
          afterFileEdit: [{ command: 'echo edited' }],
        },
      },
      null,
      2
    )
  );

  // MCP
  writeFileSync(
    join(packDir, 'mcp.json'),
    JSON.stringify({
      mcpServers: { test: { command: 'echo', args: ['hello'] } },
    })
  );

  // Ignore
  writeFileSync(join(packDir, 'ignore'), 'node_modules\n.env\ndist\n');

  // Load and merge
  const config = WorkspaceConfigSchema.parse({
    packs: ['./packs/test-pack'],
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

describe('OpenCodeTarget', () => {
  const target = new OpenCodeTarget();

  test('generates detail rules in .opencode/memories/', () => {
    const result = target.generate(makeOptions());
    expect(result.filesWritten.length).toBeGreaterThan(0);
    expect(existsSync(join(TEST_DIR, '.opencode', 'memories'))).toBe(true);
  });

  test('generates commands in .opencode/commands/', () => {
    const result = target.generate(makeOptions());
    const cmdFile = join(TEST_DIR, '.opencode', 'commands', 'lint.md');
    expect(result.filesWritten.some((f) => f.includes('lint'))).toBe(true);
  });

  test('supports all main features', () => {
    expect(target.supportsFeature('rules')).toBe(true);
    expect(target.supportsFeature('commands')).toBe(true);
    expect(target.supportsFeature('agents')).toBe(true);
    expect(target.supportsFeature('skills')).toBe(true);
    expect(target.supportsFeature('mcp')).toBe(true);
  });
});

describe('CursorTarget', () => {
  const target = new CursorTarget();

  test('generates rules as .mdc files in .cursor/rules/', () => {
    const result = target.generate(makeOptions());
    expect(result.filesWritten.length).toBeGreaterThan(0);
    const mdcFiles = result.filesWritten.filter((f) => f.endsWith('.mdc'));
    expect(mdcFiles.length).toBeGreaterThan(0);
  });

  test('generates agents in .cursor/agents/', () => {
    const result = target.generate(makeOptions());
    expect(result.filesWritten.some((f) => f.includes('agents'))).toBe(true);
  });

  test('generates hooks in .cursor/hooks.json', () => {
    const result = target.generate(makeOptions());
    const hooksPath = join(TEST_DIR, '.cursor', 'hooks.json');
    expect(result.filesWritten.some((f) => f.includes('hooks.json'))).toBe(
      true
    );
    expect(existsSync(hooksPath)).toBe(true);

    const hooks = JSON.parse(readFileSync(hooksPath, 'utf-8'));
    expect(hooks.version).toBe(1);
    expect(hooks.hooks.afterFileEdit).toHaveLength(1);
  });

  test('generates MCP in .cursor/mcp.json', () => {
    const result = target.generate(makeOptions());
    expect(result.filesWritten.some((f) => f.includes('mcp.json'))).toBe(true);
  });
});

describe('ClaudeCodeTarget', () => {
  const target = new ClaudeCodeTarget();

  test('generates CLAUDE.md for root rules', () => {
    const result = target.generate(makeOptions());
    expect(result.filesWritten.some((f) => f.includes('CLAUDE.md'))).toBe(true);
  });

  test('generates detail rules in .claude/rules/', () => {
    const result = target.generate(makeOptions());
    expect(result.filesWritten.some((f) => f.includes('.claude'))).toBe(true);
  });
});

describe('CodexCliTarget', () => {
  const target = new CodexCliTarget();

  test('generates memories in .codex/memories/', () => {
    const result = target.generate(makeOptions());
    expect(result.filesWritten.length).toBeGreaterThan(0);
    expect(existsSync(join(TEST_DIR, '.codex', 'memories'))).toBe(true);
  });
});

describe('GeminiCliTarget', () => {
  const target = new GeminiCliTarget();

  test('generates rules in .gemini/', () => {
    const result = target.generate(makeOptions());
    expect(result.filesWritten.length).toBeGreaterThan(0);
  });
});

describe('CopilotTarget', () => {
  const target = new CopilotTarget();

  test('generates instructions in .github/copilot-instructions.md', () => {
    const result = target.generate(makeOptions());
    expect(
      result.filesWritten.some((f) => f.includes('copilot-instructions'))
    ).toBe(true);
  });
});

describe('AgentsMdTarget', () => {
  const target = new AgentsMdTarget();

  test('generates AGENTS.md at project root', () => {
    const result = target.generate(makeOptions());
    expect(result.filesWritten.some((f) => f.endsWith('AGENTS.md'))).toBe(true);
    expect(existsSync(join(TEST_DIR, 'AGENTS.md'))).toBe(true);
  });

  test('contains rule content in AGENTS.md', () => {
    target.generate(makeOptions());
    const content = readFileSync(join(TEST_DIR, 'AGENTS.md'), 'utf-8');
    expect(content).toContain('overview');
  });
});
