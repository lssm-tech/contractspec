import type { OpenApiSchema } from '../types';
import {
  generateSchemaModelCode,
  generateImports,
  type ImportGeneratorOptions,
} from '../schema-converter';
import { toPascalCase, toValidIdentifier } from '../../common/utils';

/**
 * Generate code for a standalone model.
 */
export function generateModelCode(
  name: string,
  schema: OpenApiSchema,
  options: ImportGeneratorOptions
): string {
  const modelName = toPascalCase(toValidIdentifier(name));
  const model = generateSchemaModelCode(schema, modelName);

  const imports = generateImports(model.fields, options);

  return `
${imports}

${model.code}
`.trim();
}
