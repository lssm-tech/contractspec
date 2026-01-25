/**
 * Node.js git adapter implementation.
 */

import { execSync } from 'node:child_process';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { GitAdapter, GitCleanOptions, GitLogEntry } from '../ports/git';

/**
 * Create a Node.js git adapter.
 */
export function createNodeGitAdapter(cwd?: string): GitAdapter {
  const baseCwd = cwd ?? process.cwd();

  return {
    async showFile(ref: string, filePath: string): Promise<string> {
      try {
        return execSync(`git show ${ref}:${filePath}`, {
          cwd: baseCwd,
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'pipe'],
        });
      } catch (error) {
        throw new Error(
          `Could not load ${filePath} at ref ${ref}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    },

    async clean(options?: GitCleanOptions): Promise<void> {
      const flags: string[] = [];
      if (options?.force) flags.push('-f');
      if (options?.directories) flags.push('-d');
      if (options?.ignored) flags.push('-x');
      if (options?.dryRun) flags.push('--dry-run');

      execSync(`git clean ${flags.join(' ')}`, {
        cwd: baseCwd,
        stdio: 'inherit',
      });
    },

    async isGitRepo(path?: string): Promise<boolean> {
      const targetPath = path ? resolve(baseCwd, path) : baseCwd;
      try {
        await access(resolve(targetPath, '.git'));
        return true;
      } catch {
        return false;
      }
    },

    async log(baseline?: string): Promise<GitLogEntry[]> {
      const ref = baseline ?? 'HEAD~10';
      const format = '--format=%H|||%s|||%an|||%aI';

      try {
        const output = execSync(`git log ${ref}..HEAD ${format}`, {
          cwd: baseCwd,
          encoding: 'utf-8',
          stdio: ['ignore', 'pipe', 'pipe'],
        });

        const entries: GitLogEntry[] = [];

        for (const line of output.trim().split('\n')) {
          if (!line) continue;
          const [hash, message, author, date] = line.split('|||');
          if (hash && message) {
            entries.push({ hash, message, author, date });
          }
        }

        return entries;
      } catch {
        // Return empty if git log fails (e.g., not enough commits)
        return [];
      }
    },

    async diffFiles(baseline: string, patterns?: string[]): Promise<string[]> {
      try {
        const pathSpecs =
          patterns && patterns.length > 0
            ? `-- ${patterns.map((p) => `'${p}'`).join(' ')}`
            : '';

        const output = execSync(
          `git diff --name-only ${baseline}...HEAD ${pathSpecs}`,
          {
            cwd: baseCwd,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'pipe'],
          }
        );

        return output.trim().split('\n').filter(Boolean);
      } catch {
        // Return empty array if diff fails (e.g., baseline doesn't exist)
        return [];
      }
    },
  };
}
