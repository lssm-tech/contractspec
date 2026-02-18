import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import {
  parseRules,
  ruleMatchesTarget,
  getRootRules,
  getDetailRules,
} from '../../src/features/rules.js';

const TEST_DIR = join(import.meta.dirname, '..', '__fixtures__', 'rules-test');

beforeAll(() => {
  mkdirSync(TEST_DIR, { recursive: true });

  writeFileSync(
    join(TEST_DIR, 'overview.md'),
    `---
root: true
targets: ["*"]
description: "Project overview"
globs: ["**/*"]
---

# Overview

This is the project overview.
`
  );

  writeFileSync(
    join(TEST_DIR, 'security.md'),
    `---
root: false
targets: ["opencode", "cursor"]
description: "Security rules"
---

# Security

Follow security best practices.
`
  );

  writeFileSync(
    join(TEST_DIR, 'internal.md'),
    `---
targets: ["claudecode"]
description: "Claude-only rules"
---

# Internal

These are Claude-specific rules.
`
  );
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('parseRules', () => {
  test('parses all rules from directory', () => {
    const rules = parseRules(TEST_DIR, 'test-pack');
    expect(rules).toHaveLength(3);
    expect(rules.map((r) => r.name).sort()).toEqual([
      'internal',
      'overview',
      'security',
    ]);
  });

  test('parses frontmatter correctly', () => {
    const rules = parseRules(TEST_DIR, 'test-pack');
    const overview = rules.find((r) => r.name === 'overview');
    expect(overview).toBeDefined();
    expect(overview!.meta.root).toBe(true);
    expect(overview!.meta.description).toBe('Project overview');
    expect(overview!.packName).toBe('test-pack');
  });

  test('parses content correctly', () => {
    const rules = parseRules(TEST_DIR, 'test-pack');
    const overview = rules.find((r) => r.name === 'overview');
    expect(overview!.content).toContain('# Overview');
    expect(overview!.content).toContain('project overview');
  });
});

describe('ruleMatchesTarget', () => {
  test('wildcard matches any target', () => {
    const rules = parseRules(TEST_DIR, 'test-pack');
    const overview = rules.find((r) => r.name === 'overview')!;
    expect(ruleMatchesTarget(overview, 'opencode')).toBe(true);
    expect(ruleMatchesTarget(overview, 'cursor')).toBe(true);
  });

  test('specific targets match correctly', () => {
    const rules = parseRules(TEST_DIR, 'test-pack');
    const security = rules.find((r) => r.name === 'security')!;
    expect(ruleMatchesTarget(security, 'opencode')).toBe(true);
    expect(ruleMatchesTarget(security, 'cursor')).toBe(true);
    expect(ruleMatchesTarget(security, 'claudecode')).toBe(false);
  });

  test('claude-only rule only matches claudecode', () => {
    const rules = parseRules(TEST_DIR, 'test-pack');
    const internal = rules.find((r) => r.name === 'internal')!;
    expect(ruleMatchesTarget(internal, 'claudecode')).toBe(true);
    expect(ruleMatchesTarget(internal, 'opencode')).toBe(false);
  });
});

describe('getRootRules / getDetailRules', () => {
  test('separates root and detail rules', () => {
    const rules = parseRules(TEST_DIR, 'test-pack');
    const root = getRootRules(rules);
    const detail = getDetailRules(rules);
    expect(root).toHaveLength(1);
    expect(root[0]!.name).toBe('overview');
    expect(detail).toHaveLength(2);
  });
});
