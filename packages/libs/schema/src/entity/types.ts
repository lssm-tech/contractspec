import { z } from 'zod';

/**
 * Prisma scalar types that can be used in entity field definitions.
 */
export type PrismaScalarType =
  | 'String'
  | 'Int'
  | 'Float'
  | 'Boolean'
  | 'DateTime'
  | 'Json'
  | 'BigInt'
  | 'Decimal'
  | 'Bytes';

/**
 * Prisma field modifiers.
 */
export interface PrismaFieldModifiers {
  /** Field is optional (nullable) */
  isOptional?: boolean;
  /** Field is an array */
  isArray?: boolean;
  /** Field is unique */
  isUnique?: boolean;
  /** Field is the primary key (use @id) */
  isId?: boolean;
  /** Default value expression (e.g., 'cuid()', 'now()', 'autoincrement()') */
  default?: string | number | boolean;
  /** Field is auto-updated on record update (e.g., @updatedAt) */
  updatedAt?: boolean;
  /** Database column name override */
  map?: string;
  /** Database column type override */
  dbType?: string;
}

/**
 * Scalar field definition for an entity.
 */
export interface EntityScalarField extends PrismaFieldModifiers {
  kind: 'scalar';
  type: PrismaScalarType;
  /** Zod schema for validation */
  zod?: z.ZodType;
  /** Human-readable description (becomes Prisma /// comment) */
  description?: string;
}

/**
 * Enum field definition for an entity.
 */
export interface EntityEnumField extends PrismaFieldModifiers {
  kind: 'enum';
  /** Name of the enum type */
  enumName: string;
  /** Enum values (for inline enum definition) */
  values?: readonly string[];
  /** Zod schema for validation */
  zod?: z.ZodType;
  /** Human-readable description */
  description?: string;
}

/**
 * Relation types supported by Prisma.
 */
export type RelationType = 'hasOne' | 'hasMany' | 'belongsTo';

/**
 * Relation field definition for an entity.
 */
export interface EntityRelationField {
  kind: 'relation';
  type: RelationType;
  /** Target entity name */
  target: string;
  /** Foreign key field(s) on this model (for belongsTo) */
  fields?: string[];
  /** Referenced field(s) on the target model */
  references?: string[];
  /** Relation name for disambiguation */
  name?: string;
  /** On delete action */
  onDelete?: 'Cascade' | 'SetNull' | 'Restrict' | 'NoAction' | 'SetDefault';
  /** On update action */
  onUpdate?: 'Cascade' | 'SetNull' | 'Restrict' | 'NoAction' | 'SetDefault';
  /** Human-readable description */
  description?: string;
}

/**
 * Union of all entity field types.
 */
export type EntityField = EntityScalarField | EntityEnumField | EntityRelationField;

/**
 * Index definition for an entity.
 */
export interface EntityIndex {
  /** Fields included in the index */
  fields: string[];
  /** Index is unique constraint */
  unique?: boolean;
  /** Index name override */
  name?: string;
  /** Sort order per field */
  sort?: Record<string, 'Asc' | 'Desc'>;
  /** Index type */
  type?: 'BTree' | 'Hash' | 'Gist' | 'Gin';
}

/**
 * Enum definition that can be shared across entities.
 */
export interface EntityEnumDef {
  /** Enum name */
  name: string;
  /** Enum values */
  values: readonly string[];
  /** Postgres schema where the enum is defined */
  schema?: string;
  /** Human-readable description */
  description?: string;
}

/**
 * Complete entity specification for database-backed models.
 */
export interface EntitySpec<
  TFields extends Record<string, EntityField> = Record<string, EntityField>,
> {
  /** Entity/model name (PascalCase) */
  name: string;
  /** Human-readable description (becomes Prisma /// comment) */
  description?: string;
  /** Postgres schema name (default: 'public') */
  schema?: string;
  /** Database table name override */
  map?: string;
  /** Field definitions */
  fields: TFields;
  /** Index definitions */
  indexes?: EntityIndex[];
  /** Enum definitions used by this entity */
  enums?: EntityEnumDef[];
  /** Module/domain this entity belongs to (for schema composition) */
  module?: string;
}

/**
 * Module schema contribution for composition.
 */
export interface ModuleSchemaContribution {
  /** Module identifier (e.g., '@lssm/lib.identity-rbac') */
  moduleId: string;
  /** Entity specs provided by this module */
  entities: EntitySpec[];
  /** Shared enum definitions */
  enums?: EntityEnumDef[];
}

