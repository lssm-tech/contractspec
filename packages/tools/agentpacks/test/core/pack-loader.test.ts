import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { PackLoader } from '../../src/core/pack-loader.js';
import { WorkspaceConfigSchema } from '../../src/core/config.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'pack-loader-test'
);

beforeAll(() => {
  // Create a minimal project with two packs
  mkdirSync(TEST_DIR, { recursive: true });

  // Pack A
  const packADir = join(TEST_DIR, 'packs', 'pack-a');
  mkdirSync(join(packADir, 'rules'), { recursive: true });
  writeFileSync(
    join(packADir, 'pack.json'),
    JSON.stringify({ name: 'pack-a', version: '1.0.0' })
  );
  writeFileSync(
    join(packADir, 'rules', 'overview.md'),
    '---\nroot: true\n---\n\nOverview rule from pack A.\n'
  );

  // Pack B
  const packBDir = join(TEST_DIR, 'packs', 'pack-b');
  mkdirSync(join(packBDir, 'rules'), { recursive: true });
  mkdirSync(join(packBDir, 'commands'), { recursive: true });
  writeFileSync(
    join(packBDir, 'pack.json'),
    JSON.stringify({ name: 'pack-b', version: '2.0.0' })
  );
  writeFileSync(
    join(packBDir, 'rules', 'security.md'),
    'Security rules content.\n'
  );
  writeFileSync(join(packBDir, 'commands', 'lint.md'), 'Run the linter.\n');
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('PackLoader', () => {
  test('loads packs from config', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/pack-a', './packs/pack-b'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs, warnings } = loader.loadAll();
    expect(packs).toHaveLength(2);
    expect(warnings).toHaveLength(0);
  });

  test('preserves pack declaration order', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/pack-b', './packs/pack-a'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    expect(packs[0]!.manifest.name).toBe('pack-b');
    expect(packs[1]!.manifest.name).toBe('pack-a');
  });

  test('parses rules from packs', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/pack-a'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    expect(packs[0]!.rules).toHaveLength(1);
    expect(packs[0]!.rules[0]!.name).toBe('overview');
  });

  test('parses commands from packs', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/pack-b'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    expect(packs[0]!.commands).toHaveLength(1);
    expect(packs[0]!.commands[0]!.name).toBe('lint');
  });

  test('filters out disabled packs by name', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/pack-a', './packs/pack-b'],
      disabled: ['pack-a'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    expect(packs).toHaveLength(1);
    expect(packs[0]!.manifest.name).toBe('pack-b');
  });

  test('filters out disabled packs by ref', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/pack-a', './packs/pack-b'],
      disabled: ['./packs/pack-b'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    expect(packs).toHaveLength(1);
    expect(packs[0]!.manifest.name).toBe('pack-a');
  });

  test('warns on non-existent pack directory', () => {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/nonexistent'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs, warnings } = loader.loadAll();
    expect(packs).toHaveLength(0);
    expect(warnings.length).toBeGreaterThan(0);
  });

  test('generates manifest from directory name when pack.json missing', () => {
    // Create a pack without pack.json
    const noManifestDir = join(TEST_DIR, 'packs', 'no-manifest');
    mkdirSync(join(noManifestDir, 'rules'), { recursive: true });
    writeFileSync(join(noManifestDir, 'rules', 'basic.md'), 'Basic rule.\n');

    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/no-manifest'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    expect(packs).toHaveLength(1);
    expect(packs[0]!.manifest.name).toBe('no-manifest');
  });
});
