/**
 * Sync service.
 *
 * Build (and optionally validate) all discovered specs, optionally repeating into
 * multiple output buckets (./generated/<bucket>/ or any output dir).
 */

import type { WorkspaceConfig } from '@lssm/module.contractspec-workspace';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';
import { buildSpec, type BuildSpecOptions } from './build';
import { validateSpec, type ValidateSpecResult } from './validate';

export interface SyncSpecsOptions {
  pattern?: string;
  outputDirs?: (string | undefined)[];
  validate?: boolean;
  buildOptions?: Omit<BuildSpecOptions, 'outputDir'>;
  dryRun?: boolean;
}

export interface SyncSpecsRunResult {
  specPath: string;
  outputDir?: string;
  validation?: ValidateSpecResult;
  build?: unknown;
  error?: {
    phase: 'validate' | 'build';
    message: string;
  };
}

export interface SyncSpecsResult {
  specs: string[];
  runs: SyncSpecsRunResult[];
}

export type SyncBuildFn<B> = (
  specPath: string,
  outputDir: string | undefined
) => Promise<B>;

export type SyncValidateFn = (specPath: string) => Promise<ValidateSpecResult>;

export async function syncSpecs(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  config: WorkspaceConfig,
  options: SyncSpecsOptions = {},
  overrides?: {
    build?: SyncBuildFn<unknown>;
    validate?: SyncValidateFn;
  }
): Promise<SyncSpecsResult> {
  const { fs, logger } = adapters;

  const specs = await fs.glob({ pattern: options.pattern });
  const outputDirs = options.outputDirs?.length
    ? options.outputDirs
    : [undefined];

  const runs: SyncSpecsRunResult[] = [];

  const validateFn: SyncValidateFn =
    overrides?.validate ??
    ((specPath) => validateSpec(specPath, { fs, logger }));

  const buildFn: SyncBuildFn<unknown> =
    overrides?.build ??
    ((specPath, outputDir) =>
      buildSpec(
        specPath,
        { fs, logger },
        outputDir ? { ...config, outputDir } : config,
        { ...(options.buildOptions ?? {}), outputDir }
      ));

  for (const specPath of specs) {
    for (const outputDir of outputDirs) {
      const run: SyncSpecsRunResult = { specPath, outputDir };

      if (options.validate) {
        try {
          run.validation = await validateFn(specPath);
        } catch (error) {
          run.error = {
            phase: 'validate',
            message: error instanceof Error ? error.message : String(error),
          };
          runs.push(run);
          continue;
        }
      }

      if (!options.dryRun) {
        try {
          run.build = await buildFn(specPath, outputDir);
        } catch (error) {
          run.error = {
            phase: 'build',
            message: error instanceof Error ? error.message : String(error),
          };
          runs.push(run);
          continue;
        }
      } else {
        logger.info('[dry-run] syncSpecs skipped build', {
          specPath,
          outputDir,
        });
      }

      runs.push(run);
    }
  }

  return { specs, runs };
}
