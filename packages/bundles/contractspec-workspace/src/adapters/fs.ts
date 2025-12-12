/**
 * Node.js filesystem adapter implementation.
 */

import {
  readFile,
  writeFile,
  mkdir,
  rm,
  stat as fsStat,
  access,
} from 'node:fs/promises';
import {
  resolve,
  dirname,
  basename,
  join,
  relative,
  isAbsolute,
} from 'node:path';
import { glob as globFn } from 'glob';
import type { FsAdapter, FileStat, DiscoverOptions } from '../ports/fs';

const DEFAULT_SPEC_PATTERNS = [
  '**/*.contracts.ts',
  '**/*.event.ts',
  '**/*.presentation.ts',
  '**/*.workflow.ts',
  '**/*.data-view.ts',
  '**/*.migration.ts',
  '**/*.telemetry.ts',
  '**/*.experiment.ts',
  '**/*.app-config.ts',
  '**/*.integration.ts',
  '**/*.knowledge.ts',
];

const DEFAULT_IGNORES = ['node_modules/**', 'dist/**', '.turbo/**'];

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

      const all: string[] = [];
      for (const pattern of patterns) {
        const matches = await globFn(pattern, {
          cwd: baseCwd,
          ignore,
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
