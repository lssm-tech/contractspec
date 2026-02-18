import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { importFromCursor } from '../../src/importers/cursor.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'cursor-import-test'
);

beforeAll(() => {
  const cursorDir = join(TEST_DIR, '.cursor');

  // Rules (.mdc format)
  mkdirSync(join(cursorDir, 'rules'), { recursive: true });
  writeFileSync(
    join(cursorDir, 'rules', 'quality.mdc'),
    '---\ndescription: Code quality\nalwaysApply: true\n---\n\nFollow quality standards.\n'
  );
  writeFileSync(join(cursorDir, 'rules', 'plain.md'), 'Plain markdown rule.\n');

  // Agents
  mkdirSync(join(cursorDir, 'agents'), { recursive: true });
  writeFileSync(
    join(cursorDir, 'agents', 'reviewer.md'),
    '---\nname: reviewer\n---\n\nReview code.\n'
  );

  // Commands
  mkdirSync(join(cursorDir, 'commands'), { recursive: true });
  writeFileSync(join(cursorDir, 'commands', 'test.md'), 'Run tests.\n');

  // MCP
  writeFileSync(
    join(cursorDir, 'mcp.json'),
    JSON.stringify({ mcpServers: { fs: { command: 'cat' } } })
  );

  // Ignore
  writeFileSync(join(TEST_DIR, '.cursorignore'), 'dist\nnode_modules\n');
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('importFromCursor', () => {
  test('imports all features', () => {
    const result = importFromCursor(TEST_DIR);
    expect(result.filesImported.length).toBeGreaterThan(0);
  });

  test('imports .mdc rules converted to .md', () => {
    const result = importFromCursor(TEST_DIR);
    const ruleFiles = result.filesImported.filter((f) => f.includes('/rules/'));
    // Should have quality.md (converted from .mdc) and plain.md
    expect(ruleFiles.length).toBeGreaterThanOrEqual(2);
  });

  test('imports agents', () => {
    const result = importFromCursor(TEST_DIR);
    const agentFiles = result.filesImported.filter((f) =>
      f.includes('/agents/')
    );
    expect(agentFiles).toHaveLength(1);
  });

  test('imports commands', () => {
    const result = importFromCursor(TEST_DIR);
    const cmdFiles = result.filesImported.filter((f) =>
      f.includes('/commands/')
    );
    expect(cmdFiles).toHaveLength(1);
  });

  test('imports MCP', () => {
    const result = importFromCursor(TEST_DIR);
    const mcpFiles = result.filesImported.filter((f) => f.includes('mcp.json'));
    expect(mcpFiles).toHaveLength(1);
  });

  test('imports cursorignore', () => {
    const result = importFromCursor(TEST_DIR);
    const ignoreFiles = result.filesImported.filter((f) =>
      f.endsWith('ignore')
    );
    expect(ignoreFiles).toHaveLength(1);
  });

  test('generates pack.json', () => {
    const result = importFromCursor(TEST_DIR);
    const packJson = result.filesImported.find((f) => f.endsWith('pack.json'));
    expect(packJson).toBeDefined();
  });

  test('warns when no .cursor/ directory', () => {
    const result = importFromCursor('/nonexistent');
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
