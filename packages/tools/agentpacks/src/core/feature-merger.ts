import type { LoadedPack } from './pack-loader.js';
import type { ParsedRule } from '../features/rules.js';
import type { ParsedCommand } from '../features/commands.js';
import type { ParsedAgent } from '../features/agents.js';
import type { ParsedSkill } from '../features/skills.js';
import type { ParsedHooks, HookEvents } from '../features/hooks.js';
import type { ParsedPlugin } from '../features/plugins.js';
import type { McpServerEntry } from '../features/mcp.js';
import {
  type ParsedModels,
  type ModelsConfig,
  mergeModelsConfigs,
} from '../features/models.js';

/**
 * Merged features from all active packs.
 */
export interface MergedFeatures {
  rules: ParsedRule[];
  commands: ParsedCommand[];
  agents: ParsedAgent[];
  skills: ParsedSkill[];
  hooks: ParsedHooks[];
  plugins: ParsedPlugin[];
  mcpServers: Record<string, McpServerEntry>;
  ignorePatterns: string[];
  models: ModelsConfig | null;
}

/**
 * Merges features from multiple packs with conflict detection.
 * First pack wins for name-based conflicts.
 */
export class FeatureMerger {
  private packs: LoadedPack[];
  private warnings: string[] = [];

  constructor(packs: LoadedPack[]) {
    this.packs = packs;
  }

  /**
   * Merge all features from loaded packs.
   */
  merge(): { features: MergedFeatures; warnings: string[] } {
    this.warnings = [];

    const features: MergedFeatures = {
      rules: this.mergeRules(),
      commands: this.mergeByName('commands'),
      agents: this.mergeByName('agents'),
      skills: this.mergeByName('skills'),
      hooks: this.mergeHooks(),
      plugins: this.mergePlugins(),
      mcpServers: this.mergeMcp(),
      ignorePatterns: this.mergeIgnore(),
      models: this.mergeModels(),
    };

    return { features, warnings: this.warnings };
  }

  /**
   * Rules are additive. Same filename from different packs: first wins.
   */
  private mergeRules(): ParsedRule[] {
    const seen = new Map<string, string>();
    const result: ParsedRule[] = [];

    for (const pack of this.packs) {
      for (const rule of pack.rules) {
        const existing = seen.get(rule.name);
        if (existing) {
          this.warnings.push(
            `Rule "${rule.name}" from pack "${rule.packName}" skipped (already defined by "${existing}").`
          );
          continue;
        }
        seen.set(rule.name, rule.packName);
        result.push(rule);
      }
    }

    return result;
  }

  /**
   * Generic name-based merge for commands, agents, skills.
   */
  private mergeByName<K extends 'commands' | 'agents' | 'skills'>(
    featureKey: K
  ): LoadedPack[K] {
    const seen = new Map<string, string>();
    const result: (ParsedCommand | ParsedAgent | ParsedSkill)[] = [];

    for (const pack of this.packs) {
      const items = pack[featureKey] as {
        name: string;
        packName: string;
      }[];
      for (const item of items) {
        const existing = seen.get(item.name);
        if (existing) {
          this.warnings.push(
            `${featureKey.slice(0, -1)} "${item.name}" from pack "${item.packName}" skipped (already defined by "${existing}").`
          );
          continue;
        }
        seen.set(item.name, item.packName);
        result.push(item as ParsedCommand & ParsedAgent & ParsedSkill);
      }
    }

    return result as LoadedPack[K];
  }

  /**
   * Hooks are additive per event.
   */
  private mergeHooks(): ParsedHooks[] {
    return this.packs
      .map((p) => p.hooks)
      .filter((h): h is ParsedHooks => h !== null);
  }

  /**
   * Plugins are additive.
   */
  private mergePlugins(): ParsedPlugin[] {
    const seen = new Map<string, string>();
    const result: ParsedPlugin[] = [];

    for (const pack of this.packs) {
      for (const plugin of pack.plugins) {
        const key = `${plugin.name}.${plugin.extension}`;
        const existing = seen.get(key);
        if (existing) {
          this.warnings.push(
            `Plugin "${key}" from pack "${plugin.packName}" skipped (already defined by "${existing}").`
          );
          continue;
        }
        seen.set(key, plugin.packName);
        result.push(plugin);
      }
    }

    return result;
  }

  /**
   * MCP servers merge by name. First pack wins.
   */
  private mergeMcp(): Record<string, McpServerEntry> {
    const servers: Record<string, McpServerEntry> = {};

    for (const pack of this.packs) {
      if (!pack.mcp) continue;
      for (const [name, entry] of Object.entries(pack.mcp.servers)) {
        if (name in servers) {
          this.warnings.push(
            `MCP server "${name}" from pack "${pack.manifest.name}" skipped (already defined).`
          );
          continue;
        }
        servers[name] = entry;
      }
    }

    return servers;
  }

  /**
   * Ignore patterns are additive (deduplicated).
   */
  private mergeIgnore(): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const pack of this.packs) {
      if (!pack.ignore) continue;
      for (const pattern of pack.ignore.patterns) {
        if (!seen.has(pattern)) {
          seen.add(pattern);
          result.push(pattern);
        }
      }
    }

    return result;
  }

  /**
   * Models: delegate to mergeModelsConfigs.
   * Returns null if no packs define models.
   */
  private mergeModels(): ModelsConfig | null {
    const configs: ParsedModels[] = this.packs
      .map((p) => p.models)
      .filter((m): m is ParsedModels => m != null);

    if (configs.length === 0) return null;

    const { config, warnings } = mergeModelsConfigs(configs);
    this.warnings.push(...warnings);
    return config;
  }
}
