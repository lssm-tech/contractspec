/**
 * JSON Schema to SchemaModel conversion utilities.
 * Converts OpenAPI JSON Schema to ContractSpec SchemaModel definitions.
 */

import type { OpenApiSchema } from './types';
import { toPascalCase, toCamelCase, toValidIdentifier } from '../common/utils';

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
}

/**
 * Map JSON Schema types to ContractSpec ScalarTypeEnum values.
 */
const JSON_SCHEMA_TO_SCALAR: Record<string, string> = {
  string: 'ScalarTypeEnum.STRING',
  integer: 'ScalarTypeEnum.INT',
  number: 'ScalarTypeEnum.FLOAT',
  boolean: 'ScalarTypeEnum.BOOLEAN',
  // Special formats
  'string:date': 'ScalarTypeEnum.DATE',
  'string:date-time': 'ScalarTypeEnum.DATE_TIME',
  'string:email': 'ScalarTypeEnum.EMAIL',
  'string:uri': 'ScalarTypeEnum.URL',
  'string:uuid': 'ScalarTypeEnum.ID',
};

/**
 * Check if a schema is a reference object.
 */
function isReference(schema: OpenApiSchema): schema is { $ref: string } {
  return '$ref' in schema;
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
    };
  }

  const schemaObj = schema as Record<string, unknown>;
  const type = schemaObj['type'] as string | undefined;
  const format = schemaObj['format'] as string | undefined;
  const nullable = schemaObj['nullable'] as boolean | undefined;

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
    };
  }

  // Handle objects
  if (type === 'object' || schemaObj['properties']) {
    return {
      type: name ? toPascalCase(name) : 'Record<string, unknown>',
      optional: nullable ?? false,
      array: false,
      primitive: false,
    };
  }

  // Handle enums
  if (schemaObj['enum']) {
    return {
      type: name ? toPascalCase(name) : 'string',
      optional: nullable ?? false,
      array: false,
      primitive: false,
    };
  }

  // Handle primitives
  const scalarKey = format ? `${type}:${format}` : type;
  if (type === 'string') {
    return {
      type: 'string',
      optional: nullable ?? false,
      array: false,
      primitive: true,
    };
  }
  if (type === 'integer' || type === 'number') {
    return {
      type: 'number',
      optional: nullable ?? false,
      array: false,
      primitive: true,
    };
  }
  if (type === 'boolean') {
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

  const key = format ? `${type}:${format}` : type;
  return JSON_SCHEMA_TO_SCALAR[key] ?? JSON_SCHEMA_TO_SCALAR[type];
}

/**
 * Convert a JSON Schema to a SchemaModel field definition.
 */
export function jsonSchemaToField(
  schema: OpenApiSchema,
  fieldName: string,
  required: boolean
): SchemaField {
  const type = jsonSchemaToType(schema, fieldName);
  const scalarType = getScalarType(schema);

  // Handle enums
  let enumValues: string[] | undefined;
  if (!isReference(schema)) {
    const schemaObj = schema as Record<string, unknown>;
    const enumArr = schemaObj['enum'] as unknown[] | undefined;
    if (enumArr) {
      enumValues = enumArr.map(String);
    }
  }

  return {
    name: toValidIdentifier(toCamelCase(fieldName)),
    type: {
      ...type,
      optional: !required || type.optional,
      description: !isReference(schema)
        ? ((schema as Record<string, unknown>)['description'] as string)
        : undefined,
    },
    scalarType,
    enumValues,
  };
}

/**
 * Generate SchemaModel TypeScript code for a JSON Schema object.
 */
export function generateSchemaModelCode(
  schema: OpenApiSchema,
  modelName: string,
  indent = 0
): GeneratedModel {
  const spaces = '  '.repeat(indent);
  const fields: SchemaField[] = [];
  let description: string | undefined;

  if (isReference(schema)) {
    // Reference type - just use the referenced type
    return {
      name: toPascalCase(typeNameFromRef(schema.$ref)),
      fields: [],
      code: `// Reference to ${schema.$ref}`,
    };
  }

  const schemaObj = schema as Record<string, unknown>;
  description = schemaObj['description'] as string | undefined;
  const properties = schemaObj['properties'] as
    | Record<string, OpenApiSchema>
    | undefined;
  const required = (schemaObj['required'] as string[]) ?? [];

  if (!properties) {
    // No properties - generate an empty model or type alias
    return {
      name: toPascalCase(modelName),
      description,
      fields: [],
      code: `${spaces}// Empty schema for ${modelName}`,
    };
  }

  // Generate fields
  for (const [propName, propSchema] of Object.entries(properties)) {
    const isRequired = required.includes(propName);
    fields.push(jsonSchemaToField(propSchema, propName, isRequired));
  }

  // Generate code
  const lines: string[] = [];

  // Model definition
  const safeModelName = toPascalCase(toValidIdentifier(modelName));
  lines.push(`${spaces}export const ${safeModelName} = defineSchemaModel({`);
  lines.push(`${spaces}  name: '${safeModelName}',`);
  if (description) {
    lines.push(`${spaces}  description: ${JSON.stringify(description)},`);
  }
  lines.push(`${spaces}  fields: {`);

  for (const field of fields) {
    const fieldLines = generateFieldCode(field, indent + 2);
    lines.push(fieldLines);
  }

  lines.push(`${spaces}  },`);
  lines.push(`${spaces}});`);

  return {
    name: safeModelName,
    description,
    fields,
    code: lines.join('\n'),
  };
}

/**
 * Generate TypeScript code for a single field.
 */
function generateFieldCode(field: SchemaField, indent: number): string {
  const spaces = '  '.repeat(indent);
  const lines: string[] = [];

  lines.push(`${spaces}${field.name}: {`);

  // Type
  if (field.enumValues) {
    // Enum type
    lines.push(
      `${spaces}  type: new EnumType([${field.enumValues.map((v) => `'${v}'`).join(', ')}]),`
    );
  } else if (field.scalarType) {
    // Scalar type
    lines.push(`${spaces}  type: ${field.scalarType},`);
  } else {
    // Nested model or reference
    lines.push(
      `${spaces}  type: ${field.type.type}, // TODO: Define or import this type`
    );
  }

  // Optional
  if (field.type.optional) {
    lines.push(`${spaces}  isOptional: true,`);
  }

  // Array
  if (field.type.array) {
    lines.push(`${spaces}  isArray: true,`);
  }

  lines.push(`${spaces}},`);

  return lines.join('\n');
}

/**
 * Generate import statements for a SchemaModel.
 */
export function generateImports(fields: SchemaField[]): string {
  const imports = new Set<string>();

  imports.add(
    "import { defineSchemaModel, ScalarTypeEnum, EnumType } from '@lssm/lib.schema';"
  );

  // Check if we need any custom type imports
  for (const field of fields) {
    if (!field.type.primitive && !field.enumValues && !field.scalarType) {
      // This is a reference to another model - would need import
      // imports.add(`import { ${field.type.type} } from './${toKebabCase(field.type.type)}';`);
    }
  }

  return Array.from(imports).join('\n');
}
