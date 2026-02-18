/**
 * Metarepo support — discover and manage agentpacks across nested repos.
 * A metarepo contains multiple sub-repositories, each potentially with
 * their own agentpacks.jsonc configuration.
 */
import { existsSync, readdirSync, statSync } from 'fs';
import { resolve, join, relative } from 'path';
import type { WorkspaceConfig } from './config.js';
import { loadWorkspaceConfig } from './config.js';

/**
 * A discovered sub-repo within a metarepo.
 */
export interface MetarepoEntry {
  /** Relative path from metarepo root */
  path: string;
  /** Absolute path */
  absolutePath: string;
  /** Whether it has agentpacks config */
  hasConfig: boolean;
  /** Loaded config (if hasConfig) */
  config: WorkspaceConfig | null;
}

/**
 * Discover sub-repos in a metarepo root.
 * Looks for directories containing agentpacks.jsonc or package.json.
 */
export function discoverMetarepoEntries(
  metarepoRoot: string,
  options: { maxDepth?: number } = {}
): MetarepoEntry[] {
  const maxDepth = options.maxDepth ?? 2;
  const entries: MetarepoEntry[] = [];

  scanDir(metarepoRoot, metarepoRoot, 0, maxDepth, entries);
  return entries;
}

/**
 * Recursively scan for sub-repo directories.
 */
function scanDir(
  root: string,
  dir: string,
  depth: number,
  maxDepth: number,
  entries: MetarepoEntry[]
): void {
  if (depth > maxDepth) return;

  const children = readdirSync(dir, { withFileTypes: true });
  for (const child of children) {
    if (!child.isDirectory()) continue;
    if (child.name.startsWith('.') || child.name === 'node_modules') continue;

    const childPath = join(dir, child.name);
    const hasConfig =
      existsSync(join(childPath, 'agentpacks.jsonc')) ||
      existsSync(join(childPath, 'agentpacks.local.jsonc'));

    const hasPackageJson = existsSync(join(childPath, 'package.json'));

    if (hasConfig || hasPackageJson) {
      let config: WorkspaceConfig | null = null;
      if (hasConfig) {
        try {
          config = loadWorkspaceConfig(childPath);
        } catch {
          config = null;
        }
      }

      entries.push({
        path: relative(root, childPath),
        absolutePath: childPath,
        hasConfig,
        config,
      });
    }

    // Continue scanning deeper (e.g. packages/tools/agentpacks)
    scanDir(root, childPath, depth + 1, maxDepth, entries);
  }
}

/**
 * Generate for all discovered sub-repos in a metarepo.
 * Returns paths that were processed.
 */
export function getMetarepoBaseDirs(metarepoRoot: string): string[] {
  const entries = discoverMetarepoEntries(metarepoRoot);
  return entries.filter((e) => e.hasConfig).map((e) => e.path);
}
