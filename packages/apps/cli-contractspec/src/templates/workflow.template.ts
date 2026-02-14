import type { WorkflowSpecData } from '../types';

export function generateWorkflowSpec(data: WorkflowSpecData): string {
  const specVarName =
    toPascalCase(data.name.split('.').pop() ?? 'Workflow') + 'Workflow';

  const stepsCode = data.steps.map((step) => formatStep(step)).join(',\n');

  const transitionsCode = data.transitions
    .map(
      (transition) => `    {
      from: '${transition.from}',
      to: '${transition.to}',
${transition.condition ? `      condition: '${escapeString(transition.condition)}',` : ''}
    }`
    )
    .join(',\n');

  return `import { defineWorkflow } from '@contractspec/lib.contracts/workflow';

/**
 * Workflow generated via contractspec CLI.
 * TODO:
 *  - Review step definitions and descriptions.
 *  - Wire automation steps to actual operations.
 *  - Provide form renderers for human steps.
 *  - Add guards/conditions as needed.
 */
export const ${specVarName} = defineWorkflow({
  meta: {
    key: '${data.name}',
    version: ${data.version},
    title: '${escapeString(data.title)}',
    description: '${escapeString(data.description)}',
    domain: '${escapeString(data.domain)}',
    stability: '${data.stability}',
    owners: [${data.owners.map((owner) => `'${owner}'`).join(', ')}],
    tags: [${data.tags.map((tag) => `'${tag}'`).join(', ')}],
  },
  definition: {
${data.entryStepId ? `    entryStepId: '${data.entryStepId}',\n` : ''}    steps: [
${stepsCode}
    ],
    transitions: [
${transitionsCode}
    ],
  },
  ${
    data.policyFlags.length > 0
      ? `policy: {
    flags: [${data.policyFlags.map((flag) => `'${flag}'`).join(', ')}],
  },`
      : '// policy: { flags: [] },'
  }
});
`;
}

function formatStep(step: WorkflowSpecData['steps'][number]): string {
  const lines: string[] = [
    `    {`,
    `      id: '${step.id}',`,
    `      type: '${step.type}',`,
    `      label: '${escapeString(step.label)}',`,
  ];
  if (step.description) {
    lines.push(`      description: '${escapeString(step.description)}',`);
  }

  const actionLines: string[] = [];
  if (step.operation) {
    actionLines.push(
      `operation: { name: '${step.operation.name}', version: ${step.operation.version} }`
    );
  }
  if (step.form) {
    actionLines.push(
      `form: { key: '${step.form.key}', version: ${step.form.version} }`
    );
  }
  if (actionLines.length) {
    lines.push(`      action: { ${actionLines.join(', ')} },`);
  }

  lines.push(`    }`);
  return lines.join('\n');
}

function toPascalCase(value: string): string {
  return value
    .split(/[-_.]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function escapeString(value: string): string {
  return value.replace(/'/g, "\\'");
}
