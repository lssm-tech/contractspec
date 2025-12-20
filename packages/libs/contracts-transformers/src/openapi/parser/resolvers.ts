import type { OpenApiDocument, OpenApiSchema } from '../types';
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
export function resolveRef<T>(
  doc: OpenApiDocument,
  ref: string
): T | undefined {
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

/**
 * Recursively dereference a schema.
 * Replaces all $ref with their resolved values.
 */
export function dereferenceSchema(
  doc: OpenApiDocument,
  schema: OpenApiSchema | undefined,
  seen = new Set<string>()
): OpenApiSchema | undefined {
  if (!schema) return undefined;

  // Handle references
  if (isReference(schema)) {
    // Avoid infinite recursion for cycles
    if (seen.has(schema.$ref)) {
      return schema; // Keep reference for cycles
    }

    // Create new seen set for this branch
    const newSeen = new Set(seen);
    newSeen.add(schema.$ref);

    const resolved = resolveRef<OpenApiSchema>(doc, schema.$ref);
    if (!resolved) return schema;

    // Recursively dereference the resolved schema
    return dereferenceSchema(doc, resolved, newSeen);
  }

  // Deep clone to avoid mutating original doc (if we were modifying in place, but here we return new objects mostly)
  // For simplicity, we just walk properties
  const schemaObj = { ...schema } as Record<string, unknown>;

  // Handle nested schemas in properties
  if (schemaObj.properties) {
    const props = schemaObj.properties as Record<string, OpenApiSchema>;
    const newProps: Record<string, OpenApiSchema> = {};
    for (const [key, prop] of Object.entries(props)) {
      newProps[key] = dereferenceSchema(doc, prop, seen) ?? prop;
    }
    schemaObj.properties = newProps;
  }

  // Handle nested schema in items (array)
  if (schemaObj.items) {
    schemaObj.items = dereferenceSchema(
      doc,
      schemaObj.items as OpenApiSchema,
      seen
    );
  }

  // Handle allOf, anyOf, oneOf
  const combinators = ['allOf', 'anyOf', 'oneOf'];
  for (const comb of combinators) {
    if (Array.isArray(schemaObj[comb])) {
      schemaObj[comb] = (schemaObj[comb] as OpenApiSchema[]).map(
        (s) => dereferenceSchema(doc, s, seen) ?? s
      );
    }
  }

  return schemaObj as OpenApiSchema;
}
