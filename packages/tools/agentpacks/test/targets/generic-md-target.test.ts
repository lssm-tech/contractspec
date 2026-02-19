import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, readFileSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createGenericMdTarget } from '../../src/targets/generic-md-target.js';
import { PackLoader } from '../../src/core/pack-loader.js';
import { FeatureMerger } from '../../src/core/feature-merger.js';
import {
  WorkspaceConfigSchema,
  type FeatureId,
} from '../../src/core/config.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'generic-target-test'
);

beforeAll(() => {
  const packDir = join(TEST_DIR, 'packs', 'test-pack');
  mkdirSync(join(packDir, 'rules'), { recursive: true });
  writeFileSync(
    join(packDir, 'pack.json'),
    JSON.stringify({ name: 'test-pack', version: '1.0.0' })
  );
  writeFileSync(
    join(packDir, 'rules', 'coding-style.md'),
    "---\ntargets: ['*']\n---\n\nFollow consistent coding style.\n"
  );
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('createGenericMdTarget', () => {
  test('creates a target with correct id and name', () => {
    const target = createGenericMdTarget({
      id: 'cline',
      name: 'Cline',
      configDir: '.cline',
      supportedFeatures: ['rules', 'mcp'],
    });
    expect(target.id).toBe('cline');
    expect(target.name).toBe('Cline');
  });

  test('reports supported features', () => {
    const target = createGenericMdTarget({
      id: 'test',
      name: 'Test',
      configDir: '.test',
      supportedFeatures: ['rules', 'commands'],
    });
    expect(target.supportsFeature('rules')).toBe(true);
    expect(target.supportsFeature('commands')).toBe(true);
    expect(target.supportsFeature('skills')).toBe(false);
  });

  test('generates rule files in configDir', () => {
    const target = createGenericMdTarget({
      id: 'cline',
      name: 'Cline',
      configDir: '.cline',
      supportedFeatures: ['rules'],
    });

    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/test-pack'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    const merger = new FeatureMerger(packs);
    const { features } = merger.merge();

    const result = target.generate({
      projectRoot: TEST_DIR,
      baseDir: '.',
      features,
      enabledFeatures: ['rules'] as FeatureId[],
      deleteExisting: false,
      global: false,
      verbose: false,
    });

    expect(result.filesWritten.length).toBeGreaterThan(0);
    const ruleFile = join(TEST_DIR, '.cline', 'rules', 'coding-style.md');
    expect(existsSync(ruleFile)).toBe(true);
  });
});
