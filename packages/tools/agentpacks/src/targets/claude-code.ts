import { resolve, join } from 'path';
import type { FeatureId } from '../core/config.js';
import {
  BaseTarget,
  type GenerateOptions,
  type GenerateResult,
} from './base-target.js';
import {
  ruleMatchesTarget,
  getRootRules,
  getDetailRules,
} from '../features/rules.js';
import { commandMatchesTarget } from '../features/commands.js';
import { agentMatchesTarget } from '../features/agents.js';
import { skillMatchesTarget } from '../features/skills.js';
import { resolveHooksForTarget } from '../features/hooks.js';
import {
  writeGeneratedFile,
  writeGeneratedJson,
  removeIfExists,
  ensureDir,
  readJsonOrNull,
} from '../utils/filesystem.js';

const TARGET_ID = 'claudecode';

/**
 * Claude Code target generator.
 * Generates: CLAUDE.md, .claude/rules/, .claude/agents/, .claude/commands/,
 * .claude/skills/, .claude/settings.json
 */
export class ClaudeCodeTarget extends BaseTarget {
  readonly id = TARGET_ID;
  readonly name = 'Claude Code';

  readonly supportedFeatures: FeatureId[] = [
    'rules',
    'commands',
    'agents',
    'skills',
    'hooks',
    'mcp',
    'ignore',
  ];

  generate(options: GenerateOptions): GenerateResult {
    const { projectRoot, baseDir, features, enabledFeatures, deleteExisting } =
      options;
    const root = resolve(projectRoot, baseDir);
    const effective = this.getEffectiveFeatures(enabledFeatures);
    const filesWritten: string[] = [];
    const filesDeleted: string[] = [];
    const warnings: string[] = [];

    const claudeDir = resolve(root, '.claude');

    if (effective.includes('rules')) {
      const rulesDir = resolve(claudeDir, 'rules');
      if (deleteExisting) {
        removeIfExists(rulesDir);
        filesDeleted.push(rulesDir);
      }
      ensureDir(rulesDir);

      const rules = features.rules.filter((r) =>
        ruleMatchesTarget(r, TARGET_ID)
      );
      const rootRules = getRootRules(rules);
      const detailRules = getDetailRules(rules);

      // Root rules -> CLAUDE.md
      if (rootRules.length > 0) {
        const claudeMd = rootRules.map((r) => r.content).join('\n\n');
        const filepath = resolve(claudeDir, 'CLAUDE.md');
        writeGeneratedFile(filepath, claudeMd);
        filesWritten.push(filepath);
      }

      // Detail rules -> .claude/rules/*.md
      for (const rule of detailRules) {
        const filepath = join(rulesDir, `${rule.name}.md`);
        writeGeneratedFile(filepath, rule.content);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('agents')) {
      const agentsDir = resolve(claudeDir, 'agents');
      if (deleteExisting) {
        removeIfExists(agentsDir);
        filesDeleted.push(agentsDir);
      }
      ensureDir(agentsDir);

      const agents = features.agents.filter((a) =>
        agentMatchesTarget(a, TARGET_ID)
      );
      for (const agent of agents) {
        const filepath = join(agentsDir, `${agent.name}.md`);
        writeGeneratedFile(filepath, agent.content);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('skills')) {
      const skillsDir = resolve(claudeDir, 'skills');
      if (deleteExisting) {
        removeIfExists(skillsDir);
        filesDeleted.push(skillsDir);
      }
      ensureDir(skillsDir);

      const skills = features.skills.filter((s) =>
        skillMatchesTarget(s, TARGET_ID)
      );
      for (const skill of skills) {
        const skillSubDir = join(skillsDir, skill.name);
        ensureDir(skillSubDir);
        const filepath = join(skillSubDir, 'SKILL.md');
        writeGeneratedFile(filepath, skill.content);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('commands')) {
      const commandsDir = resolve(claudeDir, 'commands');
      if (deleteExisting) {
        removeIfExists(commandsDir);
        filesDeleted.push(commandsDir);
      }
      ensureDir(commandsDir);

      const commands = features.commands.filter((c) =>
        commandMatchesTarget(c, TARGET_ID)
      );
      for (const cmd of commands) {
        const filepath = join(commandsDir, `${cmd.name}.md`);
        writeGeneratedFile(filepath, cmd.content);
        filesWritten.push(filepath);
      }
    }

    // Settings.json: merge hooks + MCP + ignore into .claude/settings.json
    if (
      effective.includes('hooks') ||
      effective.includes('mcp') ||
      effective.includes('ignore')
    ) {
      const settings = buildClaudeSettings(options, effective);
      if (Object.keys(settings).length > 0) {
        const filepath = resolve(claudeDir, 'settings.json');
        // Merge with existing settings if present
        const existing =
          readJsonOrNull<Record<string, unknown>>(filepath) ?? {};
        const merged = { ...existing, ...settings };
        writeGeneratedJson(filepath, merged, { header: false });
        filesWritten.push(filepath);
      }
    }

    return this.createResult(filesWritten, filesDeleted, warnings);
  }
}

/**
 * Build Claude Code settings.json content.
 */
function buildClaudeSettings(
  options: GenerateOptions,
  effective: FeatureId[]
): Record<string, unknown> {
  const settings: Record<string, unknown> = {};

  // Hooks -> PascalCase event names
  if (effective.includes('hooks')) {
    const allHookEntries: Record<string, unknown[]> = {};
    for (const hookSet of options.features.hooks) {
      const events = resolveHooksForTarget(hookSet, TARGET_ID);
      for (const [event, entries] of Object.entries(events)) {
        const pascalEvent = toPascalCase(event);
        if (!allHookEntries[pascalEvent]) {
          allHookEntries[pascalEvent] = [];
        }
        allHookEntries[pascalEvent].push(
          ...entries.map((e) => ({
            type: e.type ?? 'command',
            ...(e.matcher ? { matcher: e.matcher } : {}),
            command: e.command,
          }))
        );
      }
    }
    if (Object.keys(allHookEntries).length > 0) {
      settings.hooks = allHookEntries;
    }
  }

  // MCP
  if (effective.includes('mcp')) {
    const mcpEntries = Object.entries(options.features.mcpServers);
    if (mcpEntries.length > 0) {
      const mcpServers: Record<string, unknown> = {};
      for (const [name, entry] of mcpEntries) {
        if (entry.url) {
          mcpServers[name] = { url: entry.url };
        } else if (entry.command) {
          mcpServers[name] = {
            command: entry.command,
            ...(entry.args ? { args: entry.args } : {}),
            ...(entry.env ? { env: entry.env } : {}),
          };
        }
      }
      settings.mcpServers = mcpServers;
    }
  }

  return settings;
}

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
