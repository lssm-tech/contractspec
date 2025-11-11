import { z } from 'zod';
import {
  GraphQLScalarType,
  type GraphQLScalarTypeConfig,
  Kind,
  type ValueNode,
} from 'graphql';

export interface FieldTypeConfig<TInternal, TExternal = TInternal>
  extends GraphQLScalarTypeConfig<TInternal, TExternal> {
  zod: z.ZodType<TInternal>;
  jsonSchema: unknown | (() => unknown);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFieldType = FieldType<any, any>;

/**
 * GraphQL scalar wrapper that carries zod and JSON Schema metadata.
 *
 * TInternal is the runtime representation; TExternal is the GraphQL output.
 */
export class FieldType<
  TInternal,
  TExternal = TInternal,
> extends GraphQLScalarType<TInternal, TExternal> {
  private zodSchema: z.ZodType<TInternal>;
  private readonly jsonSchemaDef?: unknown | (() => unknown);

  constructor(config: FieldTypeConfig<TInternal, TExternal>) {
    super(config);
    this.zodSchema = config.zod;
    this.jsonSchemaDef = config.jsonSchema;
  }

  /** Return the attached zod schema for validation. */
  getZod(): z.ZodType<TInternal> {
    return this.zodSchema;
  }

  /** GraphQL scalar instance usable by Pothos or vanilla GraphQL. */
  getPothos(): GraphQLScalarType<TInternal, TExternal> {
    return this;
  }

  /** Return the JSON Schema (evaluates factory if provided). */
  getJson(): unknown {
    return typeof this.jsonSchemaDef === 'function'
      ? (this.jsonSchemaDef as () => unknown)()
      : this.jsonSchemaDef;
  }

  // Return the raw jsonSchema config (value or factory)
  getJsonSchemaDef(): unknown | (() => unknown) {
    return this.jsonSchemaDef;
  }

  // Return a deep-resolved JSON Schema (evaluates factory and nested factories)
  getJsonSchema(): unknown {
    const deepResolve = (v: unknown): unknown => {
      const value = typeof v === 'function' ? (v as () => unknown)() : v;
      if (Array.isArray(value)) return value.map((item) => deepResolve(item));
      if (value && typeof value === 'object') {
        const obj: Record<string, unknown> = {};
        for (const [k, val] of Object.entries(
          value as Record<string, unknown>
        )) {
          obj[k] = deepResolve(val);
        }
        return obj;
      }
      return value;
    };
    return deepResolve(this.getJson());
  }
}

export type ZodFieldType<Field extends AnyFieldType> = z.infer<
  ReturnType<Field['getZod']>
>;
