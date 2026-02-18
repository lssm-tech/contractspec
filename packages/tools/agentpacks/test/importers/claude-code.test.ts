import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { importFromClaudeCode } from '../../src/importers/claude-code.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'claude-import-test'
);

beforeAll(() => {
  mkdirSync(TEST_DIR, { recursive: true });

  // CLAUDE.md root rules
  writeFileSync(
    join(TEST_DIR, 'CLAUDE.md'),
    '# Root Rules\nAlways follow these rules.\n'
  );

  // .claude/rules/
  mkdirSync(join(TEST_DIR, '.claude', 'rules'), { recursive: true });
  writeFileSync(
    join(TEST_DIR, '.claude', 'rules', 'security.md'),
    'Security guidelines.\n'
  );

  // .claude/settings.json with MCP
  writeFileSync(
    join(TEST_DIR, '.claude', 'settings.json'),
    JSON.stringify({
      mcpServers: { github: { command: 'gh', args: ['mcp'] } },
    })
  );
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('importFromClaudeCode', () => {
  test('imports CLAUDE.md as root rule', () => {
    const result = importFromClaudeCode(TEST_DIR);
    const rootRule = result.filesImported.find((f) =>
      f.includes('claude-root.md')
    );
    expect(rootRule).toBeDefined();
  });

  test('imports .claude/rules/*.md', () => {
    const result = importFromClaudeCode(TEST_DIR);
    const ruleFiles = result.filesImported.filter((f) => f.includes('/rules/'));
    // claude-root.md + security.md
    expect(ruleFiles.length).toBeGreaterThanOrEqual(2);
  });

  test('imports MCP from settings.json', () => {
    const result = importFromClaudeCode(TEST_DIR);
    const mcpFiles = result.filesImported.filter((f) => f.includes('mcp.json'));
    expect(mcpFiles).toHaveLength(1);
  });

  test('generates pack.json', () => {
    const result = importFromClaudeCode(TEST_DIR);
    const packJson = result.filesImported.find((f) => f.endsWith('pack.json'));
    expect(packJson).toBeDefined();
  });

  test('warns when no Claude config found', () => {
    const result = importFromClaudeCode('/nonexistent');
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
