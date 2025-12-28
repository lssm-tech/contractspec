/**
 * Convert zod I/O to JSON Schema so adapters can generate OpenAPI/MCP.
 */
import type { OperationSpec } from './operations';
import type { AnySchemaModel } from '@contractspec/lib.schema';
import z from 'zod';

export function jsonSchemaForSpec(
  spec: OperationSpec<AnySchemaModel, AnySchemaModel>
) {
  return {
    input: spec.io.input ? z.toJSONSchema(spec.io.input.getZod()) : null,
    output: spec.io.output ? z.toJSONSchema(spec.io.output.getZod()) : null,
    meta: {
      name: spec.meta.key,
      version: spec.meta.version,
      kind: spec.meta.kind,
      description: spec.meta.description,
      tags: spec.meta.tags ?? [],
      stability: spec.meta.stability ?? 'stable',
    },
  };
}

/** Helper to derive default REST path */
export function defaultRestPath(name: string, version: number) {
  return `/${name.replace(/\./g, '/')}/v${version}`;
}

/** Helper to derive default MCP tool name */
export function defaultMcpTool(name: string, version: number) {
  return `${name}-v${version}`;
}

/** Helper to derive default GraphQL field name */
export function defaultGqlField(name: string, version: number) {
  return `${name.replace(/\./g, '_')}_v${version}`;
}
