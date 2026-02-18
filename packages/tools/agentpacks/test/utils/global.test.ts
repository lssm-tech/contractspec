import { describe, expect, test } from 'bun:test';
import {
  globalConfigDir,
  globalConfigFile,
  globalTargetDir,
} from '../../src/utils/global.js';
import { homedir } from 'os';

describe('globalConfigDir', () => {
  test('returns a path under home directory', () => {
    const dir = globalConfigDir();
    expect(dir).toContain(homedir());
    expect(dir).toContain('.agentpacks');
  });
});

describe('globalConfigFile', () => {
  test('returns path ending with agentpacks.jsonc', () => {
    const file = globalConfigFile();
    expect(file).toContain('agentpacks.jsonc');
  });
});

describe('globalTargetDir', () => {
  test('returns opencode config dir', () => {
    const dir = globalTargetDir('opencode');
    expect(dir).toContain('opencode');
  });

  test('returns cursor config dir', () => {
    const dir = globalTargetDir('cursor');
    expect(dir).toContain('.cursor');
  });

  test('returns claudecode config dir', () => {
    const dir = globalTargetDir('claudecode');
    expect(dir).toContain('.claude');
  });

  test('returns fallback for unknown target', () => {
    const dir = globalTargetDir('unknown-tool');
    expect(dir).toContain('unknown-tool');
  });

  test('respects platform parameter', () => {
    const linuxDir = globalTargetDir('opencode', 'linux');
    expect(linuxDir).toContain('.config');

    const darwinDir = globalTargetDir('opencode', 'darwin');
    expect(darwinDir).toContain('Application Support');
  });
});
