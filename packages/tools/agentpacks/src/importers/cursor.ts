/**
 * Import from existing Cursor configuration into an agentpacks pack.
 * Reads .cursor/rules/, .cursor/agents/, .cursor/skills/, .cursor/commands/,
 * .cursor/mcp.json, .cursorignore
 */
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve, join, basename } from 'path';
import { ensureDir, listFiles, listDirs } from '../utils/filesystem.js';
import { parseFrontmatter } from '../utils/frontmatter.js';
import { normalizeImportedSkillMarkdown } from '../features/skills.js';
import type { ImportResult } from './rulesync.js';

/**
 * Import from an existing .cursor/ directory into an agentpacks pack.
 */
export function importFromCursor(
  projectRoot: string,
  outputPackDir?: string
): ImportResult {
  const cursorDir = resolve(projectRoot, '.cursor');
  const warnings: string[] = [];
  const filesImported: string[] = [];

  if (!existsSync(cursorDir)) {
    return {
      packDir: '',
      filesImported: [],
      warnings: ['No .cursor/ directory found.'],
      configGenerated: false,
    };
  }

  const packDir =
    outputPackDir ?? resolve(projectRoot, 'packs', 'cursor-import');
  ensureDir(packDir);

  // Import rules (.mdc files → .md with converted frontmatter)
  const rulesDir = resolve(cursorDir, 'rules');
  if (existsSync(rulesDir)) {
    const outRulesDir = resolve(packDir, 'rules');
    ensureDir(outRulesDir);
    const files = listFiles(rulesDir, { extension: '.mdc' });
    for (const file of files) {
      const raw = readFileSync(file, 'utf-8');
      const { data, content } = parseFrontmatter(raw);
      // Convert Cursor frontmatter to agentpacks format
      const meta: Record<string, unknown> = {};
      if (data.description) meta.description = data.description;
      if (data.alwaysApply) meta.root = true;
      if (data.globs) meta.globs = data.globs;
      // Preserve original as cursor-specific meta
      meta.cursor = { ...data };

      const mdContent = buildAgentpacksRule(meta, content);
      const name = basename(file, '.mdc');
      const dest = join(outRulesDir, `${name}.md`);
      writeFileSync(dest, mdContent);
      filesImported.push(dest);
    }
    // Also import .md files as-is
    const mdFiles = listFiles(rulesDir, { extension: '.md' });
    for (const file of mdFiles) {
      const dest = join(outRulesDir, basename(file));
      copyFileSync(file, dest);
      filesImported.push(dest);
    }
  }

  // Import agents
  const agentsDir = resolve(cursorDir, 'agents');
  if (existsSync(agentsDir)) {
    const outDir = resolve(packDir, 'agents');
    ensureDir(outDir);
    const files = listFiles(agentsDir, { extension: '.md' });
    for (const file of files) {
      const dest = join(outDir, basename(file));
      copyFileSync(file, dest);
      filesImported.push(dest);
    }
  }

  // Import skills
  const skillsDir = resolve(cursorDir, 'skills');
  if (existsSync(skillsDir)) {
    const outDir = resolve(packDir, 'skills');
    ensureDir(outDir);
    const dirs = listDirs(skillsDir);
    for (const dir of dirs) {
      const name = basename(dir);
      const skillMd = join(dir, 'SKILL.md');
      if (existsSync(skillMd)) {
        const outSkillDir = join(outDir, name);
        ensureDir(outSkillDir);
        const rawSkill = readFileSync(skillMd, 'utf-8');
        const normalized = normalizeImportedSkillMarkdown(rawSkill, name);
        const dest = join(outSkillDir, 'SKILL.md');
        writeFileSync(dest, normalized.content);
        filesImported.push(dest);
        if (normalized.addedDescription) {
          warnings.push(
            `skills/${name}/SKILL.md missing description; added import placeholder.`
          );
        }
      }
    }
  }

  // Import commands
  const commandsDir = resolve(cursorDir, 'commands');
  if (existsSync(commandsDir)) {
    const outDir = resolve(packDir, 'commands');
    ensureDir(outDir);
    const files = listFiles(commandsDir, { extension: '.md' });
    for (const file of files) {
      const dest = join(outDir, basename(file));
      copyFileSync(file, dest);
      filesImported.push(dest);
    }
  }

  // Import MCP
  const mcpJson = resolve(cursorDir, 'mcp.json');
  if (existsSync(mcpJson)) {
    copyFileSync(mcpJson, join(packDir, 'mcp.json'));
    filesImported.push(join(packDir, 'mcp.json'));
  }

  // Import ignore
  const cursorIgnore = resolve(projectRoot, '.cursorignore');
  if (existsSync(cursorIgnore)) {
    copyFileSync(cursorIgnore, join(packDir, 'ignore'));
    filesImported.push(join(packDir, 'ignore'));
  }

  // Generate pack.json
  writePackJson(packDir, 'cursor-import', filesImported);

  return { packDir, filesImported, warnings, configGenerated: false };
}

/**
 * Build rule markdown with agentpacks frontmatter.
 */
function buildAgentpacksRule(
  meta: Record<string, unknown>,
  content: string
): string {
  const lines = ['---'];
  for (const [k, v] of Object.entries(meta)) {
    if (typeof v === 'object') {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    } else {
      lines.push(`${k}: ${v}`);
    }
  }
  lines.push('---', '', content);
  return lines.join('\n');
}

/**
 * Write pack.json for an imported pack.
 */
function writePackJson(
  packDir: string,
  name: string,
  filesImported: string[]
): void {
  const packJson = {
    name,
    version: '1.0.0',
    description: `Imported from Cursor`,
    tags: ['imported', 'cursor'],
    dependencies: [],
    conflicts: [],
    targets: '*',
    features: '*',
  };
  const dest = join(packDir, 'pack.json');
  writeFileSync(dest, JSON.stringify(packJson, null, 2) + '\n');
  filesImported.push(dest);
}
