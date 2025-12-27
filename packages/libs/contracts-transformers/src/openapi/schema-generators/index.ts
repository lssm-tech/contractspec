/**
 * Schema generator factory for multi-format code generation.
 *
 * Provides format-specific generators for OpenAPI to ContractSpec conversion.
 *
 * @module schema-generators
 */

import type { SchemaFormat, ContractsrcConfig } from '@lssm/lib.contracts';
import type { OpenApiSchema } from '../types';
import {
  getScalarType,
  jsonSchemaToType,
  generateImports,
  type SchemaField,
  type GeneratedModel,
} from '../schema-converter';
import {
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toValidIdentifier,
} from '../../common/utils';

const JSON_SCHEMA_TO_SCALAR: Record<string, string> = {
  string: 'ScalarTypeEnum.String_unsecure',
  integer: 'ScalarTypeEnum.Int_unsecure',
  number: 'ScalarTypeEnum.Float_unsecure',
  boolean: 'ScalarTypeEnum.Boolean',
  'string:date': 'ScalarTypeEnum.Date',
  'string:date-time': 'ScalarTypeEnum.DateTime',
  'string:email': 'ScalarTypeEnum.EmailAddress',
  'string:uri': 'ScalarTypeEnum.URL',
  'string:uuid': 'ScalarTypeEnum.ID',
};

function isReference(schema: OpenApiSchema): schema is { $ref: string } {
  return typeof schema === 'object' && schema !== null && '$ref' in schema;
}

function typeNameFromRef(ref: string): string {
  const parts = ref.split('/');
  return parts[parts.length - 1] ?? 'Unknown';
}

/**
 * Generated code output for a model.
 */
export interface GeneratedCode {
  /** The generated TypeScript/JSON code */
  code: string;
  /** File name for the generated code */
  fileName: string;
  /** Required imports */
  imports: string[];
  /** The name of the exported symbol */
  name: string;
}

/**
 * Generated code output for a field.
 */
export interface GeneratedFieldCode {
  /** The field code snippet */
  code: string;
  /** Type reference for the field */
  typeRef: string;
  /** Whether this is an optional field */
  isOptional: boolean;
  /** Whether this is an array field */
  isArray: boolean;
}

/**
 * Interface for format-specific schema generators.
 */
export interface SchemaGenerator {
  /** Format this generator produces */
  format: SchemaFormat;

  /**
   * Generate code for a complete model/schema.
   */
  generateModel(
    schema: OpenApiSchema,
    name: string,
    options?: { description?: string }
  ): GeneratedCode;

  /**
   * Generate code for a single field.
   */
  generateField(
    schema: OpenApiSchema,
    fieldName: string,
    required: boolean
  ): GeneratedFieldCode;

  /**
   * Get import statements needed for this generator's output.
   */
  getBaseImports(): string[];
}

/**
 * Factory function to create a format-specific schema generator.
 *
 * @param format - The target output format
 * @param config - ContractSpec configuration
 * @returns A schema generator for the specified format
 *
 * @example
 * ```typescript
 * const generator = createSchemaGenerator('zod', config);
 * const model = generator.generateModel(openApiSchema, 'User');
 * ```
 */
export function createSchemaGenerator(
  format: SchemaFormat,
  config?: ContractsrcConfig
): SchemaGenerator {
  switch (format) {
    case 'zod':
      return new ZodSchemaGenerator(config);
    case 'json-schema':
      return new JsonSchemaGenerator(config);
    case 'graphql':
      return new GraphQLSchemaGenerator(config);
    case 'contractspec':
    default:
      return new ContractSpecSchemaGenerator(config);
  }
}

// ============================================================================
// ContractSpec Generator (default)
// ============================================================================

export class ContractSpecSchemaGenerator implements SchemaGenerator {
  format: SchemaFormat = 'contractspec';
  config?: ContractsrcConfig;

  constructor(config?: ContractsrcConfig) {
    this.config = config;
  }

  generateModel(
    schema: OpenApiSchema,
    name: string,
    options?: { description?: string }
  ): GeneratedCode {
    const model = this.generateContractSpecSchema(schema, name);

    // Calculate imports for dependencies
    const dependencyImports = this.config
      ? generateImports(model.fields, this.config, false)
          .split('\n')
          .filter(Boolean)
      : [];

    // Add nested model imports?
    // Nested models are inlined in code, but might have refs.
    // generateImports handles fields recursively? No, generateImports iterates top-level fields.
    // But nested models are hoisted, so their fields are not in 'fields' array of parent directly?
    // Wait, GeneratedModel.fields contains 'nestedModel'.
    // generateImports should traverse nested models?
    // The original generateImports does NOT traverse nested models.
    // However, the original code worked, so maybe simple traversal is enough.

    return {
      code: model.code,
      fileName: toKebabCase(name) + '.ts',
      imports: [...this.getBaseImports(), ...dependencyImports],
      name: model.name,
    };
  }

  generateField(
    schema: OpenApiSchema,
    fieldName: string,
    required: boolean
  ): GeneratedFieldCode {
    const field = this.convertField(schema, fieldName, required);

    return {
      code: field.scalarType
        ? `${field.scalarType}()`
        : 'ScalarTypeEnum.String_unsecure()',
      typeRef: field.type.type,
      isOptional: field.type.optional,
      isArray: field.type.array,
    };
  }

  getBaseImports(): string[] {
    return [
      "import { defineSchemaModel, ScalarTypeEnum, EnumType } from '@lssm/lib.schema';",
    ];
  }

  // Ported logic
  private generateContractSpecSchema(
    schema: OpenApiSchema,
    modelName: string,
    indent = 0
  ): GeneratedModel {
    const spaces = '  '.repeat(indent);
    const fields: SchemaField[] = [];

    if (isReference(schema)) {
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

    // Handle enum types
    const enumValues = schemaObj['enum'] as unknown[] | undefined;
    if (enumValues && enumValues.length > 0) {
      const safeModelName = toPascalCase(toValidIdentifier(modelName));
      const enumCode = [
        `${spaces}/**`,
        `${spaces} * Enum type: ${safeModelName}`,
        description ? `${spaces} * ${description}` : null,
        `${spaces} */`,
        `${spaces}export const ${safeModelName} = new EnumType('${safeModelName}', [${enumValues.map((v) => `'${String(v)}'`).join(', ')}]);`,
      ]
        .filter((line) => line !== null)
        .join('\n');

      return {
        name: safeModelName,
        description,
        fields: [],
        code: enumCode,
      };
    }

    // Handle primitive types alias
    const schemaType = schemaObj['type'] as string | undefined;
    if (schemaType && !properties && !enumValues) {
      const safeModelName = toPascalCase(toValidIdentifier(modelName));
      const format = schemaObj['format'] as string | undefined;
      const scalarKey = format ? `${schemaType}:${format}` : schemaType;
      const scalarType =
        JSON_SCHEMA_TO_SCALAR[scalarKey] ?? JSON_SCHEMA_TO_SCALAR[schemaType];

      if (scalarType) {
        const aliasCode = [
          `${spaces}/**`,
          `${spaces} * Type alias: ${safeModelName}`,
          description ? `${spaces} * ${description}` : null,
          `${spaces} * Underlying type: ${scalarType}`,
          `${spaces} */`,
          `${spaces}export const ${safeModelName} = defineSchemaModel({`,
          `${spaces}  name: '${safeModelName}',`,
          description
            ? `${spaces}  description: ${JSON.stringify(description)},`
            : null,
          `${spaces}  fields: {`,
          `${spaces}    value: {`,
          `${spaces}      type: ${scalarType}(),`,
          `${spaces}      isOptional: false,`,
          `${spaces}    },`,
          `${spaces}  },`,
          `${spaces}});`,
        ]
          .filter((line) => line !== null)
          .join('\n');

        return {
          name: safeModelName,
          description,
          fields: [],
          code: aliasCode,
        };
      }
    }

    // Handle additionalProperties (dictionary)
    const additionalProperties = schemaObj['additionalProperties'];
    if (additionalProperties && !properties) {
      const safeModelName = toPascalCase(toValidIdentifier(modelName));

      const dictCode = [
        `${spaces}/**`,
        `${spaces} * Dictionary/Record type: ${safeModelName}`,
        description ? `${spaces} * ${description}` : null,
        `${spaces} * Use as: Record<string, unknown> - access via record[key]`,
        `${spaces} */`,
        `${spaces}export const ${safeModelName} = ScalarTypeEnum.JSONObject();`,
      ]
        .filter((line) => line !== null)
        .join('\n');

      return {
        name: safeModelName,
        description,
        fields: [],
        code: dictCode,
      };
    }

    if (!properties) {
      const safeModelName = toPascalCase(toValidIdentifier(modelName));
      const emptyModelCode = [
        `${spaces}export const ${safeModelName} = defineSchemaModel({`,
        `${spaces}  name: '${safeModelName}',`,
        description
          ? `${spaces}  description: ${JSON.stringify(description)},`
          : null,
        `${spaces}  fields: {},`,
        `${spaces}});`,
      ]
        .filter((line) => line !== null)
        .join('\n');

      return {
        name: safeModelName,
        description,
        fields: [],
        code: emptyModelCode,
      };
    }

    // Generate fields
    const safeModelName = toPascalCase(toValidIdentifier(modelName));
    for (const [propName, propSchema] of Object.entries(properties)) {
      const isRequired = required.includes(propName);
      fields.push(
        this.convertField(propSchema, propName, isRequired, safeModelName)
      );
    }

    // Generate code
    const lines: string[] = [];

    // Prepend nested models
    for (const field of fields) {
      if (field.nestedModel) {
        lines.push(field.nestedModel.code);
        lines.push('');
      }
    }

    // Model definition
    lines.push(`${spaces}export const ${safeModelName} = defineSchemaModel({`);
    lines.push(`${spaces}  name: '${safeModelName}',`);
    if (description) {
      lines.push(`${spaces}  description: ${JSON.stringify(description)},`);
    }
    lines.push(`${spaces}  fields: {`);

    for (const field of fields) {
      const fieldLines = this.generateFieldCodeHelper(field, indent + 2);
      lines.push(fieldLines);
    }

    lines.push(`${spaces}  },`);
    lines.push(`${spaces}});`);

    return {
      name: safeModelName,
      description,
      fields,
      code: lines.join('\n'),
      imports: [],
    };
  }

  private convertField(
    schema: OpenApiSchema,
    fieldName: string,
    required: boolean,
    parentName?: string
  ): SchemaField {
    const type = jsonSchemaToType(schema, fieldName);
    const scalarType = getScalarType(schema);

    let enumValues: string[] | undefined;
    let nestedModel: GeneratedModel | undefined;

    if (!isReference(schema)) {
      const schemaObj = schema as Record<string, unknown>;
      const enumArr = schemaObj['enum'] as unknown[] | undefined;
      if (enumArr) {
        enumValues = enumArr.map(String);
      }

      // Handle nested objects
      if (
        schemaObj['type'] === 'object' &&
        !scalarType &&
        schemaObj['properties'] &&
        !enumValues
      ) {
        const nestedName =
          (parentName ? parentName : '') + toPascalCase(fieldName);
        nestedModel = this.generateContractSpecSchema(schema, nestedName);

        type.type = nestedModel.name;
        type.isReference = true;
      }
    }

    return {
      name: fieldName,
      type: {
        ...type,
        optional: !required || type.optional,
        description: !isReference(schema)
          ? ((schema as Record<string, unknown>)['description'] as string)
          : undefined,
      },
      scalarType,
      enumValues,
      nestedModel,
    };
  }

  private generateFieldCodeHelper(field: SchemaField, indent: number): string {
    const spaces = '  '.repeat(indent);
    const lines: string[] = [];

    const isIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(field.name);
    const safeKey = isIdentifier ? field.name : `'${field.name}'`;
    lines.push(`${spaces}${safeKey}: {`);

    if (field.enumValues) {
      const enumName = toPascalCase(field.name) + 'Enum';
      lines.push(
        `${spaces}  type: new EnumType('${enumName}', [${field.enumValues.map((v) => `'${v}'`).join(', ')}]),`
      );
    } else if (field.scalarType) {
      lines.push(`${spaces}  type: ${field.scalarType}(),`);
    } else if (field.nestedModel) {
      lines.push(`${spaces}  type: ${field.nestedModel.name},`);
    } else if (field.type.primitive) {
      const fallbackScalar =
        field.type.type === 'number'
          ? 'ScalarTypeEnum.Float_unsecure'
          : field.type.type === 'boolean'
            ? 'ScalarTypeEnum.Boolean_unsecure'
            : 'ScalarTypeEnum.String_unsecure';
      lines.push(`${spaces}  type: ${fallbackScalar}(),`);
    } else if (field.type.isReference) {
      lines.push(`${spaces}  type: ${field.type.type},`);
    } else {
      lines.push(
        `${spaces}  type: ScalarTypeEnum.JSONObject(), // TODO: Define nested model for ${field.type.type}`
      );
    }

    lines.push(`${spaces}  isOptional: ${field.type.optional},`);

    if (field.type.array) {
      lines.push(`${spaces}  isArray: true,`);
    }

    lines.push(`${spaces}},`);

    return lines.join('\n');
  }
}

// ============================================================================
// Zod Generator
// ============================================================================

export class ZodSchemaGenerator implements SchemaGenerator {
  format: SchemaFormat = 'zod';
  config?: ContractsrcConfig;

  constructor(config?: ContractsrcConfig) {
    this.config = config;
  }

  generateModel(
    schema: OpenApiSchema,
    name: string,
    options?: { description?: string }
  ): GeneratedCode {
    const schemaObj = schema as Record<string, unknown>;
    const properties = schemaObj['properties'] as
      | Record<string, OpenApiSchema>
      | undefined;
    const required = (schemaObj['required'] as string[]) ?? [];
    const description = options?.description ?? schemaObj['description'];

    const lines: string[] = [];

    if (description) {
      lines.push(`/**`);
      lines.push(` * ${description}`);
      lines.push(` */`);
    }

    // Generate Zod Schema
    const schemaName = `${name}Schema`;
    let schemaCode;

    if (properties) {
      schemaCode = this.generateZodObject(schemaObj);
    } else {
      schemaCode = 'z.object({})';
    }

    lines.push(`export const ${schemaName} = ${schemaCode};`);
    lines.push(``);

    // Generate ZodSchemaType wrapper for ContractSpec compatibility
    lines.push(
      `export const ${name} = new ZodSchemaType(${schemaName}, { name: '${name}', description: ${JSON.stringify(description)} });`
    );
    lines.push(``);

    // Generate Type
    lines.push(`export type ${name} = z.infer<typeof ${schemaName}>;`);

    // Dependencies?
    // Zod generator doesn't currently resolve references recursively or import them
    // This is a limitation: if prop is ref, use z.lazy(() => RefSchema) or similar?
    // For now assuming shallow/primitive or using z.unknown/record for complex stuff
    // Or if Contracts-transformers logic for references is ported.
    // Simplifying: Zod generator relies on primitive mapping for now.

    return {
      code: lines.join('\n'),
      fileName: toKebabCase(name) + '.ts',
      imports: this.getBaseImports(), // Todo: Add dependency imports if references used
      name: name,
    };
  }

  generateField(
    schema: OpenApiSchema,
    fieldName: string,
    required: boolean
  ): GeneratedFieldCode {
    const schemaObj = schema as Record<string, unknown>;
    const type = schemaObj['type'] as string | undefined;
    const format = schemaObj['format'] as string | undefined;
    const nullable = schemaObj['nullable'] as boolean | undefined;

    let zodType: string;

    if (type === 'object' && schemaObj['properties']) {
      zodType = this.generateZodObject(schemaObj);
    } else {
      zodType = this.mapTypeToZod(type, format);

      if (schemaObj['enum']) {
        const enumValues = schemaObj['enum'] as string[];
        zodType = `z.enum([${enumValues.map((v) => `'${v}'`).join(', ')}])`;
      }

      if (type === 'array') {
        const items = schemaObj['items'] as OpenApiSchema | undefined;
        if (items) {
          const itemField = this.generateField(items, 'item', true);
          zodType = `z.array(${itemField.code.replace('.optional()', '')})`;
        } else {
          zodType = 'z.array(z.unknown())';
        }
      }
    }

    // Add constraints
    if (type === 'string') {
      if (schemaObj['minLength'] !== undefined)
        zodType += `.min(${schemaObj['minLength']})`;
      if (schemaObj['maxLength'] !== undefined)
        zodType += `.max(${schemaObj['maxLength']})`;
      if (schemaObj['pattern'] !== undefined)
        zodType += `.regex(/${schemaObj['pattern']}/)`;
    } else if (type === 'integer' || type === 'number') {
      if (schemaObj['minimum'] !== undefined) {
        zodType +=
          schemaObj['exclusiveMinimum'] === true
            ? `.gt(${schemaObj['minimum']})`
            : `.min(${schemaObj['minimum']})`;
      } else if (typeof schemaObj['exclusiveMinimum'] === 'number') {
        zodType += `.gt(${schemaObj['exclusiveMinimum']})`;
      }

      if (schemaObj['maximum'] !== undefined) {
        zodType +=
          schemaObj['exclusiveMaximum'] === true
            ? `.lt(${schemaObj['maximum']})`
            : `.max(${schemaObj['maximum']})`;
      } else if (typeof schemaObj['exclusiveMaximum'] === 'number') {
        zodType += `.lt(${schemaObj['exclusiveMaximum']})`;
      }

      if (schemaObj['multipleOf'] !== undefined) {
        zodType += `.step(${schemaObj['multipleOf']})`;
      }
    } else if (type === 'array') {
      if (schemaObj['minItems'] !== undefined)
        zodType += `.min(${schemaObj['minItems']})`;
      if (schemaObj['maxItems'] !== undefined)
        zodType += `.max(${schemaObj['maxItems']})`;
    }

    if (schemaObj['default'] !== undefined) {
      zodType += `.default(${JSON.stringify(schemaObj['default'])})`;
    }

    if (!required || nullable) {
      zodType = `${zodType}.optional()`;
    }

    return {
      code: zodType,
      typeRef: type ?? 'unknown',
      isOptional: !required || Boolean(nullable),
      isArray: type === 'array',
    };
  }

  private generateZodObject(schemaObj: Record<string, unknown>): string {
    const required = (schemaObj['required'] as string[]) ?? [];
    const properties = schemaObj['properties'] as Record<string, OpenApiSchema>;
    const lines: string[] = ['z.object({'];

    for (const [propName, propSchema] of Object.entries(properties)) {
      const isRequired = required.includes(propName);
      const field = this.generateField(propSchema, propName, isRequired);
      // If name is not a valid identifier, quote it
      const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(propName)
        ? propName
        : `'${propName}'`;

      lines.push(`  ${safeName}: ${field.code},`);
    }

    lines.push('})');
    return lines.join('\n');
  }

  getBaseImports(): string[] {
    return [
      "import * as z from 'zod';",
      "import { ZodSchemaType } from '@lssm/lib.schema';",
    ];
  }

  private mapTypeToZod(type?: string, format?: string): string {
    if (format === 'date-time') return 'z.string().datetime()';
    if (format === 'date') return 'z.string().date()';
    if (format === 'email') return 'z.string().email()';
    if (format === 'uri' || format === 'url') return 'z.string().url()';
    if (format === 'uuid') return 'z.string().uuid()';

    switch (type) {
      case 'string':
        return 'z.string()';
      case 'integer':
        return 'z.number().int()';
      case 'number':
        return 'z.number()';
      case 'boolean':
        return 'z.boolean()';
      case 'object':
        return 'z.record(z.string(), z.unknown())';
      case 'null':
        return 'z.null()';
      default:
        return 'z.unknown()';
    }
  }
}

// ============================================================================
// JSON Schema Generator
// ============================================================================

export class JsonSchemaGenerator implements SchemaGenerator {
  format: SchemaFormat = 'json-schema';
  config?: ContractsrcConfig;

  constructor(config?: ContractsrcConfig) {
    this.config = config;
  }

  generateModel(
    schema: OpenApiSchema,
    name: string,
    options?: { description?: string }
  ): GeneratedCode {
    const schemaObj = schema as Record<string, unknown>;
    const description = options?.description ?? schemaObj['description'];

    // Create a clean JSON Schema object
    const jsonSchema: Record<string, unknown> = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      title: name,
      ...schemaObj,
    };

    if (description) {
      jsonSchema['description'] = description;
    }

    const lines: string[] = [];
    lines.push(`/**`);
    lines.push(` * JSON Schema: ${name}`);
    if (description) {
      lines.push(` * ${description}`);
    }
    lines.push(` */`);

    const schemaName = `${name}Schema`;
    lines.push(
      `export const ${schemaName} = ${JSON.stringify(jsonSchema, null, 2)} as const;`
    );
    lines.push(``);

    // Generate wrapper
    lines.push(`export const ${name} = new JsonSchemaType(${schemaName});`);
    lines.push(``);

    // Type derived from JsonSchemaType or similar?
    // Actually JsonSchemaType doesn't strictly infer TS type from JSON schema at compile time easily without other tools.
    // For now, export type as unknown or rely on library.
    lines.push(
      `export type ${name} = unknown; // JSON Schema type inference not fully supported`
    );

    return {
      code: lines.join('\n'),
      fileName: toKebabCase(name) + '.ts',
      imports: this.getBaseImports(), // dependency imports?
      name: name,
    };
  }

  generateField(
    schema: OpenApiSchema,
    fieldName: string,
    required: boolean
  ): GeneratedFieldCode {
    const schemaObj = schema as Record<string, unknown>;
    const type = schemaObj['type'] as string | undefined;
    const nullable = schemaObj['nullable'] as boolean | undefined;

    return {
      code: JSON.stringify(schemaObj),
      typeRef: type ?? 'unknown',
      isOptional: !required || Boolean(nullable),
      isArray: type === 'array',
    };
  }

  getBaseImports(): string[] {
    return ["import { JsonSchemaType } from '@lssm/lib.schema';"];
  }
}

// ============================================================================
// GraphQL Generator
// ============================================================================

export class GraphQLSchemaGenerator implements SchemaGenerator {
  format: SchemaFormat = 'graphql';
  config?: ContractsrcConfig;

  constructor(config?: ContractsrcConfig) {
    this.config = config;
  }

  generateModel(
    schema: OpenApiSchema,
    name: string,
    options?: { description?: string }
  ): GeneratedCode {
    const schemaObj = schema as Record<string, unknown>;
    const properties = schemaObj['properties'] as
      | Record<string, OpenApiSchema>
      | undefined;
    const required = (schemaObj['required'] as string[]) ?? [];
    const description = options?.description ?? schemaObj['description'];

    const lines: string[] = [];

    if (description) {
      lines.push(`"""${description}"""`);
    }

    lines.push(`type ${name} {`);

    if (properties) {
      for (const [propName, propSchema] of Object.entries(properties)) {
        const isRequired = required.includes(propName);
        const field = this.generateField(propSchema, propName, isRequired);
        const nullMarker = isRequired ? '!' : '';
        lines.push(`  ${propName}: ${field.typeRef}${nullMarker}`);
      }
    }

    lines.push(`}`);

    // Also generate SDL as a string constant
    const sdl = lines.join('\n');
    const tsLines: string[] = [];
    tsLines.push(`/**`);
    tsLines.push(` * GraphQL type definition: ${name}`);
    tsLines.push(` */`);
    tsLines.push(`export const ${name}TypeDef = \`${sdl}\`;`);
    tsLines.push(``);
    tsLines.push(
      `export const ${name} = new GraphQLSchemaType(${name}TypeDef, '${name}');`
    );

    return {
      code: tsLines.join('\n'),
      fileName: toKebabCase(name) + '.ts',
      imports: this.getBaseImports(),
      name: name,
    };
  }

  generateField(
    schema: OpenApiSchema,
    fieldName: string,
    required: boolean
  ): GeneratedFieldCode {
    const schemaObj = schema as Record<string, unknown>;
    const type = schemaObj['type'] as string | undefined;
    const format = schemaObj['format'] as string | undefined;
    const nullable = schemaObj['nullable'] as boolean | undefined;

    const gqlType = this.mapTypeToGraphQL(type, format);

    return {
      code: gqlType,
      typeRef: gqlType,
      isOptional: !required || Boolean(nullable),
      isArray: type === 'array',
    };
  }

  getBaseImports(): string[] {
    return ["import { GraphQLSchemaType } from '@lssm/lib.schema';"];
  }

  private mapTypeToGraphQL(type?: string, format?: string): string {
    if (format === 'date-time') return 'DateTime';
    if (format === 'date') return 'Date';
    if (format === 'email') return 'String';
    if (format === 'uri' || format === 'url') return 'String';
    if (format === 'uuid') return 'ID';

    switch (type) {
      case 'string':
        return 'String';
      case 'integer':
        return 'Int';
      case 'number':
        return 'Float';
      case 'boolean':
        return 'Boolean';
      case 'object':
        return 'JSON';
      case 'array':
        return '[JSON]';
      default:
        return 'JSON';
    }
  }
}
