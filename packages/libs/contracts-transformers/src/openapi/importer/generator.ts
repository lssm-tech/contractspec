import type { ParsedOperation } from '../types';
import { toPascalCase, toSpecKey, toValidIdentifier } from '../../common/utils';
import { type GeneratedModel, generateImports } from '../schema-converter';
import { inferAuthLevel, inferOpKind } from './analyzer';
import type {
  ContractsrcConfig,
  OpenApiSourceConfig,
} from '@lssm/lib.contracts';

/**
 * Generate ContractSpec TypeScript code for an operation.
 */
export function generateSpecCode(
  operation: ParsedOperation,
  contractspecConfig: ContractsrcConfig,
  options: Partial<OpenApiSourceConfig> = {},
  inputModel: GeneratedModel | null,
  outputModel: GeneratedModel | null
): string {
  const specKey = toSpecKey(operation.operationId, options.prefix);
  const kind = inferOpKind(operation.method);
  const auth = inferAuthLevel(operation, options.defaultAuth ?? 'user');

  const lines: string[] = [];

  // Imports
  lines.push(
    "import { defineCommand, defineQuery } from '@lssm/lib.contracts';"
  );
  if (inputModel || outputModel) {
    lines.push(
      generateImports(
        [...(inputModel?.fields ?? []), ...(outputModel?.fields ?? [])],
        contractspecConfig,
        false // operations import from ../models, not same directory
      )
    );
  }
  lines.push('');

  // Generate input model if present
  if (inputModel && inputModel.code) {
    lines.push('// Input schema');
    lines.push(inputModel.code);
    lines.push('');
  }

  // Generate output model if present
  if (outputModel && outputModel.code) {
    lines.push('// Output schema');
    lines.push(outputModel.code);
    lines.push('');
  }

  // Generate spec
  const defineFunc = kind === 'command' ? 'defineCommand' : 'defineQuery';
  const safeName = toValidIdentifier(toPascalCase(operation.operationId));

  lines.push(`/**`);
  lines.push(` * ${operation.summary ?? operation.operationId}`);
  if (operation.description) {
    lines.push(` *`);
    lines.push(` * ${operation.description}`);
  }
  lines.push(` *`);
  lines.push(
    ` * @source OpenAPI: ${operation.method.toUpperCase()} ${operation.path}`
  );
  lines.push(` */`);
  lines.push(`export const ${safeName}Spec = ${defineFunc}({`);

  // Meta
  lines.push('  meta: {');
  lines.push(`    key: '${specKey}',`);
  lines.push('    version: 1,');
  lines.push(`    stability: '${options.defaultStability ?? 'stable'}',`);
  lines.push(
    `    owners: [${(options.defaultOwners ?? []).map((o) => `'${o}'`).join(', ')}],`
  );
  lines.push(`    tags: [${operation.tags.map((t) => `'${t}'`).join(', ')}],`);
  lines.push(
    `    description: ${JSON.stringify(operation.summary ?? operation.operationId)},`
  );
  lines.push(
    `    goal: ${JSON.stringify(operation.description ?? 'Imported from OpenAPI')},`
  );
  lines.push(
    `    context: 'Imported from OpenAPI: ${operation.method.toUpperCase()} ${operation.path}',`
  );
  lines.push('  },');

  // IO
  lines.push('  io: {');
  if (inputModel) {
    lines.push(`    input: ${inputModel.name},`);
  } else {
    lines.push('    input: null,');
  }
  if (outputModel) {
    lines.push(`    output: ${outputModel.name},`);
  } else {
    lines.push('    output: null, // TODO: Define output schema');
  }
  lines.push('  },');

  // Policy
  lines.push('  policy: {');
  lines.push(`    auth: '${auth}',`);
  lines.push('  },');

  // Transport hints
  // ContractSpec only supports GET and POST - map other methods appropriately
  const httpMethod = operation.method.toUpperCase();
  const restMethod = httpMethod === 'GET' ? 'GET' : 'POST'; // GET stays GET, everything else becomes POST
  lines.push('  transport: {');
  lines.push('    rest: {');
  lines.push(`      method: '${restMethod}',`);
  lines.push(`      path: '${operation.path}',`);
  lines.push('    },');
  lines.push('  },');

  lines.push('});');

  return lines.join('\n');
}
