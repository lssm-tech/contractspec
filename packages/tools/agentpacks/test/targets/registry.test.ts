import { describe, expect, test } from 'bun:test';
import {
  getTarget,
  getAllTargets,
  getTargets,
  listTargetIds,
} from '../../src/targets/registry.js';

describe('Target Registry', () => {
  test('getAllTargets returns all registered targets', () => {
    const targets = getAllTargets();
    expect(targets.length).toBeGreaterThanOrEqual(7);
  });

  test('getTarget returns correct target by ID', () => {
    const opencode = getTarget('opencode');
    expect(opencode).toBeDefined();
    expect(opencode!.name).toBe('OpenCode');
    expect(opencode!.id).toBe('opencode');

    const cursor = getTarget('cursor');
    expect(cursor).toBeDefined();
    expect(cursor!.name).toBe('Cursor');
  });

  test('getTarget returns undefined for unknown ID', () => {
    expect(getTarget('nonexistent')).toBeUndefined();
  });

  test('getTargets returns targets in order', () => {
    const targets = getTargets(['cursor', 'opencode']);
    expect(targets).toHaveLength(2);
    expect(targets[0]!.id).toBe('cursor');
    expect(targets[1]!.id).toBe('opencode');
  });

  test('listTargetIds returns all IDs', () => {
    const ids = listTargetIds();
    expect(ids).toContain('opencode');
    expect(ids).toContain('cursor');
    expect(ids).toContain('claudecode');
    expect(ids).toContain('codexcli');
    expect(ids).toContain('geminicli');
    expect(ids).toContain('copilot');
    expect(ids).toContain('agentsmd');
  });

  test('each target has supported features', () => {
    for (const target of getAllTargets()) {
      expect(target.supportedFeatures.length).toBeGreaterThan(0);
      expect(target.id).toBeTruthy();
      expect(target.name).toBeTruthy();
    }
  });
});
