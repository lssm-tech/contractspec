/**
 * Export ContractSpec specs to OpenAPI 3.1 format.
 * Moved from @lssm/lib.contracts/openapi.ts with enhancements.
 */

import type {
  AnyOperationSpec,
  OperationSpec,
  OperationSpecRegistry,
} from '@lssm/lib.contracts';
import type { AnySchemaModel } from '@lssm/lib.schema';
import { z } from 'zod';
import type {
  ContractSpecOpenApiDocument,
  OpenApiExportOptions,
  OpenApiServer,
} from './types';

type OpenApiSchemaObject = Record<string, unknown>;

/**
 * Convert a spec name and version to an operationId.
 */
function toOperationId(name: string, version: number): string {
  return `${name.replace(/\./g, '_')}_v${version}`;
}

/**
 * Convert a spec name and version to a schema name.
 */
function toSchemaName(
  prefix: 'Input' | 'Output',
  name: string,
  version: number
): string {
  return `${prefix}_${toOperationId(name, version)}`;
}

/**
 * Determine HTTP method from spec kind and override.
 */
function toHttpMethod(
  kind: 'command' | 'query',
  override?: 'GET' | 'POST'
): string {
  const method = override ?? (kind === 'query' ? 'GET' : 'POST');
  return method.toLowerCase();
}

/**
 * Generate default REST path from spec name and version.
 */
export function defaultRestPath(name: string, version: number): string {
  return `/${name.replace(/\./g, '/')}/v${version}`;
}

/**
 * Get REST path from spec, using transport override or default.
 */
function toRestPath(spec: AnyOperationSpec): string {
  const path =
    spec.transport?.rest?.path ??
    defaultRestPath(spec.meta.name, spec.meta.version);
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Convert a SchemaModel to JSON Schema using Zod.
 */
function schemaModelToJsonSchema(
  schema: AnySchemaModel | null
): OpenApiSchemaObject | null {
  if (!schema) return null;
  return z.toJSONSchema(schema.getZod()) as OpenApiSchemaObject;
}

/**
 * Extract JSON Schema for a spec's input and output.
 */
function jsonSchemaForSpec(
  spec: OperationSpec<AnySchemaModel, AnySchemaModel>
): {
  input: OpenApiSchemaObject | null;
  output: OpenApiSchemaObject | null;
  meta: {
    name: string;
    version: number;
    kind: 'command' | 'query';
    description: string;
    tags: string[];
    stability: string;
  };
} {
  return {
    input: schemaModelToJsonSchema(spec.io.input),
    output: schemaModelToJsonSchema(spec.io.output as AnySchemaModel | null),
    meta: {
      name: spec.meta.name,
      version: spec.meta.version,
      kind: spec.meta.kind,
      description: spec.meta.description,
      tags: spec.meta.tags ?? [],
      stability: spec.meta.stability ?? 'stable',
    },
  };
}

/**
 * Export a OperationSpecRegistry to an OpenAPI 3.1 document.
 *
 * @param registry - The OperationSpecRegistry containing specs to export
 * @param options - Export options (title, version, description, servers)
 * @returns OpenAPI 3.1 document
 */
export function openApiForRegistry(
  registry: OperationSpecRegistry,
  options: OpenApiExportOptions = {}
): ContractSpecOpenApiDocument {
  const specs = registry
    .listSpecs()
    .filter(
      (s): s is AnyOperationSpec =>
        s.meta.kind === 'command' || s.meta.kind === 'query'
    )
    .slice()
    .sort((a, b) => {
      const byName = a.meta.name.localeCompare(b.meta.name);
      return byName !== 0 ? byName : a.meta.version - b.meta.version;
    });

  const doc: ContractSpecOpenApiDocument = {
    openapi: '3.1.0',
    info: {
      title: options.title ?? 'ContractSpec API',
      version: options.version ?? '0.0.0',
      ...(options.description ? { description: options.description } : {}),
    },
    ...(options.servers ? { servers: options.servers } : {}),
    paths: {},
    components: { schemas: {} },
  };

  for (const spec of specs) {
    const schema = jsonSchemaForSpec(
      spec as unknown as OperationSpec<AnySchemaModel, AnySchemaModel>
    );
    const method = toHttpMethod(spec.meta.kind, spec.transport?.rest?.method);
    const path = toRestPath(spec);

    const operationId = toOperationId(spec.meta.name, spec.meta.version);

    const pathItem = (doc.paths[path] ??= {});
    const op: Record<string, unknown> = {
      operationId,
      summary: spec.meta.description ?? spec.meta.name,
      description: spec.meta.description,
      tags: spec.meta.tags ?? [],
      'x-contractspec': {
        name: spec.meta.name,
        version: spec.meta.version,
        kind: spec.meta.kind,
      },
      responses: {},
    };

    if (schema.input) {
      const inputName = toSchemaName(
        'Input',
        spec.meta.name,
        spec.meta.version
      );
      doc.components.schemas[inputName] = schema.input;
      op['requestBody'] = {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${inputName}` },
          },
        },
      };
    }

    const responses: Record<string, unknown> = {};
    if (schema.output) {
      const outputName = toSchemaName(
        'Output',
        spec.meta.name,
        spec.meta.version
      );
      doc.components.schemas[outputName] = schema.output;
      responses['200'] = {
        description: 'OK',
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${outputName}` },
          },
        },
      };
    } else {
      responses['200'] = { description: 'OK' };
    }
    op['responses'] = responses;

    pathItem[method] = op;
  }

  return doc;
}

/**
 * Export a OperationSpecRegistry to OpenAPI JSON string.
 */
export function openApiToJson(
  registry: OperationSpecRegistry,
  options: OpenApiExportOptions = {}
): string {
  const doc = openApiForRegistry(registry, options);
  return JSON.stringify(doc, null, 2);
}

/**
 * Export a OperationSpecRegistry to OpenAPI YAML string.
 */
export function openApiToYaml(
  registry: OperationSpecRegistry,
  options: OpenApiExportOptions = {}
): string {
  const doc = openApiForRegistry(registry, options);
  return jsonToYaml(doc);
}

/**
 * Simple JSON to YAML conversion.
 */
function jsonToYaml(obj: unknown, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        yaml += `${spaces}-\n${jsonToYaml(item, indent + 1)}`;
      } else {
        yaml += `${spaces}- ${JSON.stringify(item)}\n`;
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else if (typeof value === 'object' && value !== null) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else {
        yaml += `${spaces}${key}: ${JSON.stringify(value)}\n`;
      }
    }
  }

  return yaml;
}

// Re-export types for convenience
export type {
  OpenApiExportOptions,
  OpenApiServer,
  ContractSpecOpenApiDocument,
};
