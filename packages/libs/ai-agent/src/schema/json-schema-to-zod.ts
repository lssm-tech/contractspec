import { z, type ZodType } from 'zod';

/**
 * JSON Schema type definitions for conversion.
 */
interface JsonSchema {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: (string | number | boolean)[];
  const?: unknown;
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  allOf?: JsonSchema[];
  description?: string;
  default?: unknown;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  nullable?: boolean;
  [key: string]: unknown;
}

/**
 * Convert a JSON Schema to a Zod schema.
 *
 * Supports common JSON Schema types and constraints:
 * - string, number, integer, boolean, null
 * - object with properties and required
 * - array with items
 * - enum and const
 * - anyOf, oneOf, allOf
 * - format constraints (email, uri, uuid, date-time)
 * - numeric constraints (minimum, maximum)
 * - string constraints (minLength, maxLength, pattern)
 *
 * @param schema - JSON Schema object
 * @returns Zod schema
 */
export function jsonSchemaToZod(
  schema: JsonSchema | Record<string, unknown>
): ZodType {
  const s = schema as JsonSchema;

  // Handle nullable
  const makeNullable = (zodSchema: ZodType): ZodType => {
    return s.nullable ? z.union([zodSchema, z.null()]) : zodSchema;
  };

  // Handle const
  if (s.const !== undefined) {
    return z.literal(s.const as string | number | boolean);
  }

  // Handle enum
  if (s.enum) {
    const values = s.enum as [
      string | number | boolean,
      ...(string | number | boolean)[],
    ];
    return makeNullable(z.enum(values.map(String) as [string, ...string[]]));
  }

  // Handle anyOf
  if (s.anyOf && s.anyOf.length > 0) {
    const schemas = s.anyOf.map((sub) => jsonSchemaToZod(sub));
    if (schemas.length === 1) return schemas[0] ?? z.unknown();
    return z.union([
      schemas[0] ?? z.unknown(),
      schemas[1] ?? z.unknown(),
      ...schemas.slice(2),
    ]);
  }

  // Handle oneOf (same as anyOf for Zod purposes)
  if (s.oneOf && s.oneOf.length > 0) {
    const schemas = s.oneOf.map((sub) => jsonSchemaToZod(sub));
    if (schemas.length === 1) return schemas[0] ?? z.unknown();
    return z.union([
      schemas[0] ?? z.unknown(),
      schemas[1] ?? z.unknown(),
      ...schemas.slice(2),
    ]);
  }

  // Handle allOf (intersection)
  if (s.allOf && s.allOf.length > 0) {
    const schemas = s.allOf.map((sub) => jsonSchemaToZod(sub));
    return schemas.reduce((acc, curr) => z.intersection(acc, curr));
  }

  // Handle type
  switch (s.type) {
    case 'string':
      return makeNullable(buildStringSchema(s));
    case 'number':
    case 'integer':
      return makeNullable(buildNumberSchema(s));
    case 'boolean':
      return makeNullable(z.boolean());
    case 'null':
      return z.null();
    case 'array':
      return makeNullable(buildArraySchema(s));
    case 'object':
      return makeNullable(buildObjectSchema(s));
    default:
      // Unknown type, accept anything
      return z.unknown();
  }
}

function buildStringSchema(schema: JsonSchema): ZodType {
  let zodSchema = z.string();

  if (schema.description) {
    zodSchema = zodSchema.describe(schema.description);
  }

  // Format constraints
  switch (schema.format) {
    case 'email':
      zodSchema = zodSchema.email();
      break;
    case 'uri':
    case 'url':
      zodSchema = zodSchema.url();
      break;
    case 'uuid':
      zodSchema = zodSchema.uuid();
      break;
    case 'date-time':
      zodSchema = zodSchema.datetime();
      break;
    case 'date':
      zodSchema = zodSchema.date();
      break;
  }

  // Length constraints
  if (schema.minLength !== undefined) {
    zodSchema = zodSchema.min(schema.minLength);
  }
  if (schema.maxLength !== undefined) {
    zodSchema = zodSchema.max(schema.maxLength);
  }

  // Pattern constraint
  if (schema.pattern) {
    zodSchema = zodSchema.regex(new RegExp(schema.pattern));
  }

  return zodSchema;
}

function buildNumberSchema(schema: JsonSchema): ZodType {
  let zodSchema = schema.type === 'integer' ? z.number().int() : z.number();

  if (schema.description) {
    zodSchema = zodSchema.describe(schema.description);
  }

  if (schema.minimum !== undefined) {
    zodSchema = zodSchema.min(schema.minimum);
  }
  if (schema.maximum !== undefined) {
    zodSchema = zodSchema.max(schema.maximum);
  }

  return zodSchema;
}

function buildArraySchema(schema: JsonSchema): ZodType {
  const itemsSchema = schema.items
    ? jsonSchemaToZod(schema.items)
    : z.unknown();
  let zodSchema = z.array(itemsSchema);

  if (schema.description) {
    zodSchema = zodSchema.describe(schema.description);
  }

  return zodSchema;
}

function buildObjectSchema(schema: JsonSchema): ZodType {
  const properties = schema.properties ?? {};
  const required = new Set(schema.required ?? []);

  const shape: Record<string, ZodType> = {};
  for (const [key, propSchema] of Object.entries(properties)) {
    const zodProp = jsonSchemaToZod(propSchema);
    shape[key] = required.has(key) ? zodProp : zodProp.optional();
  }

  let zodSchema = z.object(shape);

  if (schema.description) {
    zodSchema = zodSchema.describe(schema.description);
  }

  return zodSchema;
}

/**
 * Convert a JSON Schema to a Zod schema with a default empty object fallback.
 *
 * @param schema - Optional JSON Schema object
 * @returns Zod schema (defaults to empty object schema)
 */
export function jsonSchemaToZodSafe(schema?: Record<string, unknown>): ZodType {
  if (!schema || Object.keys(schema).length === 0) {
    return z.object({});
  }
  return jsonSchemaToZod(schema);
}
