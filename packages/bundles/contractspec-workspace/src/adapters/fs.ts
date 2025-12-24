/**
 * Node.js filesystem adapter implementation.
 */

import {
  access,
  mkdir,
  readFile,
  rm,
  stat as fsStat,
  writeFile,
} from 'node:fs/promises';
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from 'node:path';
import { glob as globFn } from 'glob';
import type { DiscoverOptions, FileStat, FsAdapter } from '../ports/fs';

const DEFAULT_SPEC_PATTERNS = [
  // Standard dot-prefixed naming convention
  '**/*.operation.ts',
  '**/*.operations.ts',
  '**/*.event.ts',
  '**/*.presentation.ts',
  '**/*.feature.ts',
  '**/*.capability.ts',
  '**/*.workflow.ts',
  '**/*.data-view.ts',
  '**/*.form.ts',
  '**/*.migration.ts',
  '**/*.telemetry.ts',
  '**/*.experiment.ts',
  '**/*.app-config.ts',
  '**/*.integration.ts',
  '**/*.knowledge.ts',
  '**/*.policy.ts',
  '**/*.test-spec.ts',
  // Directory-based patterns (contracts/ and operations/ directories)
  '**/contracts/*.ts',
  '**/contracts/index.ts',
  '**/operations/*.ts',
  '**/operations/index.ts',
  // Standalone file patterns (events.ts, presentations.ts)
  '**/operations.ts',
  '**/events.ts',
  '**/presentations.ts',
  // Directory index patterns (/events/index.ts, /presentations/index.ts)
  '**/events/index.ts',
  '**/presentations/index.ts',
];

const DEFAULT_IGNORES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.turbo/**',
  '**/.next/**',
  '**/build/**',
  '**/coverage/**',
  '**/*.d.ts',
];

/**
 * Create a Node.js filesystem adapter.
 */
export function createNodeFsAdapter(cwd?: string): FsAdapter {
  const baseCwd = cwd ?? process.cwd();

  return {
    async exists(path: string): Promise<boolean> {
      try {
        await access(resolvePath(path));
        return true;
      } catch {
        return false;
      }
    },

    async readFile(path: string): Promise<string> {
      return readFile(resolvePath(path), 'utf-8');
    },

    async writeFile(path: string, content: string): Promise<void> {
      const fullPath = resolvePath(path);
      const dir = dirname(fullPath);
      await mkdir(dir, { recursive: true });
      await writeFile(fullPath, content, 'utf-8');
    },

    async remove(path: string): Promise<void> {
      await rm(resolvePath(path), { recursive: true, force: true });
    },

    async stat(path: string): Promise<FileStat> {
      const stats = await fsStat(resolvePath(path));
      return {
        size: stats.size,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        mtime: stats.mtime,
      };
    },

    async mkdir(path: string): Promise<void> {
      await mkdir(resolvePath(path), { recursive: true });
    },

    async glob(options: DiscoverOptions): Promise<string[]> {
      const patterns =
        options.patterns ??
        (options.pattern ? [options.pattern] : DEFAULT_SPEC_PATTERNS);
      const ignore = options.ignore ?? DEFAULT_IGNORES;
      // Use provided cwd or fall back to adapter's baseCwd
      const globCwd = options.cwd ?? baseCwd;
      // Default to absolute paths for safer file operations
      const absolute = options.absolute ?? true;

      const all: string[] = [];
      for (const pattern of patterns) {
        const matches = await globFn(pattern, {
          cwd: globCwd,
          ignore,
          absolute,
        });
        all.push(...matches);
      }

      return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
    },

    resolve(...paths: string[]): string {
      const [first, ...rest] = paths;
      if (!first) return baseCwd;
      return resolve(baseCwd, first, ...rest);
    },

    dirname(path: string): string {
      return dirname(path);
    },

    basename(path: string): string {
      return basename(path);
    },

    join(...paths: string[]): string {
      return join(...paths);
    },

    relative(from: string, to: string): string {
      return relative(from, to);
    },
  };

  function resolvePath(path: string): string {
    return isAbsolute(path) ? path : resolve(baseCwd, path);
  }
}
