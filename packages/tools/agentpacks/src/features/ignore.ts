import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Parsed ignore patterns.
 */
export interface ParsedIgnore {
  packName: string;
  sourcePath: string;
  patterns: string[];
}

/** Possible ignore file names within a pack */
const IGNORE_FILES = ['ignore', '.aiignore'] as const;

/**
 * Parse ignore patterns from a pack.
 * Checks for `ignore` and `.aiignore` files.
 */
export function parseIgnore(
  packDir: string,
  packName: string
): ParsedIgnore | null {
  for (const filename of IGNORE_FILES) {
    const filepath = join(packDir, filename);
    if (existsSync(filepath)) {
      const raw = readFileSync(filepath, 'utf-8');
      const patterns = parseIgnoreContent(raw);
      return {
        packName,
        sourcePath: filepath,
        patterns,
      };
    }
  }

  return null;
}

/**
 * Parse ignore file content into patterns (strips comments and blanks).
 */
export function parseIgnoreContent(content: string): string[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}

/**
 * Merge multiple ignore configs. All patterns are combined (additive).
 */
export function mergeIgnorePatterns(configs: ParsedIgnore[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const config of configs) {
    for (const pattern of config.patterns) {
      if (!seen.has(pattern)) {
        seen.add(pattern);
        result.push(pattern);
      }
    }
  }

  return result;
}
