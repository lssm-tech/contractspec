/**
 * Fix path resolution utilities.
 */

import path from 'node:path';
import type { FixableIssue, FixOptions } from './types';

/**
 * Resolve the output file path for a new spec.
 *
 * Strategies:
 * 1. If outputDir is provided in options, use it.
 * 2. If featureFile is present, try to find the 'src' directory relative to it.
 * 3. Fallback to workspaceRoot/specs/[type]/...
 */
export function resolveOutputPath(
  issue: FixableIssue,
  options: FixOptions
): string {
  if (options.outputDir) {
    return buildPath(options.outputDir, issue.ref.key, issue.specType);
  }

  // Try to locate src directory from feature file
  if (issue.featureFile) {
    const srcDir = findSrcDir(issue.featureFile);
    if (srcDir) {
      return buildPath(srcDir, issue.ref.key, issue.specType);
    }
  }

  // Fallback to workspace root
  return buildPath(
    path.join(options.workspaceRoot, 'specs'),
    issue.ref.key,
    issue.specType
  );
}

/**
 * Find the 'src' directory by walking up from the file path.
 */
function findSrcDir(filePath: string): string | null {
  let current = path.dirname(filePath);
  const root = path.parse(filePath).root;

  // Safety break to prevent infinite loops
  let iterations = 0;
  while (current !== root && iterations < 50) {
    if (path.basename(current) === 'src') {
      return current;
    }
    // If we hit a package.json, we might assume src is inside (or we are at root)
    // But checking for 'src' explicit is safer for monorepo structures
    current = path.dirname(current);
    iterations++;
  }

  // Second pass: look for package.json and append /src
  current = path.dirname(filePath);
  iterations = 0;
  while (current !== root && iterations < 50) {
    // We can't synchronously check for file existence easily here without FS adapter access
    // passing FS adapter everywhere is annoying.
    // relying on 'src' convention in URL path string is often enough for now.
    // Let's rely on the first pass for "src" segment presence.
    current = path.dirname(current);
    iterations++;
  }

  // If the file path itself contains '/src/', extract it
  const srcIndex = filePath.lastIndexOf(`${path.sep}src${path.sep}`);
  if (srcIndex !== -1) {
    return filePath.substring(0, srcIndex + 5); // include /src/
  }

  return null;
}

/**
 * Build the full file path.
 */
function buildPath(baseDir: string, key: string, specType: string): string {
  // Convert key to file name
  // Logic:
  // - If key matches spec type (e.g. "billing" for a billing op), keep it simple
  // - Replace dots with dashes? Or keep dots? User mentioned "docs.search" -> "search.ts" or "search.operation.ts"
  // Let's try to be smart: if key namespace matches package/domain, simplify.

  // Simple for now: normalized key
  // "docs.search" -> "docs-search"
  // "search" -> "search"
  let fileName = key.replace(/\./g, '-').toLowerCase();

  // Optimization: if the key has multiple parts (domain.name), and we are placing it inside a domain folder?
  // Current requirement: just place in src/[type]s/

  const extension = getFileExtension(specType);
  const subDir = getSubDirectory(specType);

  return path.join(baseDir, subDir, `${fileName}${extension}`);
}

function getFileExtension(specType: string): string {
  const extensions: Record<string, string> = {
    operation: '.operation.ts', // Explicit .operation.ts preferred by user guidelines
    event: '.event.ts',
    presentation: '.presentation.ts',
    workflow: '.workflow.ts',
    'data-view': '.data-view.ts',
    form: '.form.ts',
    migration: '.migration.ts',
    experiment: '.experiment.ts',
    capability: '.capability.ts',
  };

  return extensions[specType] || '.ts';
}

function getSubDirectory(specType: string): string {
  const dirs: Record<string, string> = {
    operation: 'operations',
    event: 'events',
    presentation: 'presentations',
    workflow: 'workflows',
    'data-view': 'data-views',
    form: 'forms',
    migration: 'migrations',
    experiment: 'experiments',
    capability: 'capabilities',
  };

  return dirs[specType] || 'specs';
}
