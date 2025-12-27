import type {
  OpenApiSource,
  OpenApiTransportHints,
  ParsedOperation,
  ParseResult,
} from '../types';
import type { ImportedOperationSpec, ImportResult } from '../../common/types';
import { toFileName, toSpecKey } from '../../common/utils';
import { generateSchemaModelCode } from '../schema-converter';
import {
  buildInputSchema,
  buildInputSchemas,
  getOutputSchema,
} from './schemas';
import { generateSpecCode } from './generator';
import { generateModelCode } from './models';
import { generateEventCode } from './events';
import {
  resolveOperationGroupFolder,
  resolveModelGroupFolder,
  resolveEventGroupFolder,
} from './grouping';
import type {
  ContractsrcConfig,
  OpenApiSourceConfig,
} from '@lssm/lib.contracts';

export * from './analyzer';
export * from './schemas';
export * from './generator';
export * from './models';
export * from './events';
export * from './grouping';

/**
 * Import operations from a parsed OpenAPI document.
 */
export const importFromOpenApi = (
  parseResult: ParseResult,
  contractspecOptions: ContractsrcConfig,
  importOptions: Partial<OpenApiSourceConfig> = {}
): ImportResult => {
  const { tags, exclude = [], include } = importOptions;
  const specs: ImportedOperationSpec[] = [];
  const skipped: ImportResult['skipped'] = [];
  const errors: ImportResult['errors'] = [];

  for (const operation of parseResult.operations) {
    // Filter by tags if specified
    if (tags && tags.length > 0) {
      const hasMatchingTag = operation.tags.some((t) => tags.includes(t));
      if (!hasMatchingTag) {
        skipped.push({
          sourceId: operation.operationId,
          reason: `No matching tags (has: ${operation.tags.join(', ')})`,
        });
        continue;
      }
    }

    // Filter by include/exclude
    if (include && include.length > 0) {
      if (!include.includes(operation.operationId)) {
        skipped.push({
          sourceId: operation.operationId,
          reason: 'Not in include list',
        });
        continue;
      }
    } else if (exclude.includes(operation.operationId)) {
      skipped.push({
        sourceId: operation.operationId,
        reason: 'In exclude list',
      });
      continue;
    }

    // Skip deprecated operations by default
    if (
      operation.deprecated &&
      importOptions.defaultStability !== 'deprecated'
    ) {
      skipped.push({
        sourceId: operation.operationId,
        reason: 'Deprecated operation',
      });
      continue;
    }

    try {
      // Build input schemas
      const inputSchemas = buildInputSchemas(operation);
      const schemaFormat =
        importOptions.schemaFormat ||
        contractspecOptions.schemaFormat ||
        'contractspec';

      // Generate models for each input source
      const inputModel = inputSchemas.body
        ? generateSchemaModelCode(
            inputSchemas.body,
            `${operation.operationId}Input`,
            0,
            schemaFormat,
            contractspecOptions
          )
        : null;

      const queryModel = inputSchemas.query
        ? generateSchemaModelCode(
            inputSchemas.query,
            `${operation.operationId}Query`,
            0,
            schemaFormat,
            contractspecOptions
          )
        : null;

      const paramsModel = inputSchemas.params
        ? generateSchemaModelCode(
            inputSchemas.params,
            `${operation.operationId}Params`,
            0,
            schemaFormat,
            contractspecOptions
          )
        : null;

      const headersModel = inputSchemas.headers
        ? generateSchemaModelCode(
            inputSchemas.headers,
            `${operation.operationId}Headers`,
            0,
            schemaFormat,
            contractspecOptions
          )
        : null;

      // Get output schema
      const outputSchema = getOutputSchema(operation);
      let outputModel = outputSchema
        ? generateSchemaModelCode(
            outputSchema,
            `${operation.operationId}Output`,
            0,
            schemaFormat,
            contractspecOptions
          )
        : null;

      // Filter out empty/comment-only output models ONLY for ContractSpec format
      if (
        outputModel &&
        schemaFormat === 'contractspec' &&
        !outputModel.code.includes('defineSchemaModel')
      ) {
        outputModel = null;
      }

      // Generate spec code
      const code = generateSpecCode(
        operation,
        contractspecOptions,
        importOptions,
        inputModel,
        outputModel,
        queryModel,
        paramsModel,
        headersModel
      );
      const specName = toSpecKey(operation.operationId, importOptions.prefix);
      const fileName = toFileName(specName);

      // Build transport hints
      const transportHints: OpenApiTransportHints = {
        rest: {
          method:
            operation.method.toUpperCase() as OpenApiTransportHints['rest']['method'],
          path: operation.path,
          params: {
            path: operation.pathParams.map((p) => p.name),
            query: operation.queryParams.map((p) => p.name),
            header: operation.headerParams.map((p) => p.name),
            cookie: operation.cookieParams.map((p) => p.name),
          },
        },
      };

      // Build source info
      const source: OpenApiSource = {
        type: 'openapi',
        sourceId: operation.operationId,
        operationId: operation.operationId,
        openApiVersion: parseResult.version,
        importedAt: new Date(),
      };

      // Resolve group folder based on config
      const groupFolder = resolveOperationGroupFolder(
        operation,
        contractspecOptions.conventions
      );

      specs.push({
        code,
        fileName,
        groupFolder: groupFolder || undefined,
        source,
        transportHints,
      });
    } catch (error) {
      errors.push({
        sourceId: operation.operationId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Import standalone models
  for (const [name, schema] of Object.entries(parseResult.schemas)) {
    try {
      const code = generateModelCode(name, schema, {
        ...contractspecOptions,
        schemaFormat: importOptions.schemaFormat || contractspecOptions.schemaFormat,
      });
      const fileName = toFileName(toSpecKey(name, importOptions.prefix));
      const groupFolder = resolveModelGroupFolder(
        name,
        contractspecOptions.conventions
      );

      specs.push({
        code,
        fileName,
        groupFolder: groupFolder || undefined,
        source: {
          type: 'openapi',
          sourceId: name,
          operationId: name,
          openApiVersion: parseResult.version,
          importedAt: new Date(),
        } as OpenApiSource,
        transportHints: {},
      });
    } catch (error) {
      errors.push({
        sourceId: name,
        error:
          error instanceof Error
            ? 'Model conversion failed: ' + error.message
            : String(error),
      });
    }
  }

  // Import events
  for (const event of parseResult.events) {
    try {
      const code = generateEventCode(event, {
        ...contractspecOptions,
        schemaFormat: importOptions.schemaFormat || contractspecOptions.schemaFormat,
      });
      const fileName = toFileName(toSpecKey(event.name, importOptions.prefix));
      const groupFolder = resolveEventGroupFolder(
        event.name,
        contractspecOptions.conventions
      );

      specs.push({
        code,
        fileName,
        groupFolder: groupFolder || undefined,
        source: {
          type: 'openapi',
          sourceId: event.name,
          operationId: event.name,
          openApiVersion: parseResult.version,
          importedAt: new Date(),
        } as OpenApiSource,
        transportHints: {},
      });
    } catch (error) {
      errors.push({
        sourceId: event.name,
        error:
          error instanceof Error
            ? 'Event conversion failed: ' + error.message
            : String(error),
      });
    }
  }

  return {
    operationSpecs: specs,
    skipped,
    errors,
    summary: {
      total:
        parseResult.operations.length +
        Object.keys(parseResult.schemas).length +
        parseResult.events.length,
      imported: specs.length,
      skipped: skipped.length,
      errors: errors.length,
    },
  };
};

/**
 * Import a single operation to ContractSpec code.
 */
export function importOperation(
  operation: ParsedOperation,
  options: Partial<OpenApiSourceConfig> = {},
  contractspecOptions: ContractsrcConfig
): string {
  // Build input schemas
  const inputSchemas = buildInputSchemas(operation);
  const schemaFormat =
    options.schemaFormat || contractspecOptions.schemaFormat || 'contractspec';

  // Generate models for each input source
  const inputModel = inputSchemas.body
    ? generateSchemaModelCode(
        inputSchemas.body,
        `${operation.operationId}Input`,
        0,
        schemaFormat,
        contractspecOptions
      )
    : null;

  const queryModel = inputSchemas.query
    ? generateSchemaModelCode(
        inputSchemas.query,
        `${operation.operationId}Query`,
        0,
        schemaFormat,
        contractspecOptions
      )
    : null;

  const paramsModel = inputSchemas.params
    ? generateSchemaModelCode(
        inputSchemas.params,
        `${operation.operationId}Params`,
        0,
        schemaFormat,
        contractspecOptions
      )
    : null;

  const headersModel = inputSchemas.headers
    ? generateSchemaModelCode(
        inputSchemas.headers,
        `${operation.operationId}Headers`,
        0,
        schemaFormat,
        contractspecOptions
      )
    : null;

  const outputSchema = getOutputSchema(operation);
  const outputModel = outputSchema
    ? generateSchemaModelCode(
        outputSchema,
        `${operation.operationId}Output`,
        0,
        schemaFormat,
        contractspecOptions
      )
    : null;

  return generateSpecCode(
    operation,
    contractspecOptions,
    options,
    inputModel,
    outputModel,
    queryModel,
    paramsModel,
    headersModel
  );
}
