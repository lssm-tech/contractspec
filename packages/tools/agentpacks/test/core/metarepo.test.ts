import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import {
  discoverMetarepoEntries,
  getMetarepoBaseDirs,
} from '../../src/core/metarepo.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'metarepo-test'
);

beforeAll(() => {
  mkdirSync(TEST_DIR, { recursive: true });

  // Sub-repo A: has agentpacks config
  const repoA = join(TEST_DIR, 'repo-a');
  mkdirSync(repoA, { recursive: true });
  writeFileSync(
    join(repoA, 'agentpacks.jsonc'),
    JSON.stringify({ packs: ['./packs/default'] })
  );
  writeFileSync(
    join(repoA, 'package.json'),
    JSON.stringify({ name: 'repo-a' })
  );

  // Sub-repo B: has package.json but no agentpacks
  const repoB = join(TEST_DIR, 'repo-b');
  mkdirSync(repoB, { recursive: true });
  writeFileSync(
    join(repoB, 'package.json'),
    JSON.stringify({ name: 'repo-b' })
  );

  // Nested sub-repo: packages/sub-c with agentpacks
  const repoC = join(TEST_DIR, 'packages', 'sub-c');
  mkdirSync(repoC, { recursive: true });
  writeFileSync(
    join(repoC, 'agentpacks.jsonc'),
    JSON.stringify({ packs: ['./packs/local'] })
  );
  writeFileSync(join(repoC, 'package.json'), JSON.stringify({ name: 'sub-c' }));

  // node_modules should be skipped
  const nm = join(TEST_DIR, 'node_modules', 'some-pkg');
  mkdirSync(nm, { recursive: true });
  writeFileSync(join(nm, 'package.json'), JSON.stringify({ name: 'some-pkg' }));
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('discoverMetarepoEntries', () => {
  test('discovers sub-repos', () => {
    const entries = discoverMetarepoEntries(TEST_DIR);
    expect(entries.length).toBeGreaterThanOrEqual(3);
  });

  test('identifies repos with agentpacks config', () => {
    const entries = discoverMetarepoEntries(TEST_DIR);
    const repoA = entries.find((e) => e.path === 'repo-a')!;
    expect(repoA).toBeDefined();
    expect(repoA.hasConfig).toBe(true);
  });

  test('identifies repos without agentpacks config', () => {
    const entries = discoverMetarepoEntries(TEST_DIR);
    const repoB = entries.find((e) => e.path === 'repo-b')!;
    expect(repoB).toBeDefined();
    expect(repoB.hasConfig).toBe(false);
  });

  test('discovers nested sub-repos', () => {
    const entries = discoverMetarepoEntries(TEST_DIR);
    const subC = entries.find((e) => e.path.includes('sub-c'));
    expect(subC).toBeDefined();
    expect(subC!.hasConfig).toBe(true);
  });

  test('skips node_modules', () => {
    const entries = discoverMetarepoEntries(TEST_DIR);
    const nmEntries = entries.filter((e) => e.path.includes('node_modules'));
    expect(nmEntries).toHaveLength(0);
  });

  test('loads config for repos that have it', () => {
    const entries = discoverMetarepoEntries(TEST_DIR);
    const repoA = entries.find((e) => e.path === 'repo-a')!;
    expect(repoA.config).not.toBeNull();
  });
});

describe('getMetarepoBaseDirs', () => {
  test('returns paths of repos with configs', () => {
    const dirs = getMetarepoBaseDirs(TEST_DIR);
    expect(dirs).toContain('repo-a');
    expect(dirs.some((d) => d.includes('sub-c'))).toBe(true);
  });

  test('excludes repos without config', () => {
    const dirs = getMetarepoBaseDirs(TEST_DIR);
    expect(dirs).not.toContain('repo-b');
  });
});
