/**
 * Zod schema wrapper for ContractSpec compatibility.
 *
 * Wraps raw Zod schemas to implement the SchemaType interface,
 * enabling direct Zod usage in ContractSpec definitions.
 *
 * @module ZodSchemaType
 */

import * as z from 'zod';
import type { SchemaModelType } from './SchemaModelType';

/**
 * Options for ZodSchemaType wrapper.
 */
export interface ZodSchemaTypeOptions {
  /** Name for GraphQL/JSON Schema representation */
  name?: string;
  /** Description for documentation */
  description?: string;
}

/**
 * Wrapper to use a raw Zod schema as a SchemaType.
 * Enables schema definition directly with Zod for maximum flexibility.
 *
 * @template T - The Zod schema type being wrapped
 *
 * @example
 * ```typescript
 * const UserSchema = fromZod(
 *   z.object({
 *     id: z.string().uuid(),
 *     name: z.string().min(1),
 *     email: z.string().email(),
 *   }),
 *   { name: 'User' }
 * );
 *
 * // Use in SchemaModel
 * const CreateUserInput = new SchemaModel({
 *   name: 'CreateUserInput',
 *   fields: {
 *     user: { type: UserSchema, isOptional: false },
 *   },
 * });
 * ```
 */
export class ZodSchemaType<T extends z.ZodType> implements SchemaModelType<
  z.infer<T>
> {
  private readonly schema: T;
  private readonly options: ZodSchemaTypeOptions;
  private cachedJsonSchema?: unknown;

  constructor(schema: T, options: ZodSchemaTypeOptions = {}) {
    this.schema = schema;
    this.options = options;
  }

  /**
   * Return the wrapped Zod schema.
   */
  getZod(): z.ZodType<z.infer<T>> {
    return this.schema as z.ZodType<z.infer<T>>;
  }

  /**
   * Return JSON Schema representation using Zod's toJSONSchema.
   */
  getJsonSchema(): unknown {
    if (this.cachedJsonSchema !== undefined) {
      return this.cachedJsonSchema;
    }

    this.cachedJsonSchema = z.toJSONSchema(this.schema);
    return this.cachedJsonSchema;
  }

  /**
   * Return GraphQL type info.
   * For complex Zod types, defaults to JSON scalar.
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
   * Get the configured description for this schema.
   */
  getDescription(): string | undefined {
    return this.options.description;
  }
}

/**
 * Helper to wrap a raw Zod schema as a SchemaType.
 *
 * @param schema - The Zod schema to wrap
 * @param options - Optional configuration
 * @returns A SchemaType-compatible wrapper
 *
 * @example
 * ```typescript
 * const AddressSchema = fromZod(
 *   z.object({
 *     street: z.string(),
 *     city: z.string(),
 *     country: z.string(),
 *   }),
 *   { name: 'Address', description: 'Physical address' }
 * );
 * ```
 */
export const fromZod = <T extends z.ZodType>(
  schema: T,
  options?: ZodSchemaTypeOptions
): ZodSchemaType<T> => new ZodSchemaType(schema, options);
