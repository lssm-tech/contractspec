/**
 * JSON Schema wrapper for ContractSpec compatibility.
 *
 * Wraps JSON Schema definitions to implement the SchemaType interface,
 * enabling direct JSON Schema usage in ContractSpec definitions.
 *
 * @module JsonSchemaType
 */

import * as z from 'zod';
import type { SchemaModelType } from './SchemaModelType';

/**
 * JSON Schema definition structure.
 * Supports standard JSON Schema draft-07/2020-12 properties.
 */
export interface JsonSchemaDefinition {
  type?: string | string[];
  properties?: Record<string, JsonSchemaDefinition>;
  required?: string[];
  additionalProperties?: boolean | JsonSchemaDefinition;
  items?: JsonSchemaDefinition | JsonSchemaDefinition[];
  enum?: unknown[];
  const?: unknown;
  oneOf?: JsonSchemaDefinition[];
  anyOf?: JsonSchemaDefinition[];
  allOf?: JsonSchemaDefinition[];
  $ref?: string;
  title?: string;
  description?: string;
  default?: unknown;
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  [key: string]: unknown;
}

/**
 * Options for JsonSchemaType wrapper.
 */
export interface JsonSchemaTypeOptions {
  /** Name for identification */
  name?: string;
}

/**
 * Wrapper to use JSON Schema as a SchemaType.
 * Converts to Zod at runtime for validation.
 *
 * @example
 * ```typescript
 * const CustomFieldsSchema = fromJsonSchema({
 *   type: 'object',
 *   additionalProperties: {
 *     oneOf: [
 *       { type: 'string' },
 *       { type: 'number' },
 *       { type: 'boolean' },
 *     ],
 *   },
 * }, { name: 'CustomFields' });
 * ```
 */
export class JsonSchemaType implements SchemaModelType<
  Record<string, unknown>
> {
  private readonly jsonSchema: JsonSchemaDefinition;
  private readonly options: JsonSchemaTypeOptions;
  private cachedZod?: z.ZodType<Record<string, unknown>>;

  constructor(
    jsonSchema: JsonSchemaDefinition,
    options: JsonSchemaTypeOptions = {}
  ) {
    this.jsonSchema = jsonSchema;
    this.options = options;
  }

  /**
   * Convert JSON Schema to Zod schema for runtime validation.
   *
   * Note: This is a simplified conversion. For complex schemas,
   * consider using a dedicated json-schema-to-zod library.
   */
  getZod(): z.ZodType<Record<string, unknown>> {
    if (this.cachedZod) {
      return this.cachedZod;
    }

    // Handle additionalProperties (dictionary/record types)
    if (this.jsonSchema.additionalProperties !== undefined) {
      if (this.jsonSchema.additionalProperties === true) {
        this.cachedZod = z.record(z.string(), z.unknown());
        return this.cachedZod;
      }
      if (typeof this.jsonSchema.additionalProperties === 'object') {
        // For typed additionalProperties, use union or unknown
        this.cachedZod = z.record(z.string(), z.unknown());
        return this.cachedZod;
      }
      if (this.jsonSchema.additionalProperties === false) {
        this.cachedZod = z.object({}).strict();
        return this.cachedZod;
      }
    }

    // Handle explicit properties
    if (this.jsonSchema.properties) {
      const shape: Record<string, z.ZodType> = {};
      const required = new Set(this.jsonSchema.required ?? []);

      for (const [key, propSchema] of Object.entries(
        this.jsonSchema.properties
      )) {
        const fieldType = this.convertPropertyToZod(propSchema);
        shape[key] = required.has(key) ? fieldType : fieldType.optional();
      }

      this.cachedZod = z.object(shape).passthrough();
      return this.cachedZod;
    }

    // Default: passthrough object
    this.cachedZod = z.object({}).passthrough();
    return this.cachedZod;
  }

  /**
   * Return the original JSON Schema.
   */
  getJsonSchema(): JsonSchemaDefinition {
    return this.jsonSchema;
  }

  /**
   * Return GraphQL type info.
   * JSON Schema types map to JSON scalar in GraphQL.
   */
  getPothos(): { type: string; name?: string } {
    return { type: 'JSON', name: this.options.name };
  }

  /**
   * Get the configured name for this schema.
   */
  getName(): string | undefined {
    return this.options.name;
  }

  /**
   * Convert a single JSON Schema property to Zod.
   */
  private convertPropertyToZod(schema: JsonSchemaDefinition): z.ZodType {
    const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;

    switch (type) {
      case 'string':
        return z.string();
      case 'number':
      case 'integer':
        return z.number();
      case 'boolean':
        return z.boolean();
      case 'array':
        if (schema.items && !Array.isArray(schema.items)) {
          return z.array(this.convertPropertyToZod(schema.items));
        }
        return z.array(z.unknown());
      case 'object':
        if (schema.properties) {
          return new JsonSchemaType(schema).getZod();
        }
        return z.record(z.string(), z.unknown());
      case 'null':
        return z.null();
      default:
        return z.unknown();
    }
  }
}

/**
 * Helper to create a SchemaType from JSON Schema.
 *
 * @param schema - The JSON Schema definition
 * @param options - Optional configuration
 * @returns A SchemaType-compatible wrapper
 *
 * @example
 * ```typescript
 * const MetadataSchema = fromJsonSchema({
 *   type: 'object',
 *   properties: {
 *     createdAt: { type: 'string', format: 'date-time' },
 *     updatedAt: { type: 'string', format: 'date-time' },
 *   },
 *   required: ['createdAt'],
 * });
 * ```
 */
export const fromJsonSchema = (
  schema: JsonSchemaDefinition,
  options?: JsonSchemaTypeOptions
): JsonSchemaType => new JsonSchemaType(schema, options);
