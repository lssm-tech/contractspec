import { existsSync, readFileSync, copyFileSync, writeFileSync } from 'fs';
import { resolve, join, basename } from 'path';
import { parse as parseJsonc } from 'jsonc-parser';
import { ensureDir, listFiles, listDirs } from '../utils/filesystem.js';

/**
 * Result of a rulesync import operation.
 */
export interface ImportResult {
  packDir: string;
  filesImported: string[];
  warnings: string[];
  configGenerated: boolean;
}

/**
 * Import from an existing .rulesync/ directory into an agentpacks pack.
 * Reads .rulesync/ and rulesync.jsonc, creates a pack at the specified output dir.
 */
export function importFromRulesync(
  projectRoot: string,
  outputPackDir?: string
): ImportResult {
  const rulesyncDir = resolve(projectRoot, '.rulesync');
  const warnings: string[] = [];
  const filesImported: string[] = [];

  if (!existsSync(rulesyncDir)) {
    return {
      packDir: '',
      filesImported: [],
      warnings: ['No .rulesync/ directory found.'],
      configGenerated: false,
    };
  }

  const packDir = outputPackDir ?? resolve(projectRoot, 'packs', 'default');
  ensureDir(packDir);

  // Import rules
  const rulesDir = resolve(rulesyncDir, 'rules');
  if (existsSync(rulesDir)) {
    const outRulesDir = resolve(packDir, 'rules');
    ensureDir(outRulesDir);
    const files = listFiles(rulesDir, { extension: '.md' });
    for (const file of files) {
      const dest = join(outRulesDir, basename(file));
      copyFileSync(file, dest);
      filesImported.push(dest);
    }
  }

  // Import commands
  const commandsDir = resolve(rulesyncDir, 'commands');
  if (existsSync(commandsDir)) {
    const outCommandsDir = resolve(packDir, 'commands');
    ensureDir(outCommandsDir);
    const files = listFiles(commandsDir, { extension: '.md' });
    for (const file of files) {
      const dest = join(outCommandsDir, basename(file));
      copyFileSync(file, dest);
      filesImported.push(dest);
    }
  }

  // Import subagents -> agents
  const subagentsDir = resolve(rulesyncDir, 'subagents');
  if (existsSync(subagentsDir)) {
    const outAgentsDir = resolve(packDir, 'agents');
    ensureDir(outAgentsDir);
    const files = listFiles(subagentsDir, { extension: '.md' });
    for (const file of files) {
      const dest = join(outAgentsDir, basename(file));
      copyFileSync(file, dest);
      filesImported.push(dest);
    }
  }

  // Import skills
  const skillsDir = resolve(rulesyncDir, 'skills');
  if (existsSync(skillsDir)) {
    const outSkillsDir = resolve(packDir, 'skills');
    ensureDir(outSkillsDir);
    const skillDirs = listDirs(skillsDir);
    for (const skillDir of skillDirs) {
      const skillName = basename(skillDir);
      if (skillName.startsWith('.')) continue;

      const skillMd = join(skillDir, 'SKILL.md');
      if (existsSync(skillMd)) {
        const outSkillDir = join(outSkillsDir, skillName);
        ensureDir(outSkillDir);
        copyFileSync(skillMd, join(outSkillDir, 'SKILL.md'));
        filesImported.push(join(outSkillDir, 'SKILL.md'));
      }
    }
  }

  // Import hooks
  const hooksJson = resolve(rulesyncDir, 'hooks.json');
  if (existsSync(hooksJson)) {
    const outHooksDir = resolve(packDir, 'hooks');
    ensureDir(outHooksDir);
    copyFileSync(hooksJson, join(outHooksDir, 'hooks.json'));
    filesImported.push(join(outHooksDir, 'hooks.json'));
  }

  // Import MCP
  const mcpJson = resolve(rulesyncDir, 'mcp.json');
  if (existsSync(mcpJson)) {
    copyFileSync(mcpJson, join(packDir, 'mcp.json'));
    filesImported.push(join(packDir, 'mcp.json'));
  }

  // Import ignore
  const aiIgnore = resolve(rulesyncDir, '.aiignore');
  const rulesyncIgnore = resolve(projectRoot, '.rulesyncignore');
  if (existsSync(aiIgnore)) {
    copyFileSync(aiIgnore, join(packDir, 'ignore'));
    filesImported.push(join(packDir, 'ignore'));
  } else if (existsSync(rulesyncIgnore)) {
    copyFileSync(rulesyncIgnore, join(packDir, 'ignore'));
    filesImported.push(join(packDir, 'ignore'));
  }

  // Generate pack.json
  const packJson = {
    name: 'default',
    version: '1.0.0',
    description: 'Imported from rulesync',
    tags: ['imported', 'rulesync'],
    dependencies: [],
    conflicts: [],
    targets: '*',
    features: '*',
  };
  writeFileSync(
    join(packDir, 'pack.json'),
    JSON.stringify(packJson, null, 2) + '\n'
  );
  filesImported.push(join(packDir, 'pack.json'));

  // Generate agentpacks.jsonc from rulesync.jsonc
  let configGenerated = false;
  const rulesyncConfig = resolve(projectRoot, 'rulesync.jsonc');
  if (existsSync(rulesyncConfig)) {
    const agentpacksConfig = convertRulesyncConfig(rulesyncConfig, packDir);
    const configPath = resolve(projectRoot, 'agentpacks.jsonc');
    writeFileSync(configPath, agentpacksConfig);
    configGenerated = true;
  }

  return { packDir, filesImported, warnings, configGenerated };
}

/**
 * Convert a rulesync.jsonc to agentpacks.jsonc format.
 */
function convertRulesyncConfig(rulesyncPath: string, _packDir: string): string {
  const raw = readFileSync(rulesyncPath, 'utf-8');
  const parsed = parseJsonc(raw) as Record<string, unknown>;

  const targets = parsed.targets ?? ['opencode', 'cursor', 'claudecode'];
  const features = parsed.features ?? ['*'];
  const baseDirs = parsed.baseDirs ?? ['.'];
  const global = parsed.global ?? false;
  const deleteVal = parsed.delete ?? true;

  // Convert pack path to relative
  const relPackDir = './' + join('packs', 'default');

  const config = {
    $schema: 'https://unpkg.com/agentpacks/schema.json',
    packs: [relPackDir],
    disabled: [],
    targets,
    features,
    mode: (baseDirs as string[]).length > 1 ? 'monorepo' : 'repo',
    baseDirs,
    global,
    delete: deleteVal,
  };

  return JSON.stringify(config, null, 2) + '\n';
}
