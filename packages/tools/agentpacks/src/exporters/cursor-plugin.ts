/**
 * Export an agentpacks pack as a Cursor plugin.
 *
 * Cursor plugin structure:
 *   manifest.json — plugin metadata
 *   rules/*.mdc — rule files with frontmatter
 *   agents/*.md — agent definitions
 *   skills/<name>/SKILL.md — skill definitions
 *   commands/*.md — command definitions
 *   mcp.json — MCP server definitions (optional)
 */
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import type { LoadedPack } from '../core/pack-loader.js';
import { serializeFrontmatter } from '../utils/frontmatter.js';
import { ensureDir } from '../utils/filesystem.js';

/**
 * Cursor plugin manifest shape.
 */
interface CursorPluginManifest {
  name: string;
  version: string;
  description: string;
  author?: string;
  tags?: string[];
  rules?: string[];
  agents?: string[];
  skills?: string[];
  commands?: string[];
  mcp?: boolean;
}

/**
 * Export result.
 */
export interface CursorPluginExportResult {
  outputDir: string;
  filesWritten: string[];
  manifest: CursorPluginManifest;
}

/**
 * Export a loaded pack as a Cursor plugin directory.
 */
export function exportCursorPlugin(
  pack: LoadedPack,
  outputDir: string
): CursorPluginExportResult {
  const filesWritten: string[] = [];
  const pluginDir = resolve(outputDir, pack.manifest.name);
  mkdirSync(pluginDir, { recursive: true });

  const manifest: CursorPluginManifest = {
    name: pack.manifest.name,
    version: pack.manifest.version,
    description: pack.manifest.description,
  };

  if (pack.manifest.author) {
    manifest.author =
      typeof pack.manifest.author === 'string'
        ? pack.manifest.author
        : pack.manifest.author.name;
  }
  if (pack.manifest.tags.length > 0) {
    manifest.tags = pack.manifest.tags;
  }

  // Rules → .mdc files
  if (pack.rules.length > 0) {
    const rulesDir = join(pluginDir, 'rules');
    ensureDir(rulesDir);
    manifest.rules = [];

    for (const rule of pack.rules) {
      const cursorMeta = rule.meta.cursor ?? {};
      const fm: Record<string, unknown> = {
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
      if (globs) fm.globs = globs;

      const filename = `${rule.name}.mdc`;
      const filepath = join(rulesDir, filename);
      writeFileSync(filepath, serializeFrontmatter(fm, rule.content));
      filesWritten.push(filepath);
      manifest.rules.push(filename);
    }
  }

  // Agents
  if (pack.agents.length > 0) {
    const agentsDir = join(pluginDir, 'agents');
    ensureDir(agentsDir);
    manifest.agents = [];

    for (const agent of pack.agents) {
      const fm: Record<string, unknown> = {
        name: agent.name,
        description: agent.meta.description ?? '',
      };
      const filename = `${agent.name}.md`;
      const filepath = join(agentsDir, filename);
      writeFileSync(filepath, serializeFrontmatter(fm, agent.content));
      filesWritten.push(filepath);
      manifest.agents.push(filename);
    }
  }

  // Skills
  if (pack.skills.length > 0) {
    const skillsDir = join(pluginDir, 'skills');
    ensureDir(skillsDir);
    manifest.skills = [];

    for (const skill of pack.skills) {
      const skillSubDir = join(skillsDir, skill.name);
      ensureDir(skillSubDir);
      const fm: Record<string, unknown> = {
        name: skill.name,
        description: skill.meta.description ?? '',
      };
      const filepath = join(skillSubDir, 'SKILL.md');
      writeFileSync(filepath, serializeFrontmatter(fm, skill.content));
      filesWritten.push(filepath);
      manifest.skills.push(skill.name);
    }
  }

  // Commands
  if (pack.commands.length > 0) {
    const commandsDir = join(pluginDir, 'commands');
    ensureDir(commandsDir);
    manifest.commands = [];

    for (const cmd of pack.commands) {
      const filename = `${cmd.name}.md`;
      const filepath = join(commandsDir, filename);
      writeFileSync(filepath, cmd.content);
      filesWritten.push(filepath);
      manifest.commands.push(filename);
    }
  }

  // MCP
  if (pack.mcp && Object.keys(pack.mcp.servers).length > 0) {
    manifest.mcp = true;
    const filepath = join(pluginDir, 'mcp.json');
    writeFileSync(
      filepath,
      JSON.stringify({ mcpServers: pack.mcp.servers }, null, 2) + '\n'
    );
    filesWritten.push(filepath);
  }

  // Write manifest
  const manifestPath = join(pluginDir, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  filesWritten.push(manifestPath);

  return { outputDir: pluginDir, filesWritten, manifest };
}
