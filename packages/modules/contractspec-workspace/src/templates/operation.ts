/**
 * Operation spec template generation.
 * Extracted from cli-contractspec/src/templates/operation.template.ts
 */

import type { OperationSpecData } from '../types/spec-types';
import { toPascalCase, capitalize } from './utils';

/**
 * Generate operation spec TypeScript code.
 */
export function generateOperationSpec(data: OperationSpecData): string {
  const {
    name,
    version,
    kind,
    description,
    goal,
    context,
    stability,
    owners,
    tags,
    auth,
    flags,
  } = data;

  const specVarName = toPascalCase(name.split('.').pop() ?? 'Unknown') + 'Spec';
  const inputSchemaName = specVarName.replace('Spec', 'Input');
  const outputSchemaName = specVarName.replace('Spec', 'Output');

  return `import { define${capitalize(kind)} } from '@lssm/lib.contracts';
import { ScalarTypeEnum, SchemaModel } from '@lssm/lib.schema';

// TODO: Define input schema
export const ${inputSchemaName} = new SchemaModel({
  name: '${inputSchemaName}',
  description: 'Input for ${name}',
  fields: {
    // Add your fields here
    // example: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

// TODO: Define output schema
export const ${outputSchemaName} = new SchemaModel({
  name: '${outputSchemaName}',
  description: 'Output for ${name}',
  fields: {
    // Add your fields here
    ok: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const ${specVarName} = define${capitalize(kind)}({
  meta: {
    name: '${name}',
    version: ${version},
    stability: '${stability}',
    owners: [${owners.map((o) => `'${o}'`).join(', ')}],
    tags: [${tags.map((t) => `'${t}'`).join(', ')}],
    description: '${description}',
    goal: '${goal}',
    context: '${context}',
  },

  io: {
    input: ${inputSchemaName},
    output: ${outputSchemaName},
    errors: {
      // Define possible errors
      // EXAMPLE_ERROR: {
      //   description: 'Example error description',
      //   http: 400,
      //   when: 'When this error occurs',
      // },
    },
  },

  policy: {
    auth: '${auth}',
    ${flags.length > 0 ? `flags: [${flags.map((f) => `'${f}'`).join(', ')}],` : '// flags: [],'}
  },

  sideEffects: {
    ${data.emitsEvents ? "emits: [\n      // Define events to emit\n      // { ref: SomeEventSpec, when: 'always' }\n    ]," : '// emits: [],'}
    analytics: [
      // Define analytics events
    ],
  },

  transport: {
    rest: { method: '${kind === 'command' ? 'POST' : 'GET'}' },
    gql: { field: '${name.replace(/\./g, '_')}' },
    mcp: { toolName: '${name}.v${version}' },
  },

  acceptance: {
    scenarios: [
      {
        name: 'Happy path',
        given: ['preconditions'],
        when: ['action taken'],
        then: ['expected outcome'],
      },
    ],
    examples: [
      {
        name: 'Example usage',
        input: { /* example input */ },
        output: { ok: true },
      },
    ],
  },
});
`;
}
