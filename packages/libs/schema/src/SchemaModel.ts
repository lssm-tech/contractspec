import { type AnyFieldType } from './FieldType';
import { type AnyEnumType } from './EnumType';
import { type SchemaModelType } from './SchemaModelType';
import * as z from 'zod';
import type { Maybe } from 'graphql/jsutils/Maybe';

/**
 * All types that can be used as field types in a SchemaModel.
 * Supports FieldType, EnumType, nested SchemaModel, or any SchemaType implementation.
 */
type FieldLike = AnyFieldType | AnyEnumType | AnySchemaModel | SchemaModelType;

/** Field configuration for a SchemaModel property. */
export interface SchemaFieldConfig<Type extends FieldLike = FieldLike> {
  type: Type;
  isOptional: boolean;
  /** When present and true, the field is an array */
  isArray?: true;
}

export type SchemaModelFieldsAnyConfig<Type extends FieldLike = FieldLike> =
  Record<string, SchemaFieldConfig<Type>>;

/** Model definition: name and fields. */
export interface SchemaModelConfig<Fields extends SchemaModelFieldsAnyConfig> {
  name: string;
  description?: Maybe<string>;
  fields: Fields;
}

/**
 * Named object model built from FieldType/EnumType/SchemaModel fields.
 * Provides zod and GraphQL input helpers, and supports arrays/optional fields.
 */
export class SchemaModel<
  Fields extends SchemaModelFieldsAnyConfig,
> implements SchemaModelType {
  constructor(public readonly config: SchemaModelConfig<Fields>) {}

  /**
   * Build a typed ZodObject from the model fields, preserving each field's
   * Zod schema and optionality at the type level when possible.
   */
  getZod(): TopLevelZodFromModel<Fields> {
    const shape = Object.entries(this.config.fields).reduce(
      (acc, [key, def]) => {
        const base: z.ZodType = (
          def.type as unknown as { getZod: () => z.ZodType }
        ).getZod();
        const withArray = def.isArray ? z.array(base) : base;
        (acc as Record<string, z.ZodType>)[key] = def.isOptional
          ? withArray.optional()
          : withArray;
        return acc;
      },
      {} as Record<string, z.ZodType>
    ) as unknown as ZodShapeFromFields<Fields>;

    return z.object(shape) as z.ZodObject<ZodShapeFromFields<Fields>>;
  }

  /** Input object name for GraphQL builder adapters. */
  getPothosInput() {
    return this.config.name;
  }
}

/**
 * Union of all types that can serve as a schema model.
 * This is the main type expected by OperationSpec, EventSpec, FormSpec, etc.
 *
 * Supports:
 * - SchemaModel instances (native ContractSpec types)
 * - Any SchemaType implementation (ZodSchemaType, JsonSchemaType, etc.)
 */
export type AnySchemaModel =
  | SchemaModel<SchemaModelFieldsAnyConfig>
  | SchemaModelType;

/**
 * Type guard to check if a value is a SchemaModel (not just any SchemaType).
 * Use this when you need to access SchemaModel-specific properties like `config`.
 *
 * @param model - The model to check
 * @returns True if the model is a SchemaModel instance
 *
 * @example
 * ```typescript
 * if (isSchemaModel(model)) {
 *   // TypeScript knows model.config is available
 *   console.log(model.config.name);
 * }
 * ```
 */
export function isSchemaModel(
  model: AnySchemaModel | null | undefined
): model is SchemaModel<SchemaModelFieldsAnyConfig> {
  return (
    model !== null &&
    model !== undefined &&
    'config' in model &&
    typeof (model as SchemaModel<SchemaModelFieldsAnyConfig>).config ===
      'object' &&
    'name' in (model as SchemaModel<SchemaModelFieldsAnyConfig>).config
  );
}

export type ZodSchemaModel<Field extends AnySchemaModel> = z.infer<
  ReturnType<Field['getZod']>
>;

type InferZodFromType<T> =
  T extends SchemaModel<SchemaModelFieldsAnyConfig>
    ? z.ZodObject<z.ZodRawShape>
    : T extends AnyFieldType
      ? ReturnType<T['getZod']>
      : T extends AnyEnumType
        ? ReturnType<T['getZod']>
        : T extends SchemaModelType
          ? ReturnType<T['getZod']>
          : z.ZodUnknown;

type MaybeArray<Z extends z.ZodType, A> = A extends true ? z.ZodArray<Z> : Z;
type MaybeOptional<Z extends z.ZodType, O> = O extends true
  ? z.ZodOptional<Z>
  : Z;

/**
 * Helper type: derive the Zod shape from the field config.
 * Supports nested SchemaModel and arrays, preserving optionality and list-ness.
 */
type FieldIsArray<FC> = FC extends { isArray: true } ? true : false;

export type ZodShapeFromFields<F extends SchemaModelFieldsAnyConfig> = {
  [K in keyof F]: MaybeOptional<
    MaybeArray<InferZodFromType<F[K]['type']>, FieldIsArray<F[K]>>,
    F[K]['isOptional']
  >;
};

/**
 * The top-level Zod schema returned by getZod():
 * either ZodObject<...> or ZodArray<ZodObject<...>> when config.isArray.
 */
export type TopLevelZodFromModel<F extends SchemaModelFieldsAnyConfig> =
  z.ZodObject<ZodShapeFromFields<F>>;

/**
 * Helper to define a SchemaModel with type inference.
 * Equivalent to `new SchemaModel(config)` but with better ergonomics.
 */
export const defineSchemaModel = <Fields extends SchemaModelFieldsAnyConfig>(
  config: SchemaModelConfig<Fields>
): SchemaModel<Fields> => new SchemaModel(config);
