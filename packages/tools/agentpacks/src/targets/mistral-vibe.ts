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
import { resolveModels } from '../core/profile-resolver.js';
import { generateModelGuidanceMarkdown } from '../utils/model-guidance.js';
import {
  writeGeneratedFile,
  writeGeneratedJson,
  removeIfExists,
  ensureDir,
} from '../utils/filesystem.js';

const TARGET_ID = 'mistralvibe';

/**
 * Mistral Vibe target generator.
 * Generates: .vibe/config.toml, .vibe/rules/, .vibe/agents/, .vibe/skills/,
 * .vibe/commands/, .vibe/mcp.json
 */
export class MistralVibeTarget extends BaseTarget {
  readonly id = TARGET_ID;
  readonly name = 'Mistral Vibe';

  readonly supportedFeatures: FeatureId[] = [
    'rules',
    'commands',
    'agents',
    'skills',
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

    const vibeDir = resolve(root, '.vibe');
    ensureDir(vibeDir);

    if (effective.includes('rules')) {
      const rulesDir = resolve(vibeDir, 'rules');
      if (deleteExisting) {
        removeIfExists(rulesDir);
        filesDeleted.push(rulesDir);
      }
      ensureDir(rulesDir);

      const rules = features.rules.filter((r) =>
        ruleMatchesTarget(r, TARGET_ID)
      );
      for (const rule of rules) {
        const filepath = join(rulesDir, `${rule.name}.md`);
        writeGeneratedFile(filepath, rule.content);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('agents')) {
      const agentsDir = resolve(vibeDir, 'agents');
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
      const skillsDir = resolve(vibeDir, 'skills');
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
        writeGeneratedFile(filepath, serializeSkill(skill));
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('commands')) {
      const commandsDir = resolve(vibeDir, 'commands');
      if (deleteExisting) {
        removeIfExists(commandsDir);
        filesDeleted.push(commandsDir);
      }
      ensureDir(commandsDir);

      const commands = features.commands.filter((c) =>
        commandMatchesTarget(c, TARGET_ID)
      );
      for (const command of commands) {
        const filepath = join(commandsDir, `${command.name}.md`);
        writeGeneratedFile(filepath, command.content);
        filesWritten.push(filepath);
      }
    }

    let hasMcpConfig = false;
    if (effective.includes('mcp')) {
      const mcpEntries = Object.entries(features.mcpServers);
      if (mcpEntries.length > 0) {
        const filepath = resolve(vibeDir, 'mcp.json');
        writeGeneratedJson(
          filepath,
          { mcpServers: features.mcpServers },
          {
            header: false,
          }
        );
        filesWritten.push(filepath);
        hasMcpConfig = true;
      }
    }

    if (effective.includes('ignore') && features.ignorePatterns.length > 0) {
      const filepath = resolve(root, '.vibeignore');
      writeGeneratedFile(filepath, features.ignorePatterns.join('\n') + '\n');
      filesWritten.push(filepath);
    }

    let defaultModel: string | undefined;
    let smallModel: string | undefined;
    if (effective.includes('models') && features.models) {
      const resolved = resolveModels(
        features.models,
        options.modelProfile,
        TARGET_ID
      );
      defaultModel = resolved.default;
      smallModel = resolved.small;

      const guidance = generateModelGuidanceMarkdown(resolved);
      if (guidance) {
        const filepath = join(vibeDir, 'model-config.md');
        writeGeneratedFile(filepath, guidance);
        filesWritten.push(filepath);
      }
    }

    const vibeConfig = buildVibeConfigToml({
      hasMcpConfig,
      defaultModel,
      smallModel,
      profile: options.modelProfile,
    });
    if (vibeConfig.length > 0) {
      const filepath = resolve(vibeDir, 'config.toml');
      writeGeneratedFile(filepath, vibeConfig);
      filesWritten.push(filepath);
    }

    return this.createResult(filesWritten, filesDeleted, warnings);
  }
}

function buildVibeConfigToml(options: {
  hasMcpConfig: boolean;
  defaultModel?: string;
  smallModel?: string;
  profile?: string;
}): string {
  const lines: string[] = [];

  if (options.defaultModel || options.smallModel || options.profile) {
    lines.push('[models]');
    if (options.defaultModel) {
      lines.push(`default = "${escapeTomlString(options.defaultModel)}"`);
    }
    if (options.smallModel) {
      lines.push(`small = "${escapeTomlString(options.smallModel)}"`);
    }
    if (options.profile) {
      lines.push(`profile = "${escapeTomlString(options.profile)}"`);
    }
    lines.push('');
  }

  if (options.hasMcpConfig) {
    lines.push('[mcp]');
    lines.push('config_path = ".vibe/mcp.json"');
    lines.push('');
  }

  return lines.join('\n').trim();
}

function escapeTomlString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
