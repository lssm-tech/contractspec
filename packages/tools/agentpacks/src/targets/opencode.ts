import { resolve, join } from 'path';
import type { FeatureId } from '../core/config.js';
import {
  BaseTarget,
  type GenerateOptions,
  type GenerateResult,
} from './base-target.js';
import { ruleMatchesTarget, getDetailRules } from '../features/rules.js';
import { commandMatchesTarget } from '../features/commands.js';
import { agentMatchesTarget } from '../features/agents.js';
import { skillMatchesTarget } from '../features/skills.js';
import { resolveHooksForTarget } from '../features/hooks.js';
import { resolveModels } from '../core/profile-resolver.js';
import { packNameToIdentifier } from '../utils/markdown.js';
import { serializeFrontmatter } from '../utils/frontmatter.js';
import {
  writeGeneratedFile,
  writeGeneratedJson,
  removeIfExists,
  ensureDir,
} from '../utils/filesystem.js';

const TARGET_ID = 'opencode';

/**
 * OpenCode target generator.
 * Generates: opencode.json, .opencode/agent/, .opencode/skill/, .opencode/command/,
 * .opencode/plugins/agentpacks-<pack>.ts, AGENTS.md rules
 */
export class OpenCodeTarget extends BaseTarget {
  readonly id = TARGET_ID;
  readonly name = 'OpenCode';

  readonly supportedFeatures: FeatureId[] = [
    'rules',
    'commands',
    'agents',
    'skills',
    'hooks',
    'plugins',
    'mcp',
    'ignore',
    'models',
  ];

  generate(options: GenerateOptions): GenerateResult {
    const { projectRoot, baseDir, features, enabledFeatures, deleteExisting } =
      options;
    const root = resolve(projectRoot, baseDir);
    const effective = this.getEffectiveFeatures(enabledFeatures);
    const filesWritten: string[] = [];
    const filesDeleted: string[] = [];
    const warnings: string[] = [];

    const opencodeDir = resolve(root, '.opencode');

    if (effective.includes('agents')) {
      const agentDir = resolve(opencodeDir, 'agent');
      if (deleteExisting) {
        removeIfExists(agentDir);
        filesDeleted.push(agentDir);
      }
      ensureDir(agentDir);

      // Resolve models for agent frontmatter passthrough
      const resolvedModels = features.models
        ? resolveModels(features.models, options.modelProfile, TARGET_ID)
        : null;

      const agents = features.agents.filter((a) =>
        agentMatchesTarget(a, TARGET_ID)
      );
      for (const agent of agents) {
        const filepath = join(agentDir, `${agent.name}.md`);
        // Build frontmatter with model metadata
        const fm: Record<string, unknown> = {};
        const oc = agent.meta.opencode ?? {};
        // Models feature takes precedence over agent frontmatter
        const modelsAgent = resolvedModels?.agents[agent.name];
        const agentModel =
          modelsAgent?.model ?? (oc as Record<string, unknown>).model;
        const agentTemp =
          modelsAgent?.temperature ??
          (oc as Record<string, unknown>).temperature;

        if (agentModel) fm.model = agentModel;
        if (agentTemp !== undefined) fm.temperature = agentTemp;
        if ((oc as Record<string, unknown>).mode)
          fm.mode = (oc as Record<string, unknown>).mode;
        if ((oc as Record<string, unknown>).top_p !== undefined)
          fm.top_p = (oc as Record<string, unknown>).top_p;

        const content =
          Object.keys(fm).length > 0
            ? serializeFrontmatter(fm, agent.content)
            : agent.content;
        writeGeneratedFile(filepath, content);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('skills')) {
      const skillDir = resolve(opencodeDir, 'skill');
      if (deleteExisting) {
        removeIfExists(skillDir);
        filesDeleted.push(skillDir);
      }
      ensureDir(skillDir);

      const skills = features.skills.filter((s) =>
        skillMatchesTarget(s, TARGET_ID)
      );
      for (const skill of skills) {
        const skillSubDir = join(skillDir, skill.name);
        ensureDir(skillSubDir);
        const filepath = join(skillSubDir, 'SKILL.md');
        writeGeneratedFile(filepath, skill.content);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('commands')) {
      const cmdDir = resolve(opencodeDir, 'command');
      if (deleteExisting) {
        removeIfExists(cmdDir);
        filesDeleted.push(cmdDir);
      }
      ensureDir(cmdDir);

      const commands = features.commands.filter((c) =>
        commandMatchesTarget(c, TARGET_ID)
      );
      for (const cmd of commands) {
        const filepath = join(cmdDir, `${cmd.name}.md`);
        writeGeneratedFile(filepath, cmd.content);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('hooks') || effective.includes('plugins')) {
      const pluginsDir = resolve(opencodeDir, 'plugins');
      ensureDir(pluginsDir);

      // Generate hook-based plugins (one per pack)
      if (effective.includes('hooks')) {
        for (const hookSet of features.hooks) {
          const events = resolveHooksForTarget(hookSet, TARGET_ID);
          if (Object.keys(events).length > 0) {
            const filepath = join(
              pluginsDir,
              `agentpacks-${hookSet.packName}.ts`
            );
            const content = generateOpenCodeHookPlugin(
              hookSet.packName,
              events
            );
            writeGeneratedFile(filepath, content, { type: 'ts' });
            filesWritten.push(filepath);
          }
        }
      }

      // Copy raw plugin files
      if (effective.includes('plugins')) {
        for (const plugin of features.plugins) {
          const filepath = join(
            pluginsDir,
            `agentpacks-${plugin.packName}-${plugin.name}.${plugin.extension}`
          );
          writeGeneratedFile(filepath, plugin.content, {
            type: plugin.extension,
          });
          filesWritten.push(filepath);
        }
      }
    }

    // Build opencode.json (combines MCP + models config)
    if (effective.includes('mcp') || effective.includes('models')) {
      const filepath = resolve(root, 'opencode.json');
      const opencodeConfig: Record<string, unknown> = {
        $schema: 'https://opencode.ai/config.json',
      };

      // MCP servers
      if (effective.includes('mcp')) {
        const mcpEntries = Object.entries(features.mcpServers);
        if (mcpEntries.length > 0) {
          opencodeConfig.mcp = buildOpenCodeMcpServers(features.mcpServers);
        }
      }

      // Models config
      if (effective.includes('models') && features.models) {
        const resolved = resolveModels(
          features.models,
          options.modelProfile,
          TARGET_ID
        );
        if (resolved.default) opencodeConfig.model = resolved.default;
        if (resolved.small) opencodeConfig.small_model = resolved.small;

        // Provider options/variants
        if (Object.keys(resolved.providers).length > 0) {
          opencodeConfig.provider = resolved.providers;
        }

        // Per-agent model assignments
        const agentEntries = Object.entries(resolved.agents);
        if (agentEntries.length > 0) {
          const agentConfig: Record<string, Record<string, unknown>> = {};
          for (const [name, assignment] of agentEntries) {
            const config: Record<string, unknown> = { model: assignment.model };
            if (assignment.temperature !== undefined) {
              config.temperature = assignment.temperature;
            }
            if (assignment.top_p !== undefined) {
              config.top_p = assignment.top_p;
            }
            agentConfig[name] = config;
          }
          opencodeConfig.agent = agentConfig;
        }
      }

      if (Object.keys(opencodeConfig).length > 1) {
        writeGeneratedJson(filepath, opencodeConfig, { header: false });
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('rules')) {
      const rules = features.rules.filter((r) =>
        ruleMatchesTarget(r, TARGET_ID)
      );
      const detailRules = getDetailRules(rules);

      // AGENTS.md generation is handled by the agents-md target
      // OpenCode reads AGENTS.md natively

      // Detail rules go to .opencode/memories/ (if supported)
      if (detailRules.length > 0) {
        const memoriesDir = resolve(opencodeDir, 'memories');
        if (deleteExisting) {
          removeIfExists(memoriesDir);
          filesDeleted.push(memoriesDir);
        }
        ensureDir(memoriesDir);

        for (const rule of detailRules) {
          const filepath = join(memoriesDir, `${rule.name}.md`);
          writeGeneratedFile(filepath, rule.content);
          filesWritten.push(filepath);
        }
      }
    }

    return this.createResult(filesWritten, filesDeleted, warnings);
  }
}

/**
 * Build opencode.json MCP servers map from merged servers.
 */
function buildOpenCodeMcpServers(
  servers: Record<
    string,
    {
      type?: string;
      url?: string;
      command?: string;
      args?: string[];
      env?: Record<string, string>;
      headers?: Record<string, string>;
      [key: string]: unknown;
    }
  >
): Record<string, unknown> {
  const mcp: Record<string, unknown> = {};

  for (const [name, entry] of Object.entries(servers)) {
    if (entry.url) {
      mcp[name] = {
        type: 'remote',
        url: entry.url,
        enabled: true,
        ...(entry.headers && Object.keys(entry.headers).length > 0
          ? { headers: entry.headers }
          : {}),
      };
    } else if (entry.command) {
      const cmd = entry.args ? [entry.command, ...entry.args] : [entry.command];
      mcp[name] = {
        type: 'local',
        command: cmd,
        enabled: true,
        ...(entry.env && Object.keys(entry.env).length > 0
          ? { environment: entry.env }
          : {}),
      };
    }
  }

  return mcp;
}

/**
 * Generate an OpenCode plugin from hook events.
 */
function generateOpenCodeHookPlugin(
  packName: string,
  events: Record<string, { command?: string; matcher?: string }[]>
): string {
  const identifier = packNameToIdentifier(packName);
  const hookMap = mapHookEvents(events);

  const hookEntries = Object.entries(hookMap)
    .map(([event, handlers]) => {
      const body = handlers
        .map((h) => {
          const matcherGuard = h.matcher
            ? `if (!/(?:${h.matcher})/.test(String(input?.tool ?? ""))) return;\n      `
            : '';
          return `      ${matcherGuard}await $\`${h.command}\`;`;
        })
        .join('\n');
      return `    "${event}": async (input, output) => {\n${body}\n    },`;
    })
    .join('\n');

  return `import type { Plugin } from "@opencode-ai/plugin";

export const ${identifier}Plugin: Plugin = async ({ project, client, $, directory, worktree }) => {
  return {
${hookEntries}
  };
};
`;
}

/** Map rulesync/canonical hook events to OpenCode plugin events. */
function mapHookEvents(
  events: Record<string, { command?: string; matcher?: string }[]>
): Record<string, { command?: string; matcher?: string }[]> {
  const mapped: Record<string, { command?: string; matcher?: string }[]> = {};

  const eventMapping: Record<string, string> = {
    sessionStart: 'session.created',
    postToolUse: 'tool.execute.after',
    preToolUse: 'tool.execute.before',
    stop: 'session.idle',
    afterFileEdit: 'file.edited',
    afterShellExecution: 'command.executed',
  };

  for (const [event, handlers] of Object.entries(events)) {
    const opencodeEvent = eventMapping[event] ?? event;
    if (!mapped[opencodeEvent]) {
      mapped[opencodeEvent] = [];
    }
    mapped[opencodeEvent].push(...handlers.filter((h) => h.command));
  }

  return mapped;
}
