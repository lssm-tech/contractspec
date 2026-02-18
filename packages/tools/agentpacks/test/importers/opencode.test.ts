import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { importFromOpenCode } from '../../src/importers/opencode.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'opencode-import-test'
);

beforeAll(() => {
  const ocDir = join(TEST_DIR, '.opencode');

  // Rules
  mkdirSync(join(ocDir, 'rules'), { recursive: true });
  writeFileSync(join(ocDir, 'rules', 'quality.md'), 'Quality rules.\n');

  // Commands
  mkdirSync(join(ocDir, 'commands'), { recursive: true });
  writeFileSync(join(ocDir, 'commands', 'lint.md'), 'Run lint.\n');

  // Agents
  mkdirSync(join(ocDir, 'agents'), { recursive: true });
  writeFileSync(join(ocDir, 'agents', 'reviewer.md'), 'Code reviewer.\n');

  // Skills
  mkdirSync(join(ocDir, 'skill', 'migrate-component'), { recursive: true });
  writeFileSync(
    join(ocDir, 'skill', 'migrate-component', 'SKILL.md'),
    'Migration skill.\n'
  );

  // Plugins
  mkdirSync(join(ocDir, 'plugins'), { recursive: true });
  writeFileSync(join(ocDir, 'plugins', 'metrics.ts'), 'export default {};');

  // AGENTS.md
  writeFileSync(join(TEST_DIR, 'AGENTS.md'), '# Agent Rules\nRoot rules.\n');

  // opencode.json with MCP
  writeFileSync(
    join(TEST_DIR, 'opencode.json'),
    JSON.stringify({ mcp: { context7: { url: 'https://example.com' } } })
  );
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('importFromOpenCode', () => {
  test('imports all features', () => {
    const result = importFromOpenCode(TEST_DIR);
    expect(result.filesImported.length).toBeGreaterThan(0);
  });

  test('imports rules', () => {
    const result = importFromOpenCode(TEST_DIR);
    const ruleFiles = result.filesImported.filter(
      (f) => f.includes('/rules/') && !f.includes('pack.json')
    );
    // quality.md + agents-md-root.md (from AGENTS.md)
    expect(ruleFiles.length).toBeGreaterThanOrEqual(2);
  });

  test('imports commands', () => {
    const result = importFromOpenCode(TEST_DIR);
    const cmdFiles = result.filesImported.filter((f) =>
      f.includes('/commands/')
    );
    expect(cmdFiles).toHaveLength(1);
  });

  test('imports agents', () => {
    const result = importFromOpenCode(TEST_DIR);
    const agentFiles = result.filesImported.filter((f) =>
      f.includes('/agents/')
    );
    expect(agentFiles).toHaveLength(1);
  });

  test('imports skills', () => {
    const result = importFromOpenCode(TEST_DIR);
    const skillFiles = result.filesImported.filter((f) =>
      f.includes('/skills/')
    );
    expect(skillFiles).toHaveLength(1);
  });

  test('imports plugins', () => {
    const result = importFromOpenCode(TEST_DIR);
    const pluginFiles = result.filesImported.filter((f) =>
      f.includes('/plugins/')
    );
    expect(pluginFiles).toHaveLength(1);
  });

  test('imports MCP from opencode.json', () => {
    const result = importFromOpenCode(TEST_DIR);
    const mcpFiles = result.filesImported.filter((f) => f.includes('mcp.json'));
    expect(mcpFiles).toHaveLength(1);
  });

  test('imports AGENTS.md as root rule', () => {
    const result = importFromOpenCode(TEST_DIR);
    const agentsMd = result.filesImported.find((f) =>
      f.includes('agents-md-root.md')
    );
    expect(agentsMd).toBeDefined();
  });

  test('generates pack.json', () => {
    const result = importFromOpenCode(TEST_DIR);
    const packJson = result.filesImported.find((f) => f.endsWith('pack.json'));
    expect(packJson).toBeDefined();
  });

  test('warns when no .opencode/ directory', () => {
    const result = importFromOpenCode('/nonexistent');
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
