import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { parseHooks, resolveHooksForTarget } from '../../src/features/hooks.js';

const TEST_DIR = join(import.meta.dirname, '..', '__fixtures__', 'hooks-test');

beforeAll(() => {
  const hooksDir = join(TEST_DIR, 'hooks');
  mkdirSync(hooksDir, { recursive: true });

  writeFileSync(
    join(hooksDir, 'hooks.json'),
    JSON.stringify({
      version: 1,
      hooks: {
        sessionStart: [{ type: 'command', command: 'echo start' }],
        stop: [{ type: 'command', command: 'echo stop' }],
      },
      cursor: {
        hooks: {
          sessionStart: [{ type: 'command', command: 'echo cursor-start' }],
        },
      },
      opencode: {
        hooks: {
          preToolUse: [{ type: 'command', command: 'echo pre-tool' }],
        },
      },
    })
  );
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('parseHooks', () => {
  test('parses hooks from hooks/hooks.json', () => {
    const hooks = parseHooks(TEST_DIR, 'test-pack');
    expect(hooks).not.toBeNull();
    expect(hooks!.packName).toBe('test-pack');
  });

  test('parses shared hooks', () => {
    const hooks = parseHooks(TEST_DIR, 'test-pack')!;
    expect(hooks.shared.sessionStart).toHaveLength(1);
    expect(hooks.shared.stop).toHaveLength(1);
  });

  test('parses target overrides', () => {
    const hooks = parseHooks(TEST_DIR, 'test-pack')!;
    expect(hooks.targetOverrides.cursor).toBeDefined();
    expect(hooks.targetOverrides.opencode).toBeDefined();
  });

  test('returns null when no hooks file', () => {
    const hooks = parseHooks('/nonexistent/path', 'test-pack');
    expect(hooks).toBeNull();
  });
});

describe('resolveHooksForTarget', () => {
  test('merges shared with target-specific hooks', () => {
    const hooks = parseHooks(TEST_DIR, 'test-pack')!;
    const cursorHooks = resolveHooksForTarget(hooks, 'cursor');
    // Should have shared sessionStart + cursor sessionStart
    expect(cursorHooks.sessionStart).toBeDefined();
    expect(cursorHooks.stop).toBeDefined();
  });

  test('returns only shared hooks for unknown target', () => {
    const hooks = parseHooks(TEST_DIR, 'test-pack')!;
    const unknownHooks = resolveHooksForTarget(hooks, 'copilot');
    expect(unknownHooks.sessionStart).toHaveLength(1);
    expect(unknownHooks.stop).toHaveLength(1);
  });

  test('includes target-specific overrides', () => {
    const hooks = parseHooks(TEST_DIR, 'test-pack')!;
    const ocHooks = resolveHooksForTarget(hooks, 'opencode');
    expect(ocHooks.preToolUse).toBeDefined();
    expect(ocHooks.preToolUse).toHaveLength(1);
  });
});
