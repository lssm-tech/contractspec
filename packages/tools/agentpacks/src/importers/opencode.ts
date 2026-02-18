/**
 * Import from existing OpenCode configuration into an agentpacks pack.
 * Reads .opencode/rules/, .opencode/commands/, .opencode/agents/,
 * .opencode/skill/, .opencode/plugins/, AGENTS.md, opencode.json (MCP)
 */
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve, join, basename } from 'path';
import { ensureDir, listFiles, listDirs } from '../utils/filesystem.js';
import type { ImportResult } from './rulesync.js';

/**
 * Import from existing OpenCode configuration.
 */
export function importFromOpenCode(
  projectRoot: string,
  outputPackDir?: string
): ImportResult {
  const warnings: string[] = [];
  const filesImported: string[] = [];
  const ocDir = resolve(projectRoot, '.opencode');

  if (!existsSync(ocDir)) {
    return {
      packDir: '',
      filesImported: [],
      warnings: ['No .opencode/ directory found.'],
      configGenerated: false,
    };
  }

  const packDir =
    outputPackDir ?? resolve(projectRoot, 'packs', 'opencode-import');
  ensureDir(packDir);

  // Import rules
  importDirMd(
    resolve(ocDir, 'rules'),
    resolve(packDir, 'rules'),
    filesImported
  );

  // Import commands
  importDirMd(
    resolve(ocDir, 'commands'),
    resolve(packDir, 'commands'),
    filesImported
  );

  // Import agents
  importDirMd(
    resolve(ocDir, 'agents'),
    resolve(packDir, 'agents'),
    filesImported
  );

  // Import skills (nested: .opencode/skill/<name>/SKILL.md)
  const skillDir = resolve(ocDir, 'skill');
  if (existsSync(skillDir)) {
    const outSkillDir = resolve(packDir, 'skills');
    ensureDir(outSkillDir);
    const dirs = listDirs(skillDir);
    for (const dir of dirs) {
      const name = basename(dir);
      if (name.startsWith('.')) continue;
      const skillMd = join(dir, 'SKILL.md');
      if (existsSync(skillMd)) {
        const outDir = join(outSkillDir, name);
        ensureDir(outDir);
        copyFileSync(skillMd, join(outDir, 'SKILL.md'));
        filesImported.push(join(outDir, 'SKILL.md'));
      }
    }
  }

  // Import plugins (TS/JS files)
  const pluginsDir = resolve(ocDir, 'plugins');
  if (existsSync(pluginsDir)) {
    const outPluginsDir = resolve(packDir, 'plugins');
    ensureDir(outPluginsDir);
    const files = listFiles(pluginsDir);
    for (const file of files) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const dest = join(outPluginsDir, basename(file));
        copyFileSync(file, dest);
        filesImported.push(dest);
      }
    }
  }

  // Import AGENTS.md as a root rule
  const agentsMd = resolve(projectRoot, 'AGENTS.md');
  if (existsSync(agentsMd)) {
    const outRulesDir = resolve(packDir, 'rules');
    ensureDir(outRulesDir);
    const raw = readFileSync(agentsMd, 'utf-8');
    const ruleContent = [
      '---',
      'root: true',
      'description: "AGENTS.md root rules"',
      '---',
      '',
      raw,
    ].join('\n');
    const dest = join(outRulesDir, 'agents-md-root.md');
    writeFileSync(dest, ruleContent);
    filesImported.push(dest);
  }

  // Import MCP from opencode.json
  const ocJson = resolve(projectRoot, 'opencode.json');
  if (existsSync(ocJson)) {
    try {
      const raw = readFileSync(ocJson, 'utf-8');
      const config = JSON.parse(raw) as Record<string, unknown>;
      const mcpObj = config.mcp as Record<string, unknown> | undefined;
      if (mcpObj) {
        const dest = join(packDir, 'mcp.json');
        writeFileSync(
          dest,
          JSON.stringify({ servers: mcpObj }, null, 2) + '\n'
        );
        filesImported.push(dest);
      }
    } catch {
      warnings.push('Failed to parse opencode.json');
    }
  }

  // Import ignore
  const ocIgnore = resolve(projectRoot, '.opencodeignore');
  if (existsSync(ocIgnore)) {
    copyFileSync(ocIgnore, join(packDir, 'ignore'));
    filesImported.push(join(packDir, 'ignore'));
  }

  // Generate pack.json
  const packJson = {
    name: 'opencode-import',
    version: '1.0.0',
    description: 'Imported from OpenCode',
    tags: ['imported', 'opencode'],
    dependencies: [],
    conflicts: [],
    targets: '*',
    features: '*',
  };
  const dest = join(packDir, 'pack.json');
  writeFileSync(dest, JSON.stringify(packJson, null, 2) + '\n');
  filesImported.push(dest);

  return { packDir, filesImported, warnings, configGenerated: false };
}

/**
 * Import all .md files from a source directory.
 */
function importDirMd(
  srcDir: string,
  outDir: string,
  filesImported: string[]
): void {
  if (!existsSync(srcDir)) return;
  ensureDir(outDir);
  const files = listFiles(srcDir, { extension: '.md' });
  for (const file of files) {
    const dest = join(outDir, basename(file));
    copyFileSync(file, dest);
    filesImported.push(dest);
  }
}
