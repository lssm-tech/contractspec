/**
 * OpenAPI sync service - syncs specs with OpenAPI sources.
 */

import {
  importFromOpenApi,
  parseOpenApi,
} from '@contractspec/lib.contracts-transformers/openapi';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import type {
  OpenApiSyncServiceOptions,
  OpenApiSyncServiceResult,
} from './types';
import { dirname, join } from 'path';
import type { ContractsrcConfig } from '@contractspec/lib.contracts';

/**
 * Sync ContractSpec specs with OpenAPI sources.
 */
export async function syncWithOpenApiService(
  options: OpenApiSyncServiceOptions,
  config: ContractsrcConfig,
  adapters: { fs: FsAdapter; logger: LoggerAdapter }
): Promise<OpenApiSyncServiceResult> {
  const { fs, logger } = adapters;
  const {
    sources: optSources,
    sourceName,
    interactive,
    force,
    dryRun,
  } = options;
  const { outputDir } = config;

  // Determine which sources to sync
  let sourcesToSync = optSources ?? config.openapi?.sources ?? [];

  if (sourceName) {
    sourcesToSync = sourcesToSync.filter((s) => s.name === sourceName);
    if (sourcesToSync.length === 0) {
      throw new Error(`Source not found: ${sourceName}`);
    }
  }

  if (sourcesToSync.length === 0) {
    logger.warn(
      'No OpenAPI sources configured. Add sources to .contractsrc.json'
    );
    return {
      added: 0,
      updated: 0,
      unchanged: 0,
      conflicts: 0,
      changes: [],
    };
  }

  const result: OpenApiSyncServiceResult = {
    added: 0,
    updated: 0,
    unchanged: 0,
    conflicts: 0,
    changes: [],
  };

  for (const source of sourcesToSync) {
    logger.info(`Syncing with source: ${source.name}`);

    // Get source URL or file
    const sourceLocation = source.url ?? source.file;
    if (!sourceLocation) {
      logger.warn(`Source ${source.name} has no url or file configured`);
      continue;
    }

    // Parse the OpenAPI document
    const parseResult = await parseOpenApi(sourceLocation, {
      fetch: globalThis.fetch,
      readFile: (path) => fs.readFile(path),
    });

    logger.info(
      `Parsed ${parseResult.operations.length} operations from ${source.name}`
    );

    // Import operations to get the new specs
    const importResult = importFromOpenApi(parseResult, config, {
      prefix: source.prefix,
      tags: source.tags,
      exclude: source.exclude,
      defaultStability: source.defaultStability,
      defaultAuth: source.defaultAuth,
    });

    // Process each imported spec
    for (const imported of importResult.operationSpecs) {
      const filePath = join(outputDir, imported.fileName);
      const exists = await fs.exists(filePath);

      if (!exists) {
        // New spec - add it
        if (!dryRun) {
          const dir = dirname(filePath);
          await fs.mkdir(dir);
          await fs.writeFile(filePath, imported.code);
        }

        result.added++;
        result.changes.push({
          operationId: imported.source.sourceId,
          action: 'added',
          path: filePath,
        });
        logger.info(`Added: ${imported.source.sourceId}`);
      } else {
        // Existing spec - check for differences
        const existingCode = await fs.readFile(filePath);

        if (existingCode === imported.code) {
          // No changes
          result.unchanged++;
          result.changes.push({
            operationId: imported.source.sourceId,
            action: 'unchanged',
            path: filePath,
          });
        } else {
          // Differences detected
          if (force === 'openapi') {
            // Overwrite with OpenAPI version
            if (!dryRun) {
              await fs.writeFile(filePath, imported.code);
            }
            result.updated++;
            result.changes.push({
              operationId: imported.source.sourceId,
              action: 'updated',
              path: filePath,
            });
            logger.info(`Updated: ${imported.source.sourceId}`);
          } else if (force === 'contractspec') {
            // Keep ContractSpec version
            result.unchanged++;
            result.changes.push({
              operationId: imported.source.sourceId,
              action: 'unchanged',
              path: filePath,
            });
            logger.info(`Kept: ${imported.source.sourceId}`);
          } else if (interactive) {
            // Would prompt for resolution in CLI
            result.conflicts++;
            result.changes.push({
              operationId: imported.source.sourceId,
              action: 'conflict',
              path: filePath,
            });
            logger.warn(
              `Conflict: ${imported.source.sourceId} - needs resolution`
            );
          } else {
            // Default: report conflict
            result.conflicts++;
            result.changes.push({
              operationId: imported.source.sourceId,
              action: 'conflict',
              path: filePath,
            });
            logger.warn(`Conflict: ${imported.source.sourceId}`);
          }
        }
      }
    }
  }

  logger.info(
    `Sync complete: ${result.added} added, ${result.updated} updated, ${result.unchanged} unchanged, ${result.conflicts} conflicts`
  );

  return result;
}
