import type { MigrationSpecData } from '../types/spec-types';
import { toPascalCase, escapeString } from './utils';

export function generateMigrationSpec(data: MigrationSpecData): string {
  const specName = toPascalCase(data.name.split('.').pop() ?? 'Migration');
  const migrationVar = `${specName}Migration`;

  const dependencies =
    data.dependencies.length > 0
      ? `dependencies: [${data.dependencies
          .map((dep) => `'${escapeString(dep)}'`)
          .join(', ')}],`
      : '';

  return `import type { MigrationSpec } from '@lssm/lib.contracts/migrations';

export const ${migrationVar}: MigrationSpec = {
  meta: {
    name: '${escapeString(data.name)}',
    version: ${data.version},
    title: '${escape(data.title)}',
    description: '${escape(data.description ?? '')}',
    domain: '${escape(data.domain)}',
    owners: [${data.owners.map((owner) => `'${escapeString(owner)}'`).join(', ')}],
    tags: [${data.tags.map((tag) => `'${escapeString(tag)}'`).join(', ')}],
    stability: '${data.stability}',
  },
  plan: {
    up: [
${renderSteps(data.up)}
    ],${
      data.down && data.down.length
        ? `
    down: [
${renderSteps(data.down)}
    ],`
        : ''
    }
  },
  ${dependencies}
};
`;
}

function renderSteps(steps: MigrationSpecData['up']) {
  return steps
    .map((step) => {
      const description = step.description
        ? `description: '${escape(step.description)}',`
        : '';
      switch (step.kind) {
        case 'schema':
          return `      {
        kind: 'schema',
        ${description}
        sql: \`${escape(step.sql ?? '')}\`,
      }`;
        case 'data':
          return `      {
        kind: 'data',
        ${description}
        script: \`${escape(step.script ?? '')}\`,
      }`;
        case 'validation':
        default:
          return `      {
        kind: 'validation',
        ${description}
        assertion: \`${escape(step.assertion ?? '')}\`,
      }`;
      }
    })
    .join(',\n');
}

function escape(value: string): string {
  return value.replace(/`/g, '\\`').replace(/'/g, "\\'");
}

