import type {
  OpenApiDocument,
  OpenApiSchema,
} from '../types';
import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

/**
 * Check if a value is a reference object.
 */
export function isReference(
  obj: unknown
): obj is OpenAPIV3.ReferenceObject | OpenAPIV3_1.ReferenceObject {
  return typeof obj === 'object' && obj !== null && '$ref' in obj;
}

/**
 * Resolve a $ref reference in the document.
 */
export function resolveRef<T>(doc: OpenApiDocument, ref: string): T | undefined {
  // Only support local refs for now
  if (!ref.startsWith('#/')) {
    return undefined;
  }

  const path = ref.slice(2).split('/');
  let current: unknown = doc;

  for (const part of path) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current as T;
}

/**
 * Resolve a schema, following $ref if needed.
 */
export function resolveSchema(
  doc: OpenApiDocument,
  schema: OpenApiSchema | undefined
): OpenApiSchema | undefined {
  if (!schema) return undefined;
  if (isReference(schema)) {
    return resolveRef<OpenApiSchema>(doc, schema.$ref) ?? schema;
  }
  return schema;
}
