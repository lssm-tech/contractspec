import type {
  AnyEnumType,
  AnyFieldType,
  AnySchemaModel,
  SchemaModelFieldsAnyConfig,
} from '@contractspec/lib.schema';
import { isSchemaModel } from '@contractspec/lib.schema';
import type { SchemaModel } from '@contractspec/lib.schema';
import type { SchemaTypes } from '@pothos/core';

/**
 * Check if a value has getPothosInput method (SchemaModel specific).
 * Used for input type generation.
 */
function _hasGetPothosInput(x: unknown): x is { getPothosInput: () => string } {
  return (
    typeof x === 'object' &&
    x !== null &&
    'getPothosInput' in x &&
    typeof (x as { getPothosInput?: unknown }).getPothosInput === 'function'
  );
}

interface PothosNamed {
  getPothos: () => { name: string };
}
function isFieldType(
  x: unknown
): x is AnyFieldType | AnyEnumType | PothosNamed {
  return typeof (x as { getPothos?: unknown })?.getPothos === 'function';
}

function isEnumType(x: unknown): x is AnyEnumType {
  return (
    typeof (x as { getEnumValues?: unknown })?.getEnumValues === 'function' &&
    typeof (x as { getPothos?: unknown })?.getPothos === 'function'
  );
}

function mapScalarName(name: string): string {
  if (name === 'Boolean_unsecure') return 'Boolean';
  if (name === 'ID_unsecure') return 'ID';
  if (name === 'String_unsecure') return 'String';
  if (name === 'Int_unsecure') return 'Int';
  if (name === 'Float_unsecure') return 'Float';
  return name;
}

export function createInputTypeBuilder<T extends SchemaTypes>(
  builder: PothosSchemaTypes.SchemaBuilder<T>
) {
  const inputTypeCache = new Map<string, unknown>();
  const enumTypeCache = new Set<string>();

  function registerEnumsForModel(
    model: SchemaModel<SchemaModelFieldsAnyConfig>
  ) {
    const entries = Object.entries(model.config.fields) as [
      string,
      {
        type: unknown;
        isOptional: boolean;
        isArray?: boolean;
      },
    ][];
    for (const [, field] of entries) {
      const fieldType = field.type as AnySchemaModel | null | undefined;
      if (isSchemaModel(fieldType)) {
        registerEnumsForModel(fieldType);
      } else if (isEnumType((field as { type: unknown }).type)) {
        const enumObj = field.type as unknown as AnyEnumType;
        const name =
          (enumObj as { getName?: () => string }).getName?.() ??
          enumObj.getPothos().name;
        if (!enumTypeCache.has(name)) {
          builder.enumType(name as string, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            values: enumObj.getEnumValues() as any,
          });
          enumTypeCache.add(name);
        }
      }
    }
  }

  function ensureInputTypeForModel(
    model: SchemaModel<SchemaModelFieldsAnyConfig>
  ) {
    const typeName = String(model.config?.name ?? 'Input');
    const cached = inputTypeCache.get(typeName) as unknown;
    if (cached) return cached;
    // Pre-register any enum types used within this model (including nested models)
    registerEnumsForModel(model);
    const created = builder.inputType(model.getPothosInput(), {
      fields: (t) => {
        const entries = Object.entries(model.config.fields) as [
          string,
          {
            type: unknown;
            isOptional: boolean;
            isArray?: boolean;
          },
        ][];
        const acc: Record<string, unknown> = {};
        for (const [key, field] of entries) {
          const fieldType = field.type as AnySchemaModel | null | undefined;
          if (isSchemaModel(fieldType)) {
            const nested = ensureInputTypeForModel(fieldType);
            const typeRef = field.isArray
              ? ([nested] as never)
              : (nested as never);
            acc[key] = t.field({
              type: typeRef,
              required: !field.isOptional,
            });
          } else if (isFieldType((field as { type: unknown }).type)) {
            const typeName = mapScalarName(
              String((field.type as PothosNamed).getPothos().name)
            );
            const typeRef = field.isArray
              ? ([typeName] as never)
              : (typeName as never);
            acc[key] = t.field({
              type: typeRef,
              required: !field.isOptional,
            });
          } else {
            const typeRef = field.isArray
              ? (['JSON'] as never)
              : ('JSON' as never);
            acc[key] = t.field({
              type: typeRef,
              required: !field.isOptional,
            });
          }
        }
        return acc as never;
      },
    });
    inputTypeCache.set(typeName, created);
    return created;
  }

  function buildInputFieldArgs(model: AnySchemaModel | null) {
    if (!model) return null;
    // Only SchemaModel has config.fields
    if (!isSchemaModel(model)) {
      // For non-SchemaModel types, we can't build input fields
      return null;
    }
    if (
      !model.config?.fields ||
      Object.keys(model.config.fields).length === 0
    ) {
      return null;
    }
    const ref = ensureInputTypeForModel(model);
    return ref as never;
  }

  return { buildInputFieldArgs };
}
