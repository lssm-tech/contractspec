/**
 * JSON Schema to SchemaModel conversion utilities.
 * Converts OpenAPI JSON Schema to ContractSpec SchemaModel definitions.
 */

import type { OpenApiSchema } from './types';
import { toCamelCase, toPascalCase, toValidIdentifier } from '../common/utils';
import type { ContractsrcConfig } from '@lssm/lib.contracts';

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
 * Options for generating import statements.
 */
export interface ImportGeneratorOptions {
  /** Base directory for model imports (e.g., '../models'). Defaults to relative './' */
  modelsDir?: string;
}

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

  if (isReference(schema)) {
    // Reference type - just use the referenced type
    return {
      name: toPascalCase(typeNameFromRef(schema.$ref)),
      fields: [],
      code: `// Reference to ${schema.$ref}`,
    };
  }

  const schemaObj = schema as Record<string, unknown>;
  const description = schemaObj['description'] as string | undefined;
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
    lines.push(`${spaces}  type: ${field.scalarType}(),`);
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
 * @param fields - The fields to generate imports for
 * @param options - Optional configuration for import generation
 */
export function generateImports(
  fields: SchemaField[],
  options: ContractsrcConfig
): string {
  const imports = new Set<string>();
  const modelsDir = `../${options.conventions.models}`;

  imports.add(
    "import { defineSchemaModel, ScalarTypeEnum, EnumType } from '@lssm/lib.schema';"
  );

  // Check if we need any custom type imports
  for (const field of fields) {
    // If it's a reference (represented as a custom type not being scalar or enum)
    // In our simplified generator, referencing models often means just using the type name.
    // If we assume all models are generated in the same directory or available via barrel export,
    // we might not need explicit imports if we are in the same module,
    // BUT ContractSpec usually requires importing dependencies.
    // For now, let's assume we import from specific files.

    // We look for fields where nestedModel is NOT present (implied ref) and scalarType is undefined
    // And primitive is false.
    if (
      !field.type.primitive &&
      !field.enumValues &&
      !field.scalarType &&
      !field.nestedModel
    ) {
      // This is likely a reference to another schema model
      const modelName = field.type.type;
      // Convert PascalCase model name to kebab-case file name
      const kebabName = modelName
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
      imports.add(`import { ${modelName} } from '${modelsDir}/${kebabName}';`);
    }
  }

  return Array.from(imports).join('\n');
}
