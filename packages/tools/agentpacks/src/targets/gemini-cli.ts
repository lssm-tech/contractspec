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
import {
  writeGeneratedFile,
  writeGeneratedJson,
  removeIfExists,
  ensureDir,
} from '../utils/filesystem.js';

const TARGET_ID = 'geminicli';

/**
 * Gemini CLI target generator.
 * Generates: GEMINI.md, .gemini/memories/, .gemini/commands/, .gemini/settings.json
 */
export class GeminiCliTarget extends BaseTarget {
  readonly id = TARGET_ID;
  readonly name = 'Gemini CLI';

  readonly supportedFeatures: FeatureId[] = [
    'rules',
    'commands',
    'mcp',
    'ignore',
    'skills',
    'hooks',
  ];

  generate(options: GenerateOptions): GenerateResult {
    const { projectRoot, baseDir, features, enabledFeatures, deleteExisting } =
      options;
    const root = resolve(projectRoot, baseDir);
    const effective = this.getEffectiveFeatures(enabledFeatures);
    const filesWritten: string[] = [];
    const filesDeleted: string[] = [];
    const warnings: string[] = [];

    const geminiDir = resolve(root, '.gemini');

    if (effective.includes('rules')) {
      const rules = features.rules.filter((r) =>
        ruleMatchesTarget(r, TARGET_ID)
      );
      const rootRules = getRootRules(rules);
      const detailRules = getDetailRules(rules);

      // Root rules -> GEMINI.md
      if (rootRules.length > 0) {
        const geminiMd = rootRules.map((r) => r.content).join('\n\n');
        const filepath = resolve(root, 'GEMINI.md');
        writeGeneratedFile(filepath, geminiMd);
        filesWritten.push(filepath);
      }

      // Detail rules -> .gemini/memories/*.md
      if (detailRules.length > 0) {
        const memoriesDir = resolve(geminiDir, 'memories');
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

    if (effective.includes('commands')) {
      const commandsDir = resolve(geminiDir, 'commands');
      if (deleteExisting) {
        removeIfExists(commandsDir);
        filesDeleted.push(commandsDir);
      }
      ensureDir(commandsDir);

      const commands = features.commands.filter((c) =>
        commandMatchesTarget(c, TARGET_ID)
      );
      for (const cmd of commands) {
        // Gemini uses TOML format for commands
        const toml = buildGeminiCommand(
          cmd.name,
          cmd.meta.description ?? '',
          cmd.content
        );
        const filepath = join(commandsDir, `${cmd.name}.toml`);
        writeGeneratedFile(filepath, toml, { type: 'md' });
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('mcp')) {
      const mcpEntries = Object.entries(features.mcpServers);
      if (mcpEntries.length > 0) {
        const settings = buildGeminiSettings(features.mcpServers);
        const filepath = resolve(geminiDir, 'settings.json');
        writeGeneratedJson(filepath, settings, { header: false });
        filesWritten.push(filepath);
      }
    }

    if (effective.includes('ignore')) {
      if (features.ignorePatterns.length > 0) {
        const filepath = resolve(root, '.geminiignore');
        const content = features.ignorePatterns.join('\n') + '\n';
        writeGeneratedFile(filepath, content);
        filesWritten.push(filepath);
      }
    }

    return this.createResult(filesWritten, filesDeleted, warnings);
  }
}

function buildGeminiCommand(
  name: string,
  description: string,
  content: string
): string {
  return `[command]
name = "${name}"
description = "${description}"

[prompt]
content = """
${content}
"""
`;
}

function buildGeminiSettings(
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
    if (entry.command) {
      mcpServers[name] = {
        command: entry.command,
        ...(entry.args ? { args: entry.args } : {}),
        ...(entry.env ? { env: entry.env } : {}),
      };
    } else if (entry.url) {
      mcpServers[name] = { url: entry.url };
    }
  }

  return { mcpServers };
}
