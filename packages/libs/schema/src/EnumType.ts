import * as z from 'zod';
import { GraphQLEnumType } from 'graphql';

/**
 * Strongly-typed string enum wrapper with one source of truth for zod, GraphQL, and JSON Schema.
 */
export class EnumType<T extends [string, ...string[]]> {
  private readonly name: string;
  private readonly values: T;
  private readonly gqlEnum: GraphQLEnumType;

  constructor(name: string, values: T) {
    this.name = name;
    this.values = values;
    this.gqlEnum = new GraphQLEnumType({
      name: this.name,
      values: Object.fromEntries(values.map((v) => [v, { value: v }] as const)),
    });
  }

  /** Enum type name (used by GraphQL and JSON Schema). */
  getName(): string {
    return this.name;
  }

  /** Returns the literal tuple of allowed values. */
  getEnumValues(): T {
    return this.values;
  }

  // For SchemaModel and adapters expecting a Pothos/GraphQL type-like object
  /** GraphQL enum instance suitable for Pothos or vanilla GraphQL schemas. */
  getPothos(): GraphQLEnumType {
    return this.gqlEnum;
  }

  /** zod schema representing this enum. */
  getZod(): z.ZodEnum<{ [K in T[number]]: K }> {
    return z.enum(this.values);
  }

  /** Minimal JSON representation (alias of getJsonSchema). */
  getJson(): { type: 'string'; enum: T } {
    return { type: 'string', enum: this.values } as const;
  }

  /** JSON Schema for this enum. */
  getJsonSchema(): { type: 'string'; enum: T } {
    return this.getJson();
  }
}

export type AnyEnumType = EnumType<[string, ...string[]]>;

/**
 * Helper to define an EnumType.
 * @param name Display/type name used across GraphQL and JSON Schema
 * @param values Literal tuple of allowed string values (at least one)
 */
export const defineEnum = <T extends [string, ...string[]]>(
  name: string,
  values: T
) => new EnumType(name, values);
