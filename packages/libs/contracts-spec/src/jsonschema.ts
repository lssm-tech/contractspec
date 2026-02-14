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
export function defaultRestPath(name: string, version: string) {
  return `/${name.replace(/\./g, '/')}/v${version}`;
}

/**
 * Sanitize a name for MCP entities (tools, prompts, resources).
 * Replaces dots with underscores and ensures compliance with the pattern ^[a-zA-Z0-9_-]{1,64}$.
 * While MCP spec allows dots, some clients validate against stricter patterns.
 */
export function sanitizeMcpName(name: string): string {
  // Replace dots with underscores
  const sanitized = name.replace(/\./g, '_');
  // Truncate to 64 characters if needed
  return sanitized.slice(0, 64);
}

/**
 * Helper to derive default MCP tool name.
 * Replaces dots with underscores for maximum client compatibility.
 * While MCP spec allows dots, some clients validate against stricter patterns.
 */
export function defaultMcpTool(name: string, version: string) {
  const safeName = name.replace(/\./g, '_');
  const safeVersion = version.replace(/\./g, '_');
  return `${safeName}-v${safeVersion}`;
}

/**
 * Helper to derive default MCP prompt name from key.
 * Replaces dots with underscores for maximum client compatibility.
 */
export function defaultMcpPrompt(key: string): string {
  return sanitizeMcpName(key);
}

/** Helper to derive default GraphQL field name */
export function defaultGqlField(name: string, version: string) {
  return `${name.replace(/\./g, '_')}_v${version}`;
}
