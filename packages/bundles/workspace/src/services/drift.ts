/**
 * Drift detection service.
 *
 * Detects when generated artifacts are out of sync with their source specs.
 */

import path from 'path';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import type { WorkspaceAdapters } from '../ports/logger';
import { generateArtifacts } from './generate-artifacts';

/**
 * Result of drift detection.
 */
export interface DriftResult {
  /** Whether drift was detected. */
  hasDrift: boolean;
  /** Relative paths of files with drift. */
  files: string[];
}

/**
 * Detect drift between generated artifacts and source specs.
 *
 * Generates artifacts to a temporary directory and compares against
 * the existing generated directory to find differences.
 *
 * @param adapters - Workspace adapters for file operations
 * @param contractsDir - Directory containing source contracts
 * @param generatedDir - Directory containing generated artifacts
 * @returns Result indicating if drift exists and which files are affected
 */
export async function detectDrift(
  adapters: WorkspaceAdapters,
  contractsDir: string,
  generatedDir: string
): Promise<DriftResult> {
  // 1. Create temp directory
  const tempDir = await mkdtemp(path.join(tmpdir(), 'contractspec-drift-'));

  try {
    // 2. Generate artifacts to temp dir
    // We assume generateArtifacts mimics the structure of generatedDir inside tempDir
    // But generateArtifacts usage in generate-artifacts.ts is:
    // const docsDir = path.join(generatedDir, 'docs');
    // It uses generatedDir as root.

    await generateArtifacts(adapters, contractsDir, tempDir);

    // 3. Compare tempDir with generatedDir
    // We only care about files that exist in tempDir (should match generatedDir)
    // AND files in generatedDir that shouldn't be there?
    // "Generated: configurable generated root..., never hand-edited"
    // So distinct(temp) == distinct(generated).

    const differences: string[] = [];

    // Use node:fs for walking directories
    const fs = await import('node:fs/promises');

    async function getFiles(dir: string): Promise<string[]> {
      const dirents = await fs.readdir(dir, { withFileTypes: true });
      const files: string[] = [];
      for (const dirent of dirents) {
        const res = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
          files.push(...(await getFiles(res)));
        } else {
          files.push(res);
        }
      }
      return files;
    }

    // Get all files from both, relative to root
    const getRelativeFiles = async (root: string) => {
      if (!(await fs.stat(root).catch(() => false))) return [];
      const files = await getFiles(root);
      return files.map((f) => path.relative(root, f)).sort();
    };

    const tempFiles = await getRelativeFiles(tempDir);
    const existingFiles = await getRelativeFiles(generatedDir);

    const allFiles = new Set([...tempFiles, ...existingFiles]);

    for (const file of allFiles) {
      // Files in temp (expected) but not in existing
      if (!existingFiles.includes(file)) {
        differences.push(file); // Missing in existing (drift: outdated/incomplete)
        continue;
      }

      // Files in existing but not in temp
      if (!tempFiles.includes(file)) {
        differences.push(file); // Extra file in generated (drift: polluted)
        continue;
      }

      // Content comparison
      const tempContent = await fs.readFile(path.join(tempDir, file));
      const existingContent = await fs.readFile(path.join(generatedDir, file));

      if (!tempContent.equals(existingContent)) {
        differences.push(file); // Content mismatch
      }
    }

    return {
      hasDrift: differences.length > 0,
      files: differences,
    };
  } finally {
    // 4. Cleanup
    await rm(tempDir, { recursive: true, force: true });
  }
}
