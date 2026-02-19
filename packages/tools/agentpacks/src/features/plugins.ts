import { readFileSync, existsSync } from 'fs';
import { basename, join } from 'path';
import { listFiles } from '../utils/filesystem.js';

/**
 * A parsed OpenCode plugin file (JS/TS).
 */
export interface ParsedPlugin {
  /** Filename without extension */
  name: string;
  /** Source file path */
  sourcePath: string;
  /** Pack that owns this plugin */
  packName: string;
  /** File content */
  content: string;
  /** File extension */
  extension: 'ts' | 'js';
}

/**
 * Parse all OpenCode plugin files from a pack's plugins/ directory.
 */
export function parsePlugins(
  packDir: string,
  packName: string
): ParsedPlugin[] {
  const pluginsDir = join(packDir, 'plugins');
  if (!existsSync(pluginsDir)) return [];

  const tsFiles = listFiles(pluginsDir, { extension: '.ts' });
  const jsFiles = listFiles(pluginsDir, { extension: '.js' });
  const allFiles = [...tsFiles, ...jsFiles];

  return allFiles.map((filepath) => parsePluginFile(filepath, packName));
}

/**
 * Parse a single plugin file.
 */
export function parsePluginFile(
  filepath: string,
  packName: string
): ParsedPlugin {
  const content = readFileSync(filepath, 'utf-8');
  const ext = filepath.endsWith('.ts') ? 'ts' : 'js';

  return {
    name: basename(filepath, `.${ext}`),
    sourcePath: filepath,
    packName,
    content,
    extension: ext as 'ts' | 'js',
  };
}
