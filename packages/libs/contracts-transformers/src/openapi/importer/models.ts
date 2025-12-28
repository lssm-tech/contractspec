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
  const schemaFormat = options.schemaFormat || 'contractspec';

  const model = generateSchemaModelCode(
    schema,
    modelName,
    schemaFormat,
    options
  );

  let imports = '';
  if (model.imports && model.imports.length > 0) {
    imports = model.imports.join('\n');
  } else if (model.fields.length > 0) {
    imports = generateImports(model.fields, options);
  }

  return `
${imports}

${model.code}
`.trim();
}
