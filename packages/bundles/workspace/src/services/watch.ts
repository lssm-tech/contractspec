/**
 * Watch service.
 *
 * Provides a reusable watcher that can trigger validate/build on spec changes.
 */

import type { LoggerAdapter } from '../ports/logger';
import type { Watcher, WatcherAdapter, WatchOptions } from '../ports/watcher';
import type { FsAdapter } from '../ports/fs';
import { buildSpec } from './build';
import { validateSpec } from './validate';
import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';

export interface WatchSpecsOptions extends WatchOptions {
  runValidate?: boolean;
  runBuild?: boolean;
  dryRun?: boolean;
}

export type WatchBuildFn = (specPath: string) => Promise<void>;
export type WatchValidateFn = (specPath: string) => Promise<void>;

export function watchSpecs(
  adapters: { watcher: WatcherAdapter; fs: FsAdapter; logger: LoggerAdapter },
  config: ResolvedContractsrcConfig,
  options: WatchSpecsOptions,
  overrides?: {
    validate?: WatchValidateFn;
    build?: WatchBuildFn;
  }
): Watcher {
  const { watcher, fs, logger } = adapters;
  const w = watcher.watch(options);

  const validateFn: WatchValidateFn =
    overrides?.validate ??
    (async (specPath) => {
      await validateSpec(specPath, { fs, logger });
    });

  const buildFn: WatchBuildFn =
    overrides?.build ??
    (async (specPath) => {
      await buildSpec(specPath, { fs, logger }, config);
    });

  w.on(async (event) => {
    if (event.type !== 'change') return;

    logger.info('watchSpecs.changed', { path: event.path });

    if (options.runValidate) {
      await validateFn(event.path);
    }

    if (options.runBuild) {
      if (options.dryRun) {
        logger.info('[dry-run] watchSpecs skipped build', { path: event.path });
      } else {
        await buildFn(event.path);
      }
    }
  });

  return w;
}
