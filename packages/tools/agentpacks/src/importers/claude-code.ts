/**
 * Import from existing Claude Code configuration into an agentpacks pack.
 * Reads CLAUDE.md (root rules), .claude/rules/*.md, .claude/settings.json (MCP)
 */
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve, join, basename } from 'path';
import { ensureDir, listFiles } from '../utils/filesystem.js';
import type { ImportResult } from './rulesync.js';

/**
 * Import from existing Claude Code configuration.
 */
export function importFromClaudeCode(
  projectRoot: string,
  outputPackDir?: string
): ImportResult {
  const warnings: string[] = [];
  const filesImported: string[] = [];
  const claudeDir = resolve(projectRoot, '.claude');

  const hasClaudeMd = existsSync(resolve(projectRoot, 'CLAUDE.md'));
  const hasClaudeDir = existsSync(claudeDir);

  if (!hasClaudeMd && !hasClaudeDir) {
    return {
      packDir: '',
      filesImported: [],
      warnings: ['No CLAUDE.md or .claude/ directory found.'],
      configGenerated: false,
    };
  }

  const packDir =
    outputPackDir ?? resolve(projectRoot, 'packs', 'claude-import');
  ensureDir(packDir);
  const rulesDir = resolve(packDir, 'rules');
  ensureDir(rulesDir);

  // Import root CLAUDE.md as a root rule
  if (hasClaudeMd) {
    const raw = readFileSync(resolve(projectRoot, 'CLAUDE.md'), 'utf-8');
    const ruleContent = [
      '---',
      'root: true',
      'description: "Root Claude Code rules"',
      '---',
      '',
      raw,
    ].join('\n');
    const dest = join(rulesDir, 'claude-root.md');
    writeFileSync(dest, ruleContent);
    filesImported.push(dest);
  }

  // Import .claude/rules/*.md
  if (hasClaudeDir) {
    const claudeRulesDir = resolve(claudeDir, 'rules');
    if (existsSync(claudeRulesDir)) {
      const files = listFiles(claudeRulesDir, { extension: '.md' });
      for (const file of files) {
        const dest = join(rulesDir, basename(file));
        copyFileSync(file, dest);
        filesImported.push(dest);
      }
    }

    // Import .claude/settings.json for MCP servers
    const settingsPath = resolve(claudeDir, 'settings.json');
    if (existsSync(settingsPath)) {
      try {
        const raw = readFileSync(settingsPath, 'utf-8');
        const settings = JSON.parse(raw) as Record<string, unknown>;
        const mcpServers = settings.mcpServers ?? settings.mcp_servers;

        if (mcpServers && typeof mcpServers === 'object') {
          const mcpConfig = { servers: mcpServers };
          const dest = join(packDir, 'mcp.json');
          writeFileSync(dest, JSON.stringify(mcpConfig, null, 2) + '\n');
          filesImported.push(dest);
        }
      } catch {
        warnings.push('Failed to parse .claude/settings.json');
      }
    }
  }

  // Generate pack.json
  const packJson = {
    name: 'claude-import',
    version: '1.0.0',
    description: 'Imported from Claude Code',
    tags: ['imported', 'claude-code'],
    dependencies: [],
    conflicts: [],
    targets: '*',
    features: '*',
  };
  const packJsonPath = join(packDir, 'pack.json');
  writeFileSync(packJsonPath, JSON.stringify(packJson, null, 2) + '\n');
  filesImported.push(packJsonPath);

  return { packDir, filesImported, warnings, configGenerated: false };
}
