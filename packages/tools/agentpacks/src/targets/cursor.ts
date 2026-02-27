import { resolve, join } from 'path';
import type { FeatureId } from '../core/config.js';
import {
  BaseTarget,
  type GenerateOptions,
  type GenerateResult,
} from './base-target.js';
import { ruleMatchesTarget } from '../features/rules.js';
import { commandMatchesTarget } from '../features/commands.js';
import { agentMatchesTarget } from '../features/agents.js';
import { skillMatchesTarget, serializeSkill } from '../features/skills.js';
import { resolveHooksForTarget } from '../features/hooks.js';
import {
  resolveModels,
  type ResolvedModels,
} from '../core/profile-resolver.js';
import { serializeFrontmatter } from '../utils/frontmatter.js';
import {
  writeGeneratedFile,
  writeGeneratedJson,
  removeIfExists,
  ensureDir,
} from '../utils/filesystem.js';

const TARGET_ID = 'cursor';

/**
 * Cursor target generator.
 * Generates: .cursor/rules/, .cursor/skills/, .cursor/agents/, .cursor/commands/,
 * .cursor/hooks.json, .cursor/mcp.json, .cursorignore
 */
export class CursorTarget extends BaseTarget {
  readonly id = TARGET_ID;
  readonly name = 'Cursor';

  readonly supportedFeatures: FeatureId[] = [
    'rules',
    'commands',
    'agents',
    'skills',
    'hooks',
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

    const cursorDir = resolve(root, '.cursor');

    if (effective.includes('rules')) {
      const rulesDir = resolve(cursorDir, 'rules');
      if (deleteExisting) {
        removeIfExists(rulesDir);
        filesDeleted.push(rulesDir);
      }
      ensureDir(rulesDir);

      const rules = features.rules.filter((r) =>
        ruleMatchesTarget(r, TARGET_ID)
      );
      for (const rule of rules) {
        const cursorMeta = rule.meta.cursor ?? {};
        const frontmatter: Record<string, unknown> = {
          description:
            (cursorMeta as Record<string, unknown>).description ??
            rule.meta.description ??
            '',
          alwaysApply:
            (cursorMeta as Record<string, unknown>).alwaysApply ??
            rule.meta.root ??
            false,
        };
        const globs =
          (cursorMeta as Record<string, unknown>).globs ?? rule.meta.globs;
        if (globs) {
          frontmatter.globs = globs;
        }

        const filepath = join(rulesDir, `${rule.name}.mdc`);
        const content = serializeFrontmatter(frontmatter, rule.content);
        writeGeneratedFile(filepath, content);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('agents')) {
      const agentsDir = resolve(cursorDir, 'agents');
      if (deleteExisting) {
        removeIfExists(agentsDir);
        filesDeleted.push(agentsDir);
      }
      ensureDir(agentsDir);

      // Resolve models for agent model hints
      const resolvedModels = features.models
        ? resolveModels(features.models, options.modelProfile, TARGET_ID)
        : null;

      const agents = features.agents.filter((a) =>
        agentMatchesTarget(a, TARGET_ID)
      );
      for (const agent of agents) {
        const frontmatter: Record<string, unknown> = {
          name: agent.name,
          description: agent.meta.description ?? '',
        };
        // Include model hint from models feature or agent frontmatter
        const cursorMeta = agent.meta.cursor ?? {};
        const modelsAgent = resolvedModels?.agents[agent.name];
        const model =
          modelsAgent?.model ?? (cursorMeta as Record<string, unknown>).model;
        if (model) {
          frontmatter.model = model;
        }
        const filepath = join(agentsDir, `${agent.name}.md`);
        const content = serializeFrontmatter(frontmatter, agent.content);
        writeGeneratedFile(filepath, content);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('skills')) {
      const skillsDir = resolve(cursorDir, 'skills');
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
        const content = serializeSkill(skill);
        writeGeneratedFile(filepath, content);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('commands')) {
      const commandsDir = resolve(cursorDir, 'commands');
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

    if (effective.includes('hooks')) {
      const hooksFilepath = resolve(cursorDir, 'hooks.json');
      if (deleteExisting) {
        removeIfExists(hooksFilepath);
        filesDeleted.push(hooksFilepath);
      }

      const mergedHooks: Record<string, unknown[]> = {};
      for (const hookSet of features.hooks) {
        const events = resolveHooksForTarget(hookSet, TARGET_ID);
        for (const [event, entries] of Object.entries(events)) {
          if (!mergedHooks[event]) {
            mergedHooks[event] = [];
          }
          mergedHooks[event].push(...entries);
        }
      }

      if (Object.keys(mergedHooks).length > 0) {
        const hooksVersion =
          features.hooks.find((h) => h.version !== undefined)?.version ?? 1;
        writeGeneratedJson(
          hooksFilepath,
          { version: hooksVersion, hooks: mergedHooks },
          { header: false }
        );
        filesWritten.push(hooksFilepath);
      }
    }

    if (effective.includes('mcp')) {
      const mcpEntries = Object.entries(features.mcpServers);
      if (mcpEntries.length > 0) {
        const mcpConfig = buildCursorMcp(features.mcpServers);
        const filepath = resolve(cursorDir, 'mcp.json');
        writeGeneratedJson(filepath, mcpConfig, { header: false });
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('ignore')) {
      if (features.ignorePatterns.length > 0) {
        const filepath = resolve(root, '.cursorignore');
        const content = features.ignorePatterns.join('\n') + '\n';
        writeGeneratedFile(filepath, content);
        filesWritten.push(filepath);
      }
    }

    // Models: generate guidance rule
    if (effective.includes('models') && features.models) {
      const resolved = resolveModels(
        features.models,
        options.modelProfile,
        TARGET_ID
      );
      const guidanceContent = buildCursorModelGuidance(resolved);
      if (guidanceContent) {
        const rulesDir = resolve(cursorDir, 'rules');
        ensureDir(rulesDir);
        const filepath = join(rulesDir, 'model-config.mdc');
        writeGeneratedFile(filepath, guidanceContent, { header: false });
        filesWritten.push(filepath);
      }
    }

    return this.createResult(filesWritten, filesDeleted, warnings);
  }
}

/**
 * Build Cursor MCP config from merged servers.
 */
function buildCursorMcp(
  servers: Record<
    string,
    {
      command?: string;
      url?: string;
      args?: string[];
      env?: Record<string, string>;
      [key: string]: unknown;
    }
  >
): Record<string, unknown> {
  const mcpServers: Record<string, unknown> = {};

  for (const [name, entry] of Object.entries(servers)) {
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

  return { mcpServers };
}

/**
 * Build Cursor model guidance rule content (.mdc format).
 */
function buildCursorModelGuidance(resolved: ResolvedModels): string | null {
  if (
    !resolved.default &&
    !resolved.small &&
    Object.keys(resolved.agents).length === 0
  ) {
    return null;
  }

  const frontmatter: Record<string, unknown> = {
    description:
      'Model configuration and selection guidelines for this workspace',
    alwaysApply: true,
  };

  const lines: string[] = [];
  lines.push('# Model Configuration');
  lines.push('');
  lines.push(
    'Use the following model preferences when working in this project.'
  );
  lines.push('');

  // Default models
  if (resolved.default || resolved.small) {
    lines.push('## Default Models');
    lines.push('');
    if (resolved.default) {
      lines.push(`- **Primary model**: ${resolved.default}`);
    }
    if (resolved.small) {
      lines.push(
        `- **Lightweight tasks** (titles, summaries): ${resolved.small}`
      );
    }
    lines.push('');
  }

  // Agent assignments
  const agentEntries = Object.entries(resolved.agents);
  if (agentEntries.length > 0) {
    lines.push('## Agent Model Assignments');
    lines.push('');
    lines.push('| Agent | Model | Temperature |');
    lines.push('| --- | --- | --- |');
    for (const [name, assignment] of agentEntries) {
      const temp =
        assignment.temperature !== undefined
          ? String(assignment.temperature)
          : '\u2014';
      lines.push(`| ${name} | ${assignment.model} | ${temp} |`);
    }
    lines.push('');
  }

  // Available profiles
  if (Object.keys(resolved.profiles).length > 0) {
    lines.push('## Available Profiles');
    lines.push('');
    lines.push('| Profile | Description | Default Model |');
    lines.push('| --- | --- | --- |');
    for (const [name, profile] of Object.entries(resolved.profiles)) {
      lines.push(
        `| ${name} | ${profile.description ?? '\u2014'} | ${profile.default ?? '\u2014'} |`
      );
    }
    lines.push('');
  }

  // Active profile
  if (resolved.activeProfile) {
    lines.push(`**Active profile**: \`${resolved.activeProfile}\``);
    lines.push('');
  }

  return serializeFrontmatter(frontmatter, lines.join('\n'));
}
