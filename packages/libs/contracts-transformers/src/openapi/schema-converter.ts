/**
 * JSON Schema to SchemaModel conversion utilities.
 * Converts OpenAPI JSON Schema to ContractSpec SchemaModel definitions.
 */

import { createSchemaGenerator } from './schema-generators';
import type {
  SchemaFormat,
  ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts';
import type { OpenApiSchema } from './types';
import { toPascalCase } from '../common/utils';

/**
 * Map JSON Schema types to ContractSpec ScalarTypeEnum values.
 */
const JSON_SCHEMA_TO_SCALAR: Record<string, string> = {
  string: 'ScalarTypeEnum.String_unsecure',
  integer: 'ScalarTypeEnum.Int_unsecure',
  number: 'ScalarTypeEnum.Float_unsecure',
  boolean: 'ScalarTypeEnum.Boolean',
  // Special formats
  'string:date': 'ScalarTypeEnum.Date',
  'string:date-time': 'ScalarTypeEnum.DateTime',
  'string:email': 'ScalarTypeEnum.EmailAddress',
  'string:uri': 'ScalarTypeEnum.URL',
  'string:uuid': 'ScalarTypeEnum.ID',
};

/**
 * TypeScript type representation for code generation.
 */
export interface TypescriptType {
  /** The type expression (e.g., "string", "number", "MyModel") */
  type: string;
  /** Whether the type is optional */
  optional: boolean;
  /** Whether the type is an array */
  array: boolean;
  /** Whether this is a primitive type */
  primitive: boolean;
  /** Description for documentation */
  description?: string;
  /** Whether this type is a reference to another schema (needs import) vs inline */
  isReference?: boolean;
}

/**
 * SchemaModel field representation for code generation.
 */
export interface SchemaField {
  /** Field name */
  name: string;
  /** Field type */
  type: TypescriptType;
  /** Scalar type enum value (for FieldType) */
  scalarType?: string;
  /** Enum values if this is an enum type */
  enumValues?: string[];
  /** Nested model if this is an object type */
  nestedModel?: GeneratedModel;
}

/**
 * Generated model representation.
 */
export interface GeneratedModel {
  /** Model name (PascalCase) */
  name: string;
  /** Model description */
  description?: string;
  /** Fields */
  fields: SchemaField[];
  /** Generated TypeScript code */
  code: string;
  /** Required imports */
  imports?: string[];
}

/**
 * Check if a schema is a reference object.
 */
function isReference(schema: OpenApiSchema): schema is { $ref: string } {
  return typeof schema === 'object' && schema !== null && '$ref' in schema;
}

/**
 * Extract type name from a $ref.
 */
function typeNameFromRef(ref: string): string {
  const parts = ref.split('/');
  return parts[parts.length - 1] ?? 'Unknown';
}

/**
 * Convert a JSON Schema to a TypeScript type representation.
 */
export function jsonSchemaToType(
  schema: OpenApiSchema,
  name?: string
): TypescriptType {
  if (isReference(schema)) {
    return {
      type: toPascalCase(typeNameFromRef(schema.$ref)),
      optional: false,
      array: false,
      primitive: false,
      isReference: true,
    };
  }

  const schemaObj = schema as Record<string, unknown>;
  const type = schemaObj['type'] as string | undefined;
  const format = schemaObj['format'] as string | undefined;
  const nullable = schemaObj['nullable'] as boolean | undefined;

  // Check if this schema was dereferenced from a $ref - use the original type name
  const originalTypeName = schemaObj['_originalTypeName'] as string | undefined;
  if (originalTypeName) {
    return {
      type: toPascalCase(originalTypeName),
      optional: nullable ?? false,
      array: false,
      primitive: false,
      isReference: true,
    };
  }

  // Handle arrays
  if (type === 'array') {
    const items = schemaObj['items'] as OpenApiSchema | undefined;
    if (items) {
      const itemType = jsonSchemaToType(items, name);
      return {
        ...itemType,
        array: true,
        optional: nullable ?? false,
      };
    }
    return {
      type: 'unknown',
      optional: nullable ?? false,
      array: true,
      primitive: false,
      isReference: true,
    };
  }

  // Handle objects
  if (type === 'object' || schemaObj['properties']) {
    return {
      type: name ? toPascalCase(name) : 'Record<string, unknown>',
      optional: nullable ?? false,
      array: false,
      primitive: false,
      isReference: true,
    };
  }

  // Handle enums
  if (schemaObj['enum']) {
    return {
      type: name ? toPascalCase(name) : 'string',
      optional: nullable ?? false,
      array: false,
      primitive: false,
      isReference: true,
    };
  }

  // Handle primitives
  const scalarKey = format ? `${type}:${format}` : type;
  if (scalarKey === 'string') {
    return {
      type: 'string',
      optional: nullable ?? false,
      array: false,
      primitive: true,
    };
  }
  if (scalarKey === 'integer' || type === 'number') {
    return {
      type: 'number',
      optional: nullable ?? false,
      array: false,
      primitive: true,
    };
  }
  if (scalarKey === 'boolean') {
    return {
      type: 'boolean',
      optional: nullable ?? false,
      array: false,
      primitive: true,
    };
  }

  // Default to unknown
  return {
    type: 'unknown',
    optional: nullable ?? false,
    array: false,
    primitive: false,
    isReference: true,
  };
}

/**
 * Get the ScalarTypeEnum value for a JSON Schema type.
 */
export function getScalarType(schema: OpenApiSchema): string | undefined {
  if (isReference(schema)) {
    return undefined;
  }

  const schemaObj = schema as Record<string, unknown>;
  const type = schemaObj['type'] as string | undefined;
  const format = schemaObj['format'] as string | undefined;

  if (!type) return undefined;

  // For arrays, get the scalar type of the items
  if (type === 'array') {
    const items = schemaObj['items'] as OpenApiSchema | undefined;
    if (items) {
      return getScalarType(items);
    }
    return undefined;
  }

  const key = format ? `${type}:${format}` : type;
  return JSON_SCHEMA_TO_SCALAR[key] ?? JSON_SCHEMA_TO_SCALAR[type] ?? undefined;
}

/**
 * Generate code for a schema model using the specified format.
 */
export function generateSchemaModelCode(
  schema: OpenApiSchema,
  modelName: string,
  schemaFormat: SchemaFormat = 'contractspec',
  config?: ResolvedContractsrcConfig
): GeneratedModel {
  const generator = createSchemaGenerator(schemaFormat, config);
  const result = generator.generateModel(schema, modelName, {
    description: (schema as Record<string, unknown>)['description'] as string,
  });

  return {
    name: result.name,
    description: (schema as Record<string, unknown>)['description'] as string,
    fields: [], // fields are processed internally by generators now
    code: result.code,
    imports: result.imports,
  };
}

/**
 * Generate import statements for a SchemaModel.
 */
export function generateImports(
  fields: SchemaField[],
  options: ResolvedContractsrcConfig,
  sameDirectory = true
): string {
  const imports = new Set<string>();
  const modelsDir = sameDirectory ? '.' : `../${options.conventions.models}`;

  imports.add(
    "import { defineSchemaModel, ScalarTypeEnum, EnumType } from '@contractspec/lib.schema';"
  );

  for (const field of fields) {
    // Only import fields that are actual references to other schemas (not inline types)
    if (
      field.type.isReference &&
      !field.type.primitive &&
      !field.enumValues &&
      !field.scalarType &&
      !field.nestedModel
    ) {
      // This is a reference to another schema model
      const modelName = field.type.type;
      const kebabName = modelName
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
      imports.add(`import { ${modelName} } from '${modelsDir}/${kebabName}';`);
    }
  }

  return Array.from(imports).join('\n');
}
