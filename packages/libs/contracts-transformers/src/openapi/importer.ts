/**
 * Import OpenAPI specifications into ContractSpec format.
 * Converts OpenAPI operations to ContractSpec command/query definitions.
 */

import type {
  OpenApiImportOptions,
  ParseResult,
  ParsedOperation,
  OpenApiSchema,
  OpenApiTransportHints,
  OpenApiSource,
} from './types';
import type { ImportResult, ImportedSpec } from '../common/types';
import {
  toSpecName,
  toFileName,
  toPascalCase,
  toValidIdentifier,
} from '../common/utils';
import {
  generateSchemaModelCode,
  generateImports,
  type GeneratedModel,
} from './schema-converter';

/**
 * HTTP methods that typically indicate a command (state-changing).
 */
const COMMAND_METHODS = ['post', 'put', 'delete', 'patch'];

/**
 * Determine if an operation is a command or query based on HTTP method.
 */
function inferOpKind(method: string): 'command' | 'query' {
  return COMMAND_METHODS.includes(method.toLowerCase()) ? 'command' : 'query';
}

/**
 * Determine auth level based on security requirements.
 */
function inferAuthLevel(
  operation: ParsedOperation,
  defaultAuth: 'anonymous' | 'user' | 'admin'
): 'anonymous' | 'user' | 'admin' {
  if (!operation.security || operation.security.length === 0) {
    // Check if any security scheme is present
    return defaultAuth;
  }

  // If there's an empty security requirement, it's anonymous
  for (const sec of operation.security) {
    if (Object.keys(sec).length === 0) {
      return 'anonymous';
    }
  }

  return 'user';
}

/**
 * Build a merged input schema from all parameter sources.
 */
function buildInputSchema(operation: ParsedOperation): {
  schema: OpenApiSchema | null;
  fields: { name: string; schema: OpenApiSchema; required: boolean }[];
} {
  const fields: {
    name: string;
    schema: OpenApiSchema;
    required: boolean;
  }[] = [];

  // Add path parameters
  for (const param of operation.pathParams) {
    fields.push({
      name: param.name,
      schema: param.schema,
      required: true, // Path params are always required
    });
  }

  // Add query parameters
  for (const param of operation.queryParams) {
    fields.push({
      name: param.name,
      schema: param.schema,
      required: param.required,
    });
  }

  // Add header parameters (excluding common headers)
  const excludedHeaders = [
    'authorization',
    'content-type',
    'accept',
    'user-agent',
  ];
  for (const param of operation.headerParams) {
    if (!excludedHeaders.includes(param.name.toLowerCase())) {
      fields.push({
        name: param.name,
        schema: param.schema,
        required: param.required,
      });
    }
  }

  // Add request body fields
  if (operation.requestBody?.schema) {
    const bodySchema = operation.requestBody.schema;
    if (!('$ref' in bodySchema)) {
      const schemaObj = bodySchema as Record<string, unknown>;
      const properties = schemaObj['properties'] as
        | Record<string, OpenApiSchema>
        | undefined;
      const required = (schemaObj['required'] as string[]) ?? [];

      if (properties) {
        for (const [propName, propSchema] of Object.entries(properties)) {
          fields.push({
            name: propName,
            schema: propSchema,
            required: required.includes(propName),
          });
        }
      }
    } else {
      // Reference to a schema - add as a single field
      fields.push({
        name: 'body',
        schema: bodySchema,
        required: operation.requestBody.required,
      });
    }
  }

  if (fields.length === 0) {
    return { schema: null, fields: [] };
  }

  // Build a merged schema
  const mergedSchema: OpenApiSchema = {
    type: 'object',
    properties: fields.reduce(
      (acc, f) => {
        acc[f.name] = f.schema;
        return acc;
      },
      {} as Record<string, OpenApiSchema>
    ),
    required: fields.filter((f) => f.required).map((f) => f.name),
  } as unknown as OpenApiSchema;

  return { schema: mergedSchema, fields };
}

/**
 * Get the output schema from the operation responses.
 */
function getOutputSchema(operation: ParsedOperation): OpenApiSchema | null {
  // Prefer 200, then 201, then 2xx responses
  const successCodes = ['200', '201', '202', '204'];

  for (const code of successCodes) {
    const response = operation.responses[code];
    if (response?.schema) {
      return response.schema;
    }
  }

  // Check for any 2xx response
  for (const [code, response] of Object.entries(operation.responses)) {
    if (code.startsWith('2') && response.schema) {
      return response.schema;
    }
  }

  return null;
}

/**
 * Generate ContractSpec TypeScript code for an operation.
 */
function generateSpecCode(
  operation: ParsedOperation,
  options: OpenApiImportOptions,
  inputModel: GeneratedModel | null,
  outputModel: GeneratedModel | null
): string {
  const specName = toSpecName(operation.operationId, options.prefix);
  const kind = inferOpKind(operation.method);
  const auth = inferAuthLevel(operation, options.defaultAuth ?? 'user');

  const lines: string[] = [];

  // Imports
  lines.push(
    "import { defineCommand, defineQuery } from '@lssm/lib.contracts';"
  );
  if (inputModel || outputModel) {
    lines.push(
      generateImports([
        ...(inputModel?.fields ?? []),
        ...(outputModel?.fields ?? []),
      ])
    );
  }
  lines.push('');

  // Generate input model if present
  if (inputModel && inputModel.code) {
    lines.push('// Input schema');
    lines.push(inputModel.code);
    lines.push('');
  }

  // Generate output model if present
  if (outputModel && outputModel.code) {
    lines.push('// Output schema');
    lines.push(outputModel.code);
    lines.push('');
  }

  // Generate spec
  const defineFunc = kind === 'command' ? 'defineCommand' : 'defineQuery';
  const safeName = toValidIdentifier(toPascalCase(operation.operationId));

  lines.push(`/**`);
  lines.push(` * ${operation.summary ?? operation.operationId}`);
  if (operation.description) {
    lines.push(` *`);
    lines.push(` * ${operation.description}`);
  }
  lines.push(` *`);
  lines.push(
    ` * @source OpenAPI: ${operation.method.toUpperCase()} ${operation.path}`
  );
  lines.push(` */`);
  lines.push(`export const ${safeName}Spec = ${defineFunc}({`);

  // Meta
  lines.push('  meta: {');
  lines.push(`    name: '${specName}',`);
  lines.push('    version: 1,');
  lines.push(`    stability: '${options.defaultStability ?? 'stable'}',`);
  lines.push(
    `    owners: [${(options.defaultOwners ?? []).map((o) => `'${o}'`).join(', ')}],`
  );
  lines.push(`    tags: [${operation.tags.map((t) => `'${t}'`).join(', ')}],`);
  lines.push(
    `    description: ${JSON.stringify(operation.summary ?? operation.operationId)},`
  );
  lines.push(
    `    goal: ${JSON.stringify(operation.description ?? 'Imported from OpenAPI')},`
  );
  lines.push(
    `    context: 'Imported from OpenAPI: ${operation.method.toUpperCase()} ${operation.path}',`
  );
  lines.push('  },');

  // IO
  lines.push('  io: {');
  if (inputModel) {
    lines.push(`    input: ${inputModel.name},`);
  } else {
    lines.push('    input: null,');
  }
  if (outputModel) {
    lines.push(`    output: ${outputModel.name},`);
  } else {
    lines.push('    output: null, // TODO: Define output schema');
  }
  lines.push('  },');

  // Policy
  lines.push('  policy: {');
  lines.push(`    auth: '${auth}',`);
  lines.push('  },');

  // Transport hints
  lines.push('  transport: {');
  lines.push('    rest: {');
  lines.push(`      method: '${operation.method.toUpperCase()}',`);
  lines.push(`      path: '${operation.path}',`);
  lines.push('    },');
  lines.push('  },');

  lines.push('});');

  return lines.join('\n');
}

/**
 * Import operations from a parsed OpenAPI document.
 */
export function importFromOpenApi(
  parseResult: ParseResult,
  options: OpenApiImportOptions = {}
): ImportResult {
  const { tags, exclude = [], include } = options;
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
    if (operation.deprecated && options.defaultStability !== 'deprecated') {
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
        options,
        inputModel,
        outputModel
      );
      const specName = toSpecName(operation.operationId, options.prefix);
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
        spec: {} as ImportedSpec['spec'], // Placeholder - actual spec would be built at runtime
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

  return {
    specs,
    skipped,
    errors,
    summary: {
      total: parseResult.operations.length,
      imported: specs.length,
      skipped: skipped.length,
      errors: errors.length,
    },
  };
}

/**
 * Import a single operation to ContractSpec code.
 */
export function importOperation(
  operation: ParsedOperation,
  options: OpenApiImportOptions = {}
): string {
  const { schema: inputSchema } = buildInputSchema(operation);
  const inputModel = inputSchema
    ? generateSchemaModelCode(inputSchema, `${operation.operationId}Input`)
    : null;

  const outputSchema = getOutputSchema(operation);
  const outputModel = outputSchema
    ? generateSchemaModelCode(outputSchema, `${operation.operationId}Output`)
    : null;

  return generateSpecCode(operation, options, inputModel, outputModel);
}
