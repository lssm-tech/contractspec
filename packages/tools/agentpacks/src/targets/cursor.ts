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
import { skillMatchesTarget } from '../features/skills.js';
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
 * .cursor/mcp.json, .cursorignore
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

      const agents = features.agents.filter((a) =>
        agentMatchesTarget(a, TARGET_ID)
      );
      for (const agent of agents) {
        const frontmatter: Record<string, unknown> = {
          name: agent.name,
          description: agent.meta.description ?? '',
        };
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
        const frontmatter: Record<string, unknown> = {
          name: skill.name,
          description: skill.meta.description ?? '',
        };
        const filepath = join(skillSubDir, 'SKILL.md');
        const content = serializeFrontmatter(frontmatter, skill.content);
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
