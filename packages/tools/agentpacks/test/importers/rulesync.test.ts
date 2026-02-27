import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { importFromRulesync } from '../../src/importers/rulesync.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'rulesync-import-test'
);

beforeAll(() => {
  const rsDir = join(TEST_DIR, '.rulesync');

  // Rules
  mkdirSync(join(rsDir, 'rules'), { recursive: true });
  writeFileSync(
    join(rsDir, 'rules', 'overview.md'),
    '# Overview\nMain rules.\n'
  );
  writeFileSync(
    join(rsDir, 'rules', 'security.md'),
    '# Security\nSecurity rules.\n'
  );

  // Commands
  mkdirSync(join(rsDir, 'commands'), { recursive: true });
  writeFileSync(join(rsDir, 'commands', 'lint.md'), 'Run lint.\n');

  // Subagents → agents
  mkdirSync(join(rsDir, 'subagents'), { recursive: true });
  writeFileSync(join(rsDir, 'subagents', 'reviewer.md'), 'Review code.\n');

  // Skills
  mkdirSync(join(rsDir, 'skills', 'migrate'), { recursive: true });
  writeFileSync(
    join(rsDir, 'skills', 'migrate', 'SKILL.md'),
    'Migration skill.\n'
  );

  // MCP
  writeFileSync(
    join(rsDir, 'mcp.json'),
    JSON.stringify({ mcpServers: { test: { command: 'echo' } } })
  );

  // Ignore
  writeFileSync(join(rsDir, '.aiignore'), 'node_modules\n.env\n');
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('importFromRulesync', () => {
  test('imports all features from .rulesync/', () => {
    const result = importFromRulesync(TEST_DIR);
    expect(result.filesImported.length).toBeGreaterThan(0);
  });

  test('imports rules', () => {
    const result = importFromRulesync(TEST_DIR);
    const ruleFiles = result.filesImported.filter((f) => f.includes('/rules/'));
    expect(ruleFiles).toHaveLength(2);
  });

  test('imports commands', () => {
    const result = importFromRulesync(TEST_DIR);
    const cmdFiles = result.filesImported.filter((f) =>
      f.includes('/commands/')
    );
    expect(cmdFiles).toHaveLength(1);
  });

  test('imports subagents as agents', () => {
    const result = importFromRulesync(TEST_DIR);
    const agentFiles = result.filesImported.filter((f) =>
      f.includes('/agents/')
    );
    expect(agentFiles).toHaveLength(1);
  });

  test('imports skills', () => {
    const result = importFromRulesync(TEST_DIR);
    const skillFiles = result.filesImported.filter((f) =>
      f.includes('/skills/')
    );
    expect(skillFiles).toHaveLength(1);
  });

  test('normalizes imported skills to AgentSkills frontmatter', () => {
    const result = importFromRulesync(TEST_DIR);
    const skillFile = result.filesImported.find((f) =>
      f.includes('/skills/migrate/SKILL.md')
    );
    expect(skillFile).toBeDefined();

    const content = readFileSync(skillFile!, 'utf-8');
    expect(content).toContain('name: migrate');
    expect(content).toContain('Imported skill: migrate');
  });

  test('imports MCP config', () => {
    const result = importFromRulesync(TEST_DIR);
    const mcpFiles = result.filesImported.filter((f) => f.includes('mcp.json'));
    expect(mcpFiles).toHaveLength(1);
  });

  test('imports ignore patterns', () => {
    const result = importFromRulesync(TEST_DIR);
    const ignoreFiles = result.filesImported.filter((f) =>
      f.endsWith('ignore')
    );
    expect(ignoreFiles).toHaveLength(1);
  });

  test('generates pack.json', () => {
    const result = importFromRulesync(TEST_DIR);
    const packJson = result.filesImported.find((f) => f.endsWith('pack.json'));
    expect(packJson).toBeDefined();
    expect(existsSync(packJson!)).toBe(true);
  });

  test('writes to custom output directory', () => {
    const customDir = join(TEST_DIR, 'custom-output');
    const result = importFromRulesync(TEST_DIR, customDir);
    expect(result.packDir).toBe(customDir);
    expect(result.filesImported.length).toBeGreaterThan(0);
  });

  test('warns when no .rulesync/ directory', () => {
    const result = importFromRulesync('/nonexistent/path');
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.filesImported).toHaveLength(0);
  });
});
