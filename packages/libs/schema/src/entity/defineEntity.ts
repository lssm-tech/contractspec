import { z } from 'zod';
import type {
  EntitySpec,
  EntityField,
  EntityScalarField,
  EntityEnumField,
  EntityRelationField,
  PrismaScalarType,
  EntityEnumDef,
  EntityIndex,
} from './types';

/**
 * Helper to define a database entity with full type safety.
 *
 * @example
 * ```typescript
 * const UserEntity = defineEntity({
 *   name: 'User',
 *   schema: 'lssm_sigil',
 *   description: 'A user of the platform.',
 *   fields: {
 *     id: field.id(),
 *     email: field.string({ isUnique: true, zod: z.string().email() }),
 *     name: field.string({ isOptional: true }),
 *     createdAt: field.createdAt(),
 *     updatedAt: field.updatedAt(),
 *     memberships: field.hasMany('Member'),
 *   },
 *   indexes: [{ fields: ['email'], unique: true }],
 * });
 * ```
 */
export function defineEntity<TFields extends Record<string, EntityField>>(
  spec: EntitySpec<TFields>
): EntitySpec<TFields> {
  return spec;
}

/**
 * Helper to define an enum that can be shared across entities.
 */
export function defineEntityEnum(def: EntityEnumDef): EntityEnumDef {
  return def;
}

/**
 * Field builder helpers for common field patterns.
 */
export const field = {
  // ============ Scalar fields ============

  /** String field */
  string(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'String', ...opts };
  },

  /** Integer field */
  int(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'Int', ...opts };
  },

  /** Float field */
  float(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'Float', ...opts };
  },

  /** Boolean field */
  boolean(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'Boolean', ...opts };
  },

  /** DateTime field */
  dateTime(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'DateTime', ...opts };
  },

  /** JSON field */
  json(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'Json', ...opts };
  },

  /** BigInt field */
  bigInt(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'BigInt', ...opts };
  },

  /** Decimal field */
  decimal(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'Decimal', ...opts };
  },

  /** Bytes field */
  bytes(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'Bytes', ...opts };
  },

  // ============ Common patterns ============

  /** Primary key field with cuid() default */
  id(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type' | 'isId'>>
  ): EntityScalarField {
    return {
      kind: 'scalar',
      type: 'String',
      isId: true,
      default: 'cuid()',
      ...opts,
    };
  },

  /** Primary key field with uuid() default */
  uuid(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type' | 'isId'>>
  ): EntityScalarField {
    return {
      kind: 'scalar',
      type: 'String',
      isId: true,
      default: 'uuid()',
      ...opts,
    };
  },

  /** Auto-increment integer primary key */
  autoIncrement(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type' | 'isId'>>
  ): EntityScalarField {
    return {
      kind: 'scalar',
      type: 'Int',
      isId: true,
      default: 'autoincrement()',
      ...opts,
    };
  },

  /** createdAt timestamp with now() default */
  createdAt(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type' | 'default'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'DateTime', default: 'now()', ...opts };
  },

  /** updatedAt timestamp with @updatedAt */
  updatedAt(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type' | 'updatedAt'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'DateTime', updatedAt: true, ...opts };
  },

  /** Email field with validation */
  email(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return {
      kind: 'scalar',
      type: 'String',
      zod: z.string().email(),
      ...opts,
    };
  },

  /** URL field with validation */
  url(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return {
      kind: 'scalar',
      type: 'String',
      zod: z.string().url(),
      ...opts,
    };
  },

  // ============ Enum fields ============

  /** Enum field */
  enum(
    enumName: string,
    opts?: Partial<Omit<EntityEnumField, 'kind' | 'enumName'>>
  ): EntityEnumField {
    return { kind: 'enum', enumName, ...opts };
  },

  /** Inline enum field with values */
  inlineEnum(
    enumName: string,
    values: readonly string[],
    opts?: Partial<Omit<EntityEnumField, 'kind' | 'enumName' | 'values'>>
  ): EntityEnumField {
    return { kind: 'enum', enumName, values, ...opts };
  },

  // ============ Relation fields ============

  /** Has one relation (1:1 inverse side) */
  hasOne(
    target: string,
    opts?: Partial<Omit<EntityRelationField, 'kind' | 'type' | 'target'>>
  ): EntityRelationField {
    return { kind: 'relation', type: 'hasOne', target, ...opts };
  },

  /** Has many relation (1:N inverse side) */
  hasMany(
    target: string,
    opts?: Partial<Omit<EntityRelationField, 'kind' | 'type' | 'target'>>
  ): EntityRelationField {
    return { kind: 'relation', type: 'hasMany', target, ...opts };
  },

  /** Belongs to relation (N:1 owning side with foreign key) */
  belongsTo(
    target: string,
    fields: string[],
    references: string[],
    opts?: Partial<
      Omit<
        EntityRelationField,
        'kind' | 'type' | 'target' | 'fields' | 'references'
      >
    >
  ): EntityRelationField {
    return {
      kind: 'relation',
      type: 'belongsTo',
      target,
      fields,
      references,
      ...opts,
    };
  },

  /** Foreign key field (string) - use with belongsTo */
  foreignKey(
    opts?: Partial<Omit<EntityScalarField, 'kind' | 'type'>>
  ): EntityScalarField {
    return { kind: 'scalar', type: 'String', ...opts };
  },
};

/**
 * Index builder helpers.
 */
export const index = {
  /** Create a regular index */
  on(
    fields: string[],
    opts?: Partial<Omit<EntityIndex, 'fields'>>
  ): EntityIndex {
    return { fields, ...opts };
  },

  /** Create a unique constraint index */
  unique(
    fields: string[],
    opts?: Partial<Omit<EntityIndex, 'fields' | 'unique'>>
  ): EntityIndex {
    return { fields, unique: true, ...opts };
  },

  /** Create a compound index with sort orders */
  compound(
    fields: string[],
    sort: Record<string, 'Asc' | 'Desc'>,
    opts?: Partial<Omit<EntityIndex, 'fields' | 'sort'>>
  ): EntityIndex {
    return { fields, sort, ...opts };
  },
};
