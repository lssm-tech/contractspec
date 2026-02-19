import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { runPackDisable, runPackEnable } from '../../src/cli/pack/enable.js';

const TEST_DIR = join(import.meta.dirname, '..', '__fixtures__', 'enable-test');
const CONFIG_PATH = join(TEST_DIR, 'agentpacks.jsonc');

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
  writeFileSync(
    CONFIG_PATH,
    [
      '{',
      '  "packs": ["./packs/default"],',
      '  "disabled": [],',
      '  "targets": "*"',
      '}',
    ].join('\n')
  );
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('runPackDisable', () => {
  test('adds pack to disabled array', () => {
    runPackDisable(TEST_DIR, 'my-pack');
    const content = readFileSync(CONFIG_PATH, 'utf-8');
    expect(content).toContain('"my-pack"');
    expect(content).toContain('disabled');
  });

  test('does not duplicate if already disabled', () => {
    runPackDisable(TEST_DIR, 'my-pack');
    runPackDisable(TEST_DIR, 'my-pack');
    const content = readFileSync(CONFIG_PATH, 'utf-8');
    const matches = content.match(/"my-pack"/g);
    expect(matches).toHaveLength(1);
  });
});

describe('runPackEnable', () => {
  test('removes pack from disabled array', () => {
    // First disable, then enable
    runPackDisable(TEST_DIR, 'my-pack');
    let content = readFileSync(CONFIG_PATH, 'utf-8');
    expect(content).toContain('"my-pack"');

    runPackEnable(TEST_DIR, 'my-pack');
    content = readFileSync(CONFIG_PATH, 'utf-8');
    // The disabled array should no longer contain my-pack
    expect(content).toContain('"disabled": []');
  });

  test('does nothing if pack not in disabled list', () => {
    const before = readFileSync(CONFIG_PATH, 'utf-8');
    runPackEnable(TEST_DIR, 'nonexistent-pack');
    const after = readFileSync(CONFIG_PATH, 'utf-8');
    expect(after).toBe(before);
  });
});
