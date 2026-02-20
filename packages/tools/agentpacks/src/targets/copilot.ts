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
import { resolveModels } from '../core/profile-resolver.js';
import { generateModelGuidanceMarkdown } from '../utils/model-guidance.js';
import {
  writeGeneratedFile,
  removeIfExists,
  ensureDir,
} from '../utils/filesystem.js';

const TARGET_ID = 'copilot';

/**
 * GitHub Copilot target generator.
 * Generates: .github/copilot-instructions.md, .github/copilot/agents/, .github/copilot/skills/
 */
export class CopilotTarget extends BaseTarget {
  readonly id = TARGET_ID;
  readonly name = 'GitHub Copilot';

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

    const githubDir = resolve(root, '.github');

    if (effective.includes('rules')) {
      const rules = features.rules.filter((r) =>
        ruleMatchesTarget(r, TARGET_ID)
      );

      if (rules.length > 0) {
        // All rules combined into copilot-instructions.md
        const combinedContent = rules.map((r) => r.content).join('\n\n---\n\n');
        const filepath = resolve(githubDir, 'copilot-instructions.md');
        ensureDir(githubDir);
        writeGeneratedFile(filepath, combinedContent);
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('agents')) {
      const copilotDir = resolve(githubDir, 'copilot');
      const agentsDir = resolve(copilotDir, 'agents');
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
      const copilotDir = resolve(githubDir, 'copilot');
      const skillsDir = resolve(copilotDir, 'skills');
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
      const copilotDir = resolve(githubDir, 'copilot');
      const commandsDir = resolve(copilotDir, 'commands');
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

    if (effective.includes('ignore')) {
      // Copilot does not have a dedicated ignore file; skip
    }

    // Models: generate guidance markdown
    if (effective.includes('models') && features.models) {
      const resolved = resolveModels(
        features.models,
        options.modelProfile,
        TARGET_ID
      );
      const guidance = generateModelGuidanceMarkdown(resolved);
      if (guidance) {
        const copilotDir = resolve(githubDir, 'copilot');
        ensureDir(copilotDir);
        const filepath = join(copilotDir, 'model-config.md');
        writeGeneratedFile(filepath, guidance);
        filesWritten.push(filepath);
      }
    }

    return this.createResult(filesWritten, filesDeleted, warnings);
  }
}
