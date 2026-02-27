/**
 * Export an agentpacks pack as a Cursor plugin.
 *
 * Cursor plugin structure:
 *   .cursor-plugin/plugin.json — required plugin manifest
 *   rules/*.mdc — rule files with frontmatter
 *   agents/*.md — agent definitions
 *   skills/<name>/SKILL.md — skill definitions
 *   commands/*.md — command definitions
 *   hooks/hooks.json — hook definitions (optional)
 *   .mcp.json — MCP server definitions (optional)
 */
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import type { LoadedPack } from '../core/pack-loader.js';
import { resolveHooksForTarget } from '../features/hooks.js';
import { buildSkillFrontmatter } from '../features/skills.js';
import { serializeFrontmatter } from '../utils/frontmatter.js';
import { ensureDir } from '../utils/filesystem.js';

interface CursorPluginAuthor {
  name: string;
  email?: string;
}

interface CursorPluginManifest {
  name: string;
  version?: string;
  description?: string;
  author?: CursorPluginAuthor;
  homepage?: string;
  repository?: string;
  license?: string;
  logo?: string;
  keywords?: string[];
  rules?: string | string[];
  agents?: string | string[];
  skills?: string | string[];
  commands?: string | string[];
  hooks?: string | Record<string, unknown>;
  mcpServers?:
    | string
    | Record<string, unknown>
    | (string | Record<string, unknown>)[];
}

export interface CursorPluginExportResult {
  outputDir: string;
  filesWritten: string[];
  manifest: CursorPluginManifest;
}

export function exportCursorPlugin(
  pack: LoadedPack,
  outputDir: string
): CursorPluginExportResult {
  const filesWritten: string[] = [];
  const pluginName = normalizeCursorPluginName(pack.manifest.name);
  const pluginDir = resolve(outputDir, pluginName);
  mkdirSync(pluginDir, { recursive: true });

  const manifest: CursorPluginManifest = {
    name: pluginName,
  };

  if (pack.manifest.version) {
    manifest.version = pack.manifest.version;
  }
  if (pack.manifest.description) {
    manifest.description = pack.manifest.description;
  }

  const author = toCursorPluginAuthor(pack.manifest.author);
  if (author) {
    manifest.author = author;
  }

  if (pack.manifest.homepage) {
    manifest.homepage = pack.manifest.homepage;
  }
  if (pack.manifest.repository) {
    manifest.repository =
      typeof pack.manifest.repository === 'string'
        ? pack.manifest.repository
        : pack.manifest.repository.url;
  }
  if (pack.manifest.license) {
    manifest.license = pack.manifest.license;
  }
  if (pack.manifest.logo) {
    manifest.logo = pack.manifest.logo;
  }

  if (pack.manifest.tags.length > 0) {
    manifest.keywords = pack.manifest.tags;
  }

  if (pack.rules.length > 0) {
    const rulesDir = join(pluginDir, 'rules');
    ensureDir(rulesDir);
    manifest.rules = 'rules';

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
    }
  }

  if (pack.agents.length > 0) {
    const agentsDir = join(pluginDir, 'agents');
    ensureDir(agentsDir);
    manifest.agents = 'agents';

    for (const agent of pack.agents) {
      const fm: Record<string, unknown> = {
        name: agent.name,
        description: agent.meta.description ?? '',
      };
      const filename = `${agent.name}.md`;
      const filepath = join(agentsDir, filename);
      writeFileSync(filepath, serializeFrontmatter(fm, agent.content));
      filesWritten.push(filepath);
    }
  }

  if (pack.skills.length > 0) {
    const skillsDir = join(pluginDir, 'skills');
    ensureDir(skillsDir);
    manifest.skills = 'skills';

    for (const skill of pack.skills) {
      const skillSubDir = join(skillsDir, skill.name);
      ensureDir(skillSubDir);
      const filepath = join(skillSubDir, 'SKILL.md');
      const content = serializeFrontmatter(
        buildSkillFrontmatter(skill),
        skill.content
      );
      writeFileSync(filepath, content);
      filesWritten.push(filepath);
    }
  }

  if (pack.commands.length > 0) {
    const commandsDir = join(pluginDir, 'commands');
    ensureDir(commandsDir);
    manifest.commands = 'commands';

    for (const cmd of pack.commands) {
      const fm: Record<string, unknown> = {
        name: cmd.name,
      };
      if (cmd.meta.description) {
        fm.description = cmd.meta.description;
      }

      const filename = `${cmd.name}.md`;
      const filepath = join(commandsDir, filename);
      writeFileSync(filepath, serializeFrontmatter(fm, cmd.content));
      filesWritten.push(filepath);
    }
  }

  if (pack.hooks) {
    const events = resolveHooksForTarget(pack.hooks, 'cursor');
    if (Object.keys(events).length > 0) {
      const hooksDir = join(pluginDir, 'hooks');
      ensureDir(hooksDir);
      const filepath = join(hooksDir, 'hooks.json');
      writeFileSync(
        filepath,
        JSON.stringify(
          { version: pack.hooks.version ?? 1, hooks: events },
          null,
          2
        ) + '\n'
      );
      filesWritten.push(filepath);
      manifest.hooks = 'hooks/hooks.json';
    }
  }

  if (pack.mcp && Object.keys(pack.mcp.servers).length > 0) {
    manifest.mcpServers = '.mcp.json';
    const filepath = join(pluginDir, '.mcp.json');
    writeFileSync(
      filepath,
      JSON.stringify({ mcpServers: pack.mcp.servers }, null, 2) + '\n'
    );
    filesWritten.push(filepath);
  }

  const manifestDir = join(pluginDir, '.cursor-plugin');
  ensureDir(manifestDir);
  const manifestPath = join(manifestDir, 'plugin.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  filesWritten.push(manifestPath);

  return { outputDir: pluginDir, filesWritten, manifest };
}

function normalizeCursorPluginName(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[^a-z0-9]+/, '')
    .replace(/[^a-z0-9]+$/, '');

  return normalized.length > 0 ? normalized : 'agentpacks-plugin';
}

function toCursorPluginAuthor(
  author: LoadedPack['manifest']['author']
): CursorPluginAuthor | null {
  if (!author) {
    return null;
  }

  if (typeof author === 'string') {
    return { name: author };
  }

  return {
    name: author.name,
    ...(author.email ? { email: author.email } : {}),
  };
}
