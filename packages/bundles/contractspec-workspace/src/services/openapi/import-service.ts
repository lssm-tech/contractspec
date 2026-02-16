/**
 * OpenAPI import service - imports specs from OpenAPI documents.
 */

import {
  parseOpenApi,
  importFromOpenApi,
} from '@lssm/lib.contracts-transformers/openapi';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import type {
  OpenApiImportServiceOptions,
  OpenApiImportServiceResult,
} from './types';
import { join, dirname } from 'path';

/**
 * Import ContractSpec specs from an OpenAPI document.
 */
export async function importFromOpenApiService(
  options: OpenApiImportServiceOptions,
  adapters: { fs: FsAdapter; logger: LoggerAdapter }
): Promise<OpenApiImportServiceResult> {
  const { fs, logger } = adapters;
  const {
    source,
    outputDir,
    prefix,
    tags,
    exclude,
    defaultStability,
    defaultOwners,
    defaultAuth,
    dryRun = false,
  } = options;

  logger.info(`Importing from OpenAPI: ${source}`);

  // Parse the OpenAPI document
  const parseResult = await parseOpenApi(source, {
    fetch: globalThis.fetch,
    readFile: (path) => fs.readFile(path),
  });

  if (parseResult.warnings.length > 0) {
    for (const warning of parseResult.warnings) {
      logger.warn(`Parse warning: ${warning}`);
    }
  }

  logger.info(
    `Parsed ${parseResult.operations.length} operations from ${parseResult.info.title} v${parseResult.info.version}`
  );

  // Import operations
  const importResult = importFromOpenApi(parseResult, {
    prefix,
    tags,
    exclude,
    defaultStability,
    defaultOwners,
    defaultAuth,
  });

  logger.info(
    `Import result: ${importResult.summary.imported} imported, ${importResult.summary.skipped} skipped, ${importResult.summary.errors} errors`
  );

  const files: OpenApiImportServiceResult['files'] = [];
  const skippedOperations: OpenApiImportServiceResult['skippedOperations'] = [];
  const errorMessages: OpenApiImportServiceResult['errorMessages'] = [];

  // Write imported specs
  for (const spec of importResult.specs) {
    const filePath = join(outputDir, spec.fileName);

    if (dryRun) {
      logger.info(`[DRY RUN] Would create: ${filePath}`);
    } else {
      // Ensure directory exists
      const dir = dirname(filePath);
      await fs.mkdir(dir);

      // Write spec file
      await fs.writeFile(filePath, spec.code);
      logger.info(`Created: ${filePath}`);
    }

    files.push({
      path: filePath,
      operationId: spec.source.sourceId,
      specName: spec.fileName.replace('.ts', ''),
    });
  }

  // Record skipped operations
  for (const skipped of importResult.skipped) {
    skippedOperations.push({
      operationId: skipped.sourceId,
      reason: skipped.reason,
    });
    logger.debug(`Skipped: ${skipped.sourceId} - ${skipped.reason}`);
  }

  // Record errors
  for (const error of importResult.errors) {
    errorMessages.push({
      operationId: error.sourceId,
      error: error.error,
    });
    logger.error(`Error: ${error.sourceId} - ${error.error}`);
  }

  return {
    imported: importResult.summary.imported,
    skipped: importResult.summary.skipped,
    errors: importResult.summary.errors,
    files,
    skippedOperations,
    errorMessages,
  };
}
