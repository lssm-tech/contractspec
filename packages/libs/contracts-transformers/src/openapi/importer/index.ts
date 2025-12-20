import type {
  OpenApiSource,
  OpenApiTransportHints,
  ParsedOperation,
  ParseResult,
} from '../types';
import type { ImportedSpec, ImportResult } from '../../common/types';
import { toFileName, toSpecName } from '../../common/utils';
import { generateSchemaModelCode } from '../schema-converter';
import { buildInputSchema, getOutputSchema } from './schemas';
import { generateSpecCode } from './generator';
import { generateModelCode } from './models';
import { generateEventCode } from './events';
import type {
  ContractsrcConfig,
  OpenApiSourceConfig,
} from '@lssm/lib.contracts';

export * from './analyzer';
export * from './schemas';
export * from './generator';
export * from './models';
export * from './events';

/**
 * Import operations from a parsed OpenAPI document.
 */
export const importFromOpenApi = (
  parseResult: ParseResult,
  contractspecOptions: ContractsrcConfig,
  importOptions: Partial<OpenApiSourceConfig> = {}
): ImportResult => {
  const { tags, exclude = [], include } = importOptions;
  const specs: ImportedSpec[] = [];
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
      // Build input schema
      const { schema: inputSchema } = buildInputSchema(operation);
      const inputModel = inputSchema
        ? generateSchemaModelCode(inputSchema, `${operation.operationId}Input`)
        : null;

      // Get output schema
      const outputSchema = getOutputSchema(operation);
      const outputModel = outputSchema
        ? generateSchemaModelCode(
            outputSchema,
            `${operation.operationId}Output`
          )
        : null;

      // Generate spec code
      const code = generateSpecCode(
        operation,
        contractspecOptions,
        importOptions,
        inputModel,
        outputModel
      );
      const specName = toSpecName(operation.operationId, importOptions.prefix);
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

      specs.push({
        code,
        fileName,
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
      const code = generateModelCode(name, schema, contractspecOptions);
      const fileName = toFileName(toSpecName(name, importOptions.prefix));

      specs.push({
        code,
        fileName,
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
      const code = generateEventCode(event, contractspecOptions);
      const fileName = toFileName(toSpecName(event.name, importOptions.prefix));

      specs.push({
        code,
        fileName,
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
    specs,
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
  const { schema: inputSchema } = buildInputSchema(operation);
  const inputModel = inputSchema
    ? generateSchemaModelCode(inputSchema, `${operation.operationId}Input`)
    : null;

  const outputSchema = getOutputSchema(operation);
  const outputModel = outputSchema
    ? generateSchemaModelCode(outputSchema, `${operation.operationId}Output`)
    : null;

  return generateSpecCode(
    operation,
    contractspecOptions,
    options,
    inputModel,
    outputModel
  );
}
