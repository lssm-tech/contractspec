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
  outputModel: GeneratedModel | null,
  queryModel: GeneratedModel | null = null,
  paramsModel: GeneratedModel | null = null,
  headersModel: GeneratedModel | null = null
): string {
  const specKey = toSpecKey(operation.operationId, options.prefix);
  const kind = inferOpKind(operation.method);
  const auth = inferAuthLevel(operation, options.defaultAuth ?? 'user');

  const lines: string[] = [];

  // Imports
  lines.push(
    "import { defineCommand, defineQuery } from '@lssm/lib.contracts';"
  );
  if (
    inputModel ||
    outputModel ||
    queryModel ||
    paramsModel ||
    headersModel
  ) {
    const collectedImports = new Set<string>();
    const models = [
      inputModel,
      outputModel,
      queryModel,
      paramsModel,
      headersModel,
    ].filter((m): m is GeneratedModel => !!m);

    // Add explicit imports from generators (e.g. Zod, JsonSchema)
    models.forEach((m) => {
      if (m.imports && m.imports.length > 0) {
        m.imports.forEach((i) => collectedImports.add(i));
      }
    });

    // Add legacy fields-based imports (ContractSpec format)
    const legacyModels = models.filter(
      (m) => !m.imports || m.imports.length === 0
    );
    const legacyFields = legacyModels.flatMap((m) => m.fields);

    if (legacyFields.length > 0) {
      const legacyImportStr = generateImports(
        legacyFields,
        contractspecConfig,
        false
      );
      legacyImportStr
        .split('\n')
        .filter(Boolean)
        .forEach((i) => collectedImports.add(i));
    }

    if (collectedImports.size > 0) {
      lines.push(Array.from(collectedImports).sort().join('\n'));
    }
  }
  lines.push('');

  // Generate schemas
  const schemaSections = [
    { label: 'Input schema', model: inputModel },
    { label: 'Query schema', model: queryModel },
    { label: 'Path schema', model: paramsModel },
    { label: 'Header schema', model: headersModel },
    { label: 'Output schema', model: outputModel },
  ];

  for (const section of schemaSections) {
    if (section.model && section.model.code) {
      lines.push(`// ${section.label}`);
      lines.push(section.model.code);
      lines.push('');
    }
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
  lines.push(`    input: ${inputModel?.name ?? 'null'},`);
  if (queryModel) lines.push(`    query: ${queryModel.name},`);
  if (paramsModel) lines.push(`    params: ${paramsModel.name},`);
  if (headersModel) lines.push(`    headers: ${headersModel.name},`);

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
  const httpMethod = operation.method.toUpperCase();
  const restMethod = httpMethod === 'GET' ? 'GET' : 'POST';
  lines.push('  transport: {');
  lines.push('    rest: {');
  lines.push(`      method: '${restMethod}',`);
  lines.push(`      path: '${operation.path}',`);
  lines.push('    },');
  lines.push('  },');

  lines.push('});');

  return lines.join('\n');
}
