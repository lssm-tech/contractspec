import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { existsSync, readFileSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { exportCursorPlugin } from '../../src/exporters/cursor-plugin.js';
import { PackLoader } from '../../src/core/pack-loader.js';
import { WorkspaceConfigSchema } from '../../src/core/config.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'cursor-export-test'
);
const OUTPUT_DIR = join(TEST_DIR, 'output');

beforeAll(() => {
  // Create a pack to export
  const packDir = join(TEST_DIR, 'packs', 'export-pack');
  mkdirSync(join(packDir, 'rules'), { recursive: true });
  mkdirSync(join(packDir, 'commands'), { recursive: true });
  mkdirSync(join(packDir, 'agents'), { recursive: true });
  mkdirSync(join(packDir, 'skills', 'release'), { recursive: true });
  mkdirSync(join(packDir, 'hooks'), { recursive: true });

  writeFileSync(
    join(packDir, 'pack.json'),
    JSON.stringify({
      name: 'export-pack',
      version: '1.0.0',
      description: 'Test',
      author: { name: 'Agentpacks Team', email: 'team@example.com' },
      homepage: 'https://example.com/plugin',
      repository: 'https://github.com/example/plugin',
      license: 'MIT',
      logo: 'assets/logo.svg',
      tags: ['cursor', 'plugin'],
    })
  );
  writeFileSync(
    join(packDir, 'rules', 'code-quality.md'),
    '---\ndescription: Code quality rules\nroot: true\n---\n\nFollow quality standards.\n'
  );
  writeFileSync(
    join(packDir, 'commands', 'lint.md'),
    '---\ndescription: Run lint checks\n---\n\nRun lint checks.\n'
  );
  writeFileSync(
    join(packDir, 'agents', 'reviewer.md'),
    '---\nname: reviewer\ndescription: Review code\n---\n\nReview the code.\n'
  );
  writeFileSync(
    join(packDir, 'skills', 'release', 'SKILL.md'),
    '---\nname: release\ndescription: Release flow\n---\n\nRun release workflow.\n'
  );
  writeFileSync(
    join(packDir, 'hooks', 'hooks.json'),
    JSON.stringify(
      {
        version: 1,
        hooks: {
          afterFileEdit: [{ command: 'bun run lint' }],
        },
        cursor: {
          hooks: {
            beforeShellExecution: [
              {
                command: './scripts/validate.sh',
                matcher: 'rm|curl',
              },
            ],
          },
        },
      },
      null,
      2
    ) + '\n'
  );
  writeFileSync(
    join(packDir, 'mcp.json'),
    JSON.stringify(
      {
        mcpServers: {
          docs: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-filesystem'],
          },
        },
      },
      null,
      2
    ) + '\n'
  );
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('exportCursorPlugin', () => {
  function exportPack() {
    const config = WorkspaceConfigSchema.parse({
      packs: ['./packs/export-pack'],
    });
    const loader = new PackLoader(TEST_DIR, config);
    const { packs } = loader.loadAll();
    expect(packs).toHaveLength(1);
    return exportCursorPlugin(packs[0]!, OUTPUT_DIR);
  }

  test('exports a pack as Cursor plugin structure', () => {
    const result = exportPack();
    expect(result.filesWritten.length).toBeGreaterThan(0);
    expect(result.outputDir).toContain('export-pack');
    expect(
      existsSync(join(result.outputDir, '.cursor-plugin', 'plugin.json'))
    ).toBe(true);
  });

  test('creates .cursor-plugin/plugin.json', () => {
    const result = exportPack();

    const manifestPath = join(
      result.outputDir,
      '.cursor-plugin',
      'plugin.json'
    );
    expect(existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    expect(manifest.name).toBe('export-pack');
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.author).toEqual({
      name: 'Agentpacks Team',
      email: 'team@example.com',
    });
    expect(manifest.homepage).toBe('https://example.com/plugin');
    expect(manifest.repository).toBe('https://github.com/example/plugin');
    expect(manifest.license).toBe('MIT');
    expect(manifest.logo).toBe('assets/logo.svg');
    expect(manifest.keywords).toEqual(['cursor', 'plugin']);
    expect(manifest.rules).toBe('rules');
    expect(manifest.agents).toBe('agents');
    expect(manifest.skills).toBe('skills');
    expect(manifest.commands).toBe('commands');
    expect(manifest.hooks).toBe('hooks/hooks.json');
    expect(manifest.mcpServers).toBe('.mcp.json');
  });

  test('exports rules as .mdc files', () => {
    const result = exportPack();

    const ruleFile = join(result.outputDir, 'rules', 'code-quality.mdc');
    expect(existsSync(ruleFile)).toBe(true);
  });

  test('exports commands with metadata frontmatter', () => {
    const result = exportPack();

    const cmdFile = join(result.outputDir, 'commands', 'lint.md');
    expect(existsSync(cmdFile)).toBe(true);
    const content = readFileSync(cmdFile, 'utf-8');
    expect(content).toContain('name: lint');
    expect(content).toContain('description: Run lint checks');
  });

  test('exports hooks to hooks/hooks.json', () => {
    const result = exportPack();

    const hooksFile = join(result.outputDir, 'hooks', 'hooks.json');
    expect(existsSync(hooksFile)).toBe(true);
    const hooks = JSON.parse(readFileSync(hooksFile, 'utf-8'));
    expect(hooks.version).toBe(1);
    expect(hooks.hooks.afterFileEdit).toHaveLength(1);
    expect(hooks.hooks.beforeShellExecution).toHaveLength(1);
  });

  test('exports agents, skills, and MCP', () => {
    const result = exportPack();

    const agentFile = join(result.outputDir, 'agents', 'reviewer.md');
    const skillFile = join(result.outputDir, 'skills', 'release', 'SKILL.md');
    const mcpFile = join(result.outputDir, '.mcp.json');
    expect(existsSync(agentFile)).toBe(true);
    expect(existsSync(skillFile)).toBe(true);
    expect(existsSync(mcpFile)).toBe(true);

    const mcp = JSON.parse(readFileSync(mcpFile, 'utf-8'));
    expect(mcp.mcpServers.docs).toBeDefined();
  });
});
