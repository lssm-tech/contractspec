/**
 * Operations exporter - exports OperationSpec to OpenAPI paths.
 */
import type {
  AnyOperationSpec,
  OperationSpec,
  OperationSpecRegistry,
} from '@lssm/lib.contracts';
import type { AnySchemaModel } from '@lssm/lib.schema';
import { z } from 'zod';
import type { GeneratedRegistryCode } from '../types';

type OpenApiSchemaObject = Record<string, unknown>;

/**
 * Convert a spec name and version to an operationId.
 */
export function toOperationId(name: string, version: number): string {
  return `${name.replace(/\./g, '_')}_v${version}`;
}

/**
 * Convert a spec name and version to a schema name.
 */
export function toSchemaName(
  prefix: 'Input' | 'Output',
  name: string,
  version: number
): string {
  return `${prefix}_${toOperationId(name, version)}`;
}

/**
 * Determine HTTP method from spec kind and override.
 */
export function toHttpMethod(
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
export function toRestPath(spec: AnyOperationSpec): string {
  const path =
    spec.transport?.rest?.path ??
    defaultRestPath(spec.meta.name, spec.meta.version);
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Convert a SchemaModel to JSON Schema using Zod.
 */
export function schemaModelToJsonSchema(
  schema: AnySchemaModel | null
): OpenApiSchemaObject | null {
  if (!schema) return null;
  return z.toJSONSchema(schema.getZod()) as OpenApiSchemaObject;
}

interface SpecJsonSchema {
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
}

/**
 * Extract JSON Schema for a spec's input and output.
 */
export function jsonSchemaForSpec(
  spec: OperationSpec<AnySchemaModel, AnySchemaModel>
): SpecJsonSchema {
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
 * Result of exporting operations to OpenAPI format.
 */
export interface OperationsExportResult {
  paths: Record<string, Record<string, unknown>>;
  schemas: Record<string, OpenApiSchemaObject>;
}

/**
 * Export operations from a registry to OpenAPI paths and schemas.
 */
export function exportOperations(
  registry: OperationSpecRegistry
): OperationsExportResult {
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

  const paths: Record<string, Record<string, unknown>> = {};
  const schemas: Record<string, OpenApiSchemaObject> = {};

  for (const spec of specs) {
    const schema = jsonSchemaForSpec(
      spec as unknown as OperationSpec<AnySchemaModel, AnySchemaModel>
    );
    const method = toHttpMethod(spec.meta.kind, spec.transport?.rest?.method);
    const path = toRestPath(spec);

    const operationId = toOperationId(spec.meta.name, spec.meta.version);

    const pathItem = (paths[path] ??= {});
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
      schemas[inputName] = schema.input;
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
      schemas[outputName] = schema.output;
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

  return { paths, schemas };
}

/**
 * Generate TypeScript code for operations registry.
 */
export function generateOperationsRegistry(
  registry: OperationSpecRegistry
): GeneratedRegistryCode {
  const specs = registry.listSpecs();

  const imports = new Set<string>();
  const registrations: string[] = [];

  for (const spec of specs) {
    const specVarName =
      spec.meta.name.replace(/\./g, '_') + `_v${spec.meta.version}`;
    imports.add(
      `import { ${specVarName} } from './${spec.meta.name.split('.')[0]}';`
    );
    registrations.push(`  .register(${specVarName})`);
  }

  const code = `/**
 * Auto-generated operations registry.
 * DO NOT EDIT - This file is generated by ContractSpec exporter.
 */
import { OperationSpecRegistry } from '@lssm/lib.contracts';

${Array.from(imports).join('\n')}

export const operationsRegistry = new OperationSpecRegistry()
${registrations.join('\n')};
`;

  return {
    code,
    fileName: 'operations-registry.ts',
  };
}
