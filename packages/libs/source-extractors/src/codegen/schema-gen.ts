/**
 * Schema code generator.
 *
 * Generates defineSchemaModel specs from schema candidates.
 */

import type { SchemaCandidate, ImportIR } from '../types';
import type { GeneratedFile, GenerationOptions } from './types';

/**
 * Generate a single schema file.
 */
export function generateSchema(
  schema: SchemaCandidate,
  _options: GenerationOptions
): GeneratedFile {
  const fileName = `${toFileName(schema.name)}.ts`;
  const code = generateSchemaCode(schema);

  return {
    path: `schemas/${fileName}`,
    content: code,
    type: 'schema',
  };
}

/**
 * Generate all schema files from IR.
 */
export function generateSchemas(
  ir: ImportIR,
  options: GenerationOptions
): GeneratedFile[] {
  return ir.schemas.map((schema) => generateSchema(schema, options));
}

/**
 * Convert name to file name (kebab-case).
 */
function toFileName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Generate schema code.
 */
function generateSchemaCode(schema: SchemaCandidate): string {
  const lines = [
    `/**`,
    ` * ${schema.name}`,
    ` *`,
    ` * Generated from: ${schema.source.file}:${schema.source.startLine}`,
    ` * Schema type: ${schema.schemaType}`,
    ` * Confidence: ${schema.confidence.level}`,
    ` */`,
    ``,
    `import { fromZod } from '@contractspec/lib.schema';`,
    `import { z } from 'zod';`,
    ``,
  ];

  if (schema.rawDefinition && schema.schemaType === 'zod') {
    // Use the raw Zod definition if available
    lines.push(`// Original definition from source:`);
    lines.push(`// ${schema.rawDefinition.split('\n')[0]}`);
    lines.push(``);
  }

  lines.push(`export const ${schema.name}Schema = fromZod(z.object({`);

  if (schema.fields && schema.fields.length > 0) {
    for (const field of schema.fields) {
      const zodType = mapToZodType(field.type, field.optional);
      lines.push(`  ${field.name}: ${zodType},`);
    }
  } else {
    lines.push(`  // TODO: Define schema fields`);
  }

  lines.push(`}));`);
  lines.push(``);
  lines.push(
    `export type ${schema.name} = z.infer<typeof ${schema.name}Schema.zodSchema>;`
  );
  lines.push(``);

  return lines.join('\n');
}

/**
 * Map TypeScript type to Zod type.
 */
function mapToZodType(tsType: string, optional: boolean): string {
  let zodType: string;

  switch (tsType.toLowerCase()) {
    case 'string':
      zodType = 'z.string()';
      break;
    case 'number':
      zodType = 'z.number()';
      break;
    case 'boolean':
      zodType = 'z.boolean()';
      break;
    case 'date':
      zodType = 'z.date()';
      break;
    case 'string[]':
    case 'array<string>':
      zodType = 'z.array(z.string())';
      break;
    case 'number[]':
    case 'array<number>':
      zodType = 'z.array(z.number())';
      break;
    default:
      zodType = 'z.unknown()';
  }

  return optional ? `${zodType}.optional()` : zodType;
}
