import { readFileSync } from 'fs';
import { basename } from 'path';
import { listFiles } from '../utils/filesystem.js';
import { parseFrontmatter } from '../utils/frontmatter.js';

/**
 * Command frontmatter data.
 */
export interface CommandFrontmatter {
  description?: string;
  targets?: string[] | '*';
  /** Per-target overrides */
  copilot?: Record<string, unknown>;
  antigravity?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * A parsed command with metadata and content.
 */
export interface ParsedCommand {
  name: string;
  sourcePath: string;
  packName: string;
  meta: CommandFrontmatter;
  content: string;
}

/**
 * Parse all commands from a pack's commands/ directory.
 */
export function parseCommands(
  commandsDir: string,
  packName: string
): ParsedCommand[] {
  const files = listFiles(commandsDir, { extension: '.md' });
  return files.map((filepath) => parseCommandFile(filepath, packName));
}

/**
 * Parse a single command file.
 */
export function parseCommandFile(
  filepath: string,
  packName: string
): ParsedCommand {
  const raw = readFileSync(filepath, 'utf-8');
  const { data, content } = parseFrontmatter<CommandFrontmatter>(raw);

  return {
    name: basename(filepath, '.md'),
    sourcePath: filepath,
    packName,
    meta: data,
    content,
  };
}

/**
 * Check if a command targets a specific tool.
 */
export function commandMatchesTarget(
  cmd: ParsedCommand,
  targetId: string
): boolean {
  const { targets } = cmd.meta;
  if (!targets || targets === '*') return true;
  if (Array.isArray(targets) && targets.includes('*')) return true;
  return Array.isArray(targets) && targets.includes(targetId);
}
