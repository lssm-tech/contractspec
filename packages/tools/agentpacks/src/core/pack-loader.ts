import { existsSync } from 'fs';
import { resolve, isAbsolute } from 'path';
import {
  loadPackManifest,
  type PackManifest,
  type WorkspaceConfig,
} from './config.js';
import { parseRules, type ParsedRule } from '../features/rules.js';
import { parseCommands, type ParsedCommand } from '../features/commands.js';
import { parseAgents, type ParsedAgent } from '../features/agents.js';
import { parseSkills, type ParsedSkill } from '../features/skills.js';
import { parseHooks, type ParsedHooks } from '../features/hooks.js';
import { parsePlugins, type ParsedPlugin } from '../features/plugins.js';
import { parseMcp, type ParsedMcp } from '../features/mcp.js';
import { parseIgnore, type ParsedIgnore } from '../features/ignore.js';

/**
 * A fully loaded pack with all parsed features.
 */
export interface LoadedPack {
  manifest: PackManifest;
  directory: string;
  rules: ParsedRule[];
  commands: ParsedCommand[];
  agents: ParsedAgent[];
  skills: ParsedSkill[];
  hooks: ParsedHooks | null;
  plugins: ParsedPlugin[];
  mcp: ParsedMcp | null;
  ignore: ParsedIgnore | null;
}

/**
 * Loads packs from a workspace configuration.
 */
export class PackLoader {
  private projectRoot: string;
  private config: WorkspaceConfig;

  constructor(projectRoot: string, config: WorkspaceConfig) {
    this.projectRoot = projectRoot;
    this.config = config;
  }

  /**
   * Load all active packs from the workspace config.
   * Returns packs in declaration order (first = highest priority).
   */
  loadAll(): { packs: LoadedPack[]; warnings: string[] } {
    const warnings: string[] = [];
    const packs: LoadedPack[] = [];
    const disabledSet = new Set(this.config.disabled);

    for (const packRef of this.config.packs) {
      const packDir = this.resolvePackPath(packRef);

      if (!packDir) {
        warnings.push(`Pack "${packRef}" could not be resolved. Skipping.`);
        continue;
      }

      if (!existsSync(packDir)) {
        warnings.push(`Pack directory "${packDir}" does not exist. Skipping.`);
        continue;
      }

      const manifest = loadPackManifest(packDir);

      if (disabledSet.has(manifest.name) || disabledSet.has(packRef)) {
        continue;
      }

      const loaded = this.loadPack(packDir, manifest);
      packs.push(loaded);
    }

    return { packs, warnings };
  }

  /**
   * Load a single pack from a directory.
   */
  private loadPack(packDir: string, manifest: PackManifest): LoadedPack {
    const name = manifest.name;

    const rulesDir = resolve(packDir, 'rules');
    const commandsDir = resolve(packDir, 'commands');
    const agentsDir = resolve(packDir, 'agents');
    const skillsDir = resolve(packDir, 'skills');

    return {
      manifest,
      directory: packDir,
      rules: existsSync(rulesDir) ? parseRules(rulesDir, name) : [],
      commands: existsSync(commandsDir) ? parseCommands(commandsDir, name) : [],
      agents: existsSync(agentsDir) ? parseAgents(agentsDir, name) : [],
      skills: existsSync(skillsDir) ? parseSkills(skillsDir, name) : [],
      hooks: parseHooks(packDir, name),
      plugins: parsePlugins(packDir, name),
      mcp: parseMcp(packDir, name),
      ignore: parseIgnore(packDir, name),
    };
  }

  /**
   * Load packs scoped to a specific baseDir (monorepo support).
   * Looks for an agentpacks.jsonc in the baseDir and loads its packs.
   */
  loadForBaseDir(baseDir: string): { packs: LoadedPack[]; warnings: string[] } {
    const baseDirRoot = resolve(this.projectRoot, baseDir);
    const localConfigPath = resolve(baseDirRoot, 'agentpacks.jsonc');

    if (!existsSync(localConfigPath)) {
      return { packs: [], warnings: [] };
    }

    const { loadWorkspaceConfig } = require('./config.js');
    const localConfig = loadWorkspaceConfig(baseDirRoot);
    const loader = new PackLoader(baseDirRoot, localConfig);
    return loader.loadAll();
  }

  /**
   * Resolve a curated (installed) pack from .agentpacks/.curated/.
   */
  private resolveCuratedPack(packRef: string): string | null {
    const curatedDir = resolve(this.projectRoot, '.agentpacks', '.curated');
    // Derive pack directory name from ref
    let packName = packRef;
    if (packName.startsWith('npm:')) packName = packName.slice(4);
    if (packName.startsWith('github:')) packName = packName.slice(7);
    if (packName.startsWith('@')) packName = packName.slice(1);
    // For owner/repo, take repo part; for scoped npm, replace / with -
    if (packName.includes('/')) {
      const parts = packName.split('/');
      // Git: use last part (repo name). npm scoped: join with -
      packName = packName.includes('@')
        ? parts.join('-')
        : (parts[parts.length - 1] ?? packName);
    }
    // Strip any @version or :path suffixes
    packName = packName.split('@')[0]!.split(':')[0]!;

    const resolved = resolve(curatedDir, packName);
    return existsSync(resolved) ? resolved : null;
  }

  /**
   * Resolve a pack reference to an absolute directory path.
   * Supports: ./relative, /absolute, npm:pkg, github:owner/repo, curated cache
   */
  private resolvePackPath(packRef: string): string | null {
    // Local relative path
    if (packRef.startsWith('./') || packRef.startsWith('../')) {
      return resolve(this.projectRoot, packRef);
    }

    // Absolute path
    if (isAbsolute(packRef)) {
      return packRef;
    }

    // npm package — resolve from curated cache
    if (
      packRef.startsWith('@') ||
      packRef.startsWith('npm:') ||
      !packRef.includes('/')
    ) {
      return this.resolveCuratedPack(packRef);
    }

    // Git repo — resolve from curated cache
    if (packRef.startsWith('github:') || packRef.includes('/')) {
      return this.resolveCuratedPack(packRef);
    }

    // Fallback: treat as local path
    return resolve(this.projectRoot, packRef);
  }
}
