/**
 * Generic markdown-based target generator factory.
 * Many AI coding tools share a similar pattern:
 *   - Root config directory (e.g. .cline/, .windsurf/, .kiro/)
 *   - rules/*.md files
 *   - Optional: mcp.json, ignore file
 *
 * This factory creates targets for tools that follow this pattern.
 */
import { resolve, join } from 'path';
import type { FeatureId } from '../core/config.js';
import {
  BaseTarget,
  type GenerateOptions,
  type GenerateResult,
} from './base-target.js';
import { ruleMatchesTarget } from '../features/rules.js';
import { commandMatchesTarget } from '../features/commands.js';
import { resolveModels } from '../core/profile-resolver.js';
import { generateModelGuidanceMarkdown } from '../utils/model-guidance.js';
import {
  writeGeneratedFile,
  writeGeneratedJson,
  removeIfExists,
  ensureDir,
} from '../utils/filesystem.js';

/**
 * Configuration for a generic markdown target.
 */
export interface GenericMdTargetConfig {
  id: string;
  name: string;
  /** Directory name under project root (e.g. ".cline", ".windsurf") */
  configDir: string;
  /** Features supported by this target */
  supportedFeatures: FeatureId[];
  /** Name for the rules subdirectory (default: "rules") */
  rulesDir?: string;
  /** File extension for rules (default: ".md") */
  ruleExtension?: string;
  /** Name of the ignore file (e.g. ".clineignore") or null for no ignore */
  ignoreFile?: string | null;
  /** Whether MCP config goes inside configDir or project root */
  mcpInConfigDir?: boolean;
}

/**
 * Create a target generator from a generic markdown config.
 */
export function createGenericMdTarget(
  config: GenericMdTargetConfig
): BaseTarget {
  return new GenericMdTarget(config);
}

class GenericMdTarget extends BaseTarget {
  readonly id: string;
  readonly name: string;
  readonly supportedFeatures: FeatureId[];
  private config: GenericMdTargetConfig;

  constructor(config: GenericMdTargetConfig) {
    super();
    this.id = config.id;
    this.name = config.name;
    this.supportedFeatures = config.supportedFeatures;
    this.config = config;
  }

  generate(options: GenerateOptions): GenerateResult {
    const { projectRoot, baseDir, features, enabledFeatures, deleteExisting } =
      options;
    const root = resolve(projectRoot, baseDir);
    const effective = this.getEffectiveFeatures(enabledFeatures);
    const filesWritten: string[] = [];
    const filesDeleted: string[] = [];
    const warnings: string[] = [];

    const configDir = resolve(root, this.config.configDir);
    const rulesSubDir = this.config.rulesDir ?? 'rules';
    const ext = this.config.ruleExtension ?? '.md';

    // Rules
    if (effective.includes('rules')) {
      const rulesDir = resolve(configDir, rulesSubDir);
      if (deleteExisting) {
        removeIfExists(rulesDir);
        filesDeleted.push(rulesDir);
      }
      ensureDir(rulesDir);

      const rules = features.rules.filter((r) => ruleMatchesTarget(r, this.id));
      for (const rule of rules) {
        const filepath = join(rulesDir, `${rule.name}${ext}`);
        writeGeneratedFile(filepath, rule.content);
        filesWritten.push(filepath);
      }
    }

    // Commands
    if (effective.includes('commands')) {
      const commandsDir = resolve(configDir, 'commands');
      if (deleteExisting) {
        removeIfExists(commandsDir);
        filesDeleted.push(commandsDir);
      }
      ensureDir(commandsDir);

      const commands = features.commands.filter((c) =>
        commandMatchesTarget(c, this.id)
      );
      for (const cmd of commands) {
        const filepath = join(commandsDir, `${cmd.name}.md`);
        writeGeneratedFile(filepath, cmd.content);
        filesWritten.push(filepath);
      }
    }

    // MCP
    if (effective.includes('mcp')) {
      const mcpEntries = Object.entries(features.mcpServers);
      if (mcpEntries.length > 0) {
        const mcpDir = this.config.mcpInConfigDir ? configDir : root;
        const filepath = resolve(mcpDir, 'mcp.json');
        writeGeneratedJson(
          filepath,
          { mcpServers: features.mcpServers },
          {
            header: false,
          }
        );
        filesWritten.push(filepath);
      }
    }

    // Ignore
    if (effective.includes('ignore') && this.config.ignoreFile) {
      if (features.ignorePatterns.length > 0) {
        const filepath = resolve(root, this.config.ignoreFile);
        writeGeneratedFile(filepath, features.ignorePatterns.join('\n') + '\n');
        filesWritten.push(filepath);
      }
    }

    // Models: generate guidance markdown
    if (effective.includes('models') && features.models) {
      const resolved = resolveModels(
        features.models,
        options.modelProfile,
        this.id
      );
      const guidance = generateModelGuidanceMarkdown(resolved);
      if (guidance) {
        ensureDir(configDir);
        const filepath = join(configDir, 'model-config.md');
        writeGeneratedFile(filepath, guidance);
        filesWritten.push(filepath);
      }
    }

    return this.createResult(filesWritten, filesDeleted, warnings);
  }
}
