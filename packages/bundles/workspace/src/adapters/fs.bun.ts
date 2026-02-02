/**
 * Node.js filesystem adapter implementation.
 */

import { mkdir, stat as fsStat } from 'node:fs/promises';
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from 'node:path';
import type { DiscoverOptions, FileStat, FsAdapter } from '../ports/fs';
import { DEFAULT_FS_IGNORES, DEFAULT_SPEC_PATTERNS } from './fs';
import { glob as globFn } from 'glob';

/**
 * Create a Bun filesystem adapter.
 */
export function createBunFsAdapter(cwd?: string): FsAdapter {
  const baseCwd = cwd ?? process.cwd();

  return {
    async exists(path: string): Promise<boolean> {
      const file = Bun.file(resolvePath(path));
      try {
        await file.exists();
        return true;
      } catch {
        return false;
      }
    },

    async readFile(path: string): Promise<string> {
      const file = Bun.file(resolvePath(path));
      return file.text();
    },

    async writeFile(path: string, content: string): Promise<void> {
      const fullPath = resolvePath(path);
      await Bun.write(fullPath, content);
    },

    async remove(path: string): Promise<void> {
      const file = Bun.file(resolvePath(path));
      await file.delete();
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
      const ignore = options.ignore ?? DEFAULT_FS_IGNORES;
      // Use provided cwd or fall back to adapter's baseCwd
      const globCwd = options.cwd ?? baseCwd;
      // Default to absolute paths for safer file operations
      const absolute = options.absolute ?? true;

      const matches = await globFn(patterns, {
        cwd: globCwd,
        ignore,
        absolute,
      });

      return matches;
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
