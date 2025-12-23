import type { OpenApiSchema } from '../types';
import { generateImports, generateSchemaModelCode } from '../schema-converter';
import { toPascalCase, toValidIdentifier } from '../../common/utils';
import type { ContractsrcConfig } from '@lssm/lib.contracts';

/**
 * Generate code for a standalone model.
 */
export function generateModelCode(
  name: string,
  schema: OpenApiSchema,
  options: ContractsrcConfig
): string {
  const modelName = toPascalCase(toValidIdentifier(name));
  const model = generateSchemaModelCode(schema, modelName);

  const imports = generateImports(model.fields, options);

  return `
${imports}

${model.code}
`.trim();
}
