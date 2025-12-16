import type { SpecRegistry } from './registry';
import type { AnyContractSpec, ContractSpec } from './spec';
import { defaultRestPath, jsonSchemaForSpec } from './jsonschema';
import type { AnySchemaModel } from '@lssm/lib.schema';

export interface OpenApiServer {
  url: string;
  description?: string;
}

export interface OpenApiExportOptions {
  title?: string;
  version?: string;
  description?: string;
  servers?: OpenApiServer[];
}

type OpenApiSchemaObject = Record<string, unknown>;

export interface OpenApiDocument {
  openapi: '3.1.0';
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: OpenApiServer[];
  paths: Record<string, Record<string, unknown>>;
  components: {
    schemas: Record<string, OpenApiSchemaObject>;
  };
}

function toOperationId(name: string, version: number) {
  return `${name.replace(/\./g, '_')}_v${version}`;
}

function toSchemaName(
  prefix: 'Input' | 'Output',
  name: string,
  version: number
) {
  return `${prefix}_${toOperationId(name, version)}`;
}

function toHttpMethod(kind: 'command' | 'query', override?: 'GET' | 'POST') {
  const method = override ?? (kind === 'query' ? 'GET' : 'POST');
  return method.toLowerCase();
}

function toRestPath(spec: AnyContractSpec): string {
  const path =
    spec.transport?.rest?.path ??
    defaultRestPath(spec.meta.name, spec.meta.version);
  return path.startsWith('/') ? path : `/${path}`;
}

export function openApiForRegistry(
  registry: SpecRegistry,
  options: OpenApiExportOptions = {}
): OpenApiDocument {
  const specs = registry
    .listSpecs()
    .filter(
      (s): s is AnyContractSpec =>
        s.meta.kind === 'command' || s.meta.kind === 'query'
    )
    .slice()
    .sort((a, b) => {
      const byName = a.meta.name.localeCompare(b.meta.name);
      return byName !== 0 ? byName : a.meta.version - b.meta.version;
    });

  const doc: OpenApiDocument = {
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
      spec as unknown as ContractSpec<AnySchemaModel, AnySchemaModel>
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
      doc.components.schemas[inputName] = schema.input as OpenApiSchemaObject;
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
      doc.components.schemas[outputName] = schema.output as OpenApiSchemaObject;
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

