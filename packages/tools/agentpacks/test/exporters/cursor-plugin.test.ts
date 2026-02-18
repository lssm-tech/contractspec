import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, readFileSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { exportCursorPlugin } from '../../src/exporters/cursor-plugin.js';
import { PackLoader } from '../../src/core/pack-loader.js';
import { WorkspaceConfigSchema } from '../../src/core/config.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'cursor-export-test'
);
const OUTPUT_DIR = join(TEST_DIR, 'output');

beforeAll(() => {
  // Create a pack to export
  const packDir = join(TEST_DIR, 'packs', 'export-pack');
  mkdirSync(join(packDir, 'rules'), { recursive: true });
  mkdirSync(join(packDir, 'commands'), { recursive: true });
  mkdirSync(join(packDir, 'agents'), { recursive: true });

  writeFileSync(
    join(packDir, 'pack.json'),
    JSON.stringify({
      name: 'export-pack',
      version: '1.0.0',
      description: 'Test',
    })
  );
  writeFileSync(
    join(packDir, 'rules', 'code-quality.md'),
    '---\ndescription: Code quality rules\nroot: true\n---\n\nFollow quality standards.\n'
  );
  writeFileSync(join(packDir, 'commands', 'lint.md'), 'Run lint checks.\n');
  writeFileSync(
    join(packDir, 'agents', 'reviewer.md'),
    '---\nname: reviewer\ndescription: Review code\n---\n\nReview the code.\n'
  );
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('exportCursorPlugin', () => {
  test('exports a pack as Cursor plugin structure', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/export-pack'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    expect(packs).toHaveLength(1);

    const result = exportCursorPlugin(packs[0]!, OUTPUT_DIR);
    expect(result.filesWritten.length).toBeGreaterThan(0);
    expect(result.outputDir).toContain('export-pack');
  });

  test('creates manifest.json', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/export-pack'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    const result = exportCursorPlugin(packs[0]!, OUTPUT_DIR);

    const manifestPath = join(result.outputDir, 'manifest.json');
    expect(existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    expect(manifest.name).toBe('export-pack');
    expect(manifest.version).toBe('1.0.0');
  });

  test('exports rules as .mdc files', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/export-pack'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    const result = exportCursorPlugin(packs[0]!, OUTPUT_DIR);

    const ruleFile = join(result.outputDir, 'rules', 'code-quality.mdc');
    expect(existsSync(ruleFile)).toBe(true);
  });

  test('exports commands', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/export-pack'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    const result = exportCursorPlugin(packs[0]!, OUTPUT_DIR);

    const cmdFile = join(result.outputDir, 'commands', 'lint.md');
    expect(existsSync(cmdFile)).toBe(true);
  });

  test('exports agents', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/export-pack'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    const result = exportCursorPlugin(packs[0]!, OUTPUT_DIR);

    const agentFile = join(result.outputDir, 'agents', 'reviewer.md');
    expect(existsSync(agentFile)).toBe(true);
  });
});
