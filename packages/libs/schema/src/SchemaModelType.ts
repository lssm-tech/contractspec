/**
 * Unified schema type interface for ContractSpec.
 *
 * This module provides a vendor-agnostic abstraction over different schema
 * definition approaches (SchemaModel, Zod, JSON Schema, GraphQL scalars).
 *
 * @module SchemaType
 */

import type * as z from 'zod';

/**
 * Supported schema output formats for code generation.
 */
export type SchemaFormat = 'contractspec' | 'zod' | 'json-schema' | 'graphql';

/**
 * Unified interface for all schema-compatible types.
 * Any type used in ContractSpec schemas must implement this interface.
 *
 * @template T - The TypeScript type this schema represents
 *
 * @example
 * ```typescript
 * // All of these implement SchemaType:
 * const fieldType = ScalarTypeEnum.String_unsecure();
 * const schemaModel = new SchemaModel({ name: 'User', fields: {...} });
 * const zodWrapper = fromZod(z.object({ name: z.string() }));
 * ```
 */
export interface SchemaModelType<T = unknown> {
  /**
   * Return the Zod schema for runtime validation.
   * This is the primary method - all schema types must provide Zod conversion.
   */
  getZod(): z.ZodType<T>;

  /**
   * Return GraphQL type info for Pothos/GraphQL integration.
   * Optional - types without GraphQL representation return undefined.
   */
  getPothos?(): unknown;

  /**
   * Return JSON Schema representation.
   * Optional - types without JSON Schema representation return undefined.
   */
  getJsonSchema?(): unknown;
}

/**
 * Type guard to check if a value implements the SchemaType interface.
 *
 * @param value - Value to check
 * @returns True if value has a getZod method
 *
 * @example
 * ```typescript
 * if (isSchemaType(field.type)) {
 *   const zodSchema = field.type.getZod();
 * }
 * ```
 */
export function isSchemaType(value: unknown): value is SchemaModelType {
  return (
    value !== null &&
    typeof value === 'object' &&
    'getZod' in value &&
    typeof (value as SchemaModelType).getZod === 'function'
  );
}

/**
 * Type alias for any SchemaType implementation.
 */
export type AnySchemaType = SchemaModelType<unknown>;
