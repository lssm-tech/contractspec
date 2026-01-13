/**
 * Context export service.
 *
 * Exports a safe context bundle for AI agents.
 */

import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { glob } from 'glob';
import { findWorkspaceRoot } from '../../adapters/workspace';
import { loadVibeConfig } from './config';

const DEFAULT_IGNORES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.git/**',
  '**/.env*',
  '**/id_rsa',
  '**/*.pem',
  '**/*.key',
  '**/secrets.*',
];

export interface ContextExportResult {
  success: boolean;
  files: string[];
  indexPath: string;
  error?: string;
}

/**
 * Export a context bundle for AI agents.
 */
export async function exportContext(
  cwd?: string
): Promise<ContextExportResult> {
  const workingDir = cwd ?? process.cwd();
  const root = findWorkspaceRoot(workingDir) ?? workingDir;
  const config = await loadVibeConfig(workingDir);

  const contextDir = join(root, '.contractspec', 'context');
  const contextFilesDir = join(contextDir, 'files');

  // Prepare ignore list
  let ignorePatterns = [...DEFAULT_IGNORES];

  // Read .gitignore
  const gitignorePath = join(root, '.gitignore');
  if (existsSync(gitignorePath)) {
    const gitignoreContent = await readFile(gitignorePath, 'utf-8');
    const gitIgnores = gitignoreContent
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));
    ignorePatterns = [...ignorePatterns, ...gitIgnores];
  }

  // Resolve allowlist
  const allowlist =
    config.contextExportAllowlist.length > 0
      ? config.contextExportAllowlist
      : ['README.md', 'package.json', 'contracts/**/*.ts'];

  const files: string[] = [];

  for (const pattern of allowlist) {
    const matches = await glob(pattern, {
      cwd: root,
      ignore: ignorePatterns,
      nodir: true,
      dot: true,
    });
    files.push(...matches);
  }

  // Deduplicate
  const uniqueFiles = Array.from(new Set(files)).sort();

  if (uniqueFiles.length === 0) {
    return {
      success: false,
      files: [],
      indexPath: '',
      error: 'No files matched the allowlist. Check your config.',
    };
  }

  await mkdir(contextFilesDir, { recursive: true });

  // Copy files
  const exportedFiles: { path: string; size: number }[] = [];

  for (const file of uniqueFiles) {
    const absSource = join(root, file);
    const absDest = join(contextFilesDir, file);

    await mkdir(dirname(absDest), { recursive: true });
    await copyFile(absSource, absDest);

    exportedFiles.push({ path: file, size: 0 });
  }

  // Create index.json
  const indexPath = join(contextDir, 'index.json');
  const index = {
    generatedAt: new Date().toISOString(),
    files: exportedFiles.map((f) => f.path),
    config: {
      allowlist: config.contextExportAllowlist,
      ignores: ignorePatterns.length,
    },
  };

  await writeFile(indexPath, JSON.stringify(index, null, 2));

  return {
    success: true,
    files: uniqueFiles,
    indexPath,
  };
}
