import type { ExperimentSpecData } from '../types/spec-types';
import { toPascalCase } from './utils';

export function generateExperimentSpec(data: ExperimentSpecData): string {
  const specVar =
    toPascalCase(data.name.split('.').pop() ?? 'Experiment') + 'Experiment';

  const variants = data.variants
    .map((variant) => {
      const overrides = variant.overrides?.length
        ? `      overrides: [
${variant.overrides
  .map(
    (override) => `        {
          type: '${override.type}',
          target: '${escapeString(override.target)}',
          ${typeof override.version === 'number' ? `version: ${override.version},` : ''}
        }`
  )
  .join(',\n')}
      ],`
        : '';
      return `    {
      id: '${escapeString(variant.id)}',
      name: '${escapeString(variant.name)}',
      ${variant.description ? `description: '${escapeString(variant.description)}',` : ''}
      ${typeof variant.weight === 'number' ? `weight: ${variant.weight},` : ''}
${overrides}
    }`;
    })
    .join(',\n');

  const allocation = renderAllocation(data.allocation);

  const metrics = data.successMetrics?.length
    ? `  successMetrics: [
${data.successMetrics
  .map(
    (metric) => `    {
      name: '${escapeString(metric.name)}',
      telemetryEvent: { name: '${escapeString(metric.eventName)}', version: ${metric.eventVersion} },
      aggregation: '${metric.aggregation}',
      ${typeof metric.target === 'number' ? `target: ${metric.target},` : ''}
    }`
  )
  .join(',\n')}
  ],`
    : '';

  return `import type { ExperimentSpec } from '@lssm/lib.contracts/experiments';

export const ${specVar}: ExperimentSpec = {
  meta: {
    name: '${escapeString(data.name)}',
    version: ${data.version},
    title: '${escapeString(data.name)} experiment',
    description: '${escapeString(
      data.description || 'Describe the experiment goal.'
    )}',
    domain: '${escapeString(data.domain)}',
    owners: [${data.owners.map((owner) => `'${escapeString(owner)}'`).join(', ')}],
    tags: [${data.tags.map((tag) => `'${escapeString(tag)}'`).join(', ')}],
    stability: '${data.stability}',
  },
  controlVariant: '${escapeString(data.controlVariant)}',
  variants: [
${variants}
  ],
  allocation: ${allocation},
${metrics}
};
`;
}

function renderAllocation(
  allocation: ExperimentSpecData['allocation']
): string {
  switch (allocation.type) {
    case 'random':
      return `{
    type: 'random',
    ${allocation.salt ? `salt: '${escapeString(allocation.salt)}',` : ''}
  }`;
    case 'sticky':
      return `{
    type: 'sticky',
    attribute: '${allocation.attribute}',
    ${allocation.salt ? `salt: '${escapeString(allocation.salt)}',` : ''}
  }`;
    case 'targeted':
      return `{
    type: 'targeted',
    rules: [
${allocation.rules
  .map(
    (rule) => `      {
        variantId: '${escapeString(rule.variantId)}',
        ${typeof rule.percentage === 'number' ? `percentage: ${rule.percentage},` : ''}
        ${
          rule.policy
            ? `policy: { name: '${escapeString(rule.policy.name)}'${typeof rule.policy.version === 'number' ? `, version: ${rule.policy.version}` : ''} },`
            : ''
        }
        ${rule.expression ? `expression: '${escapeString(rule.expression)}',` : ''}
      }`
  )
  .join(',\n')}
    ],
    fallback: '${allocation.fallback ?? 'control'}',
  }`;
    default:
      return renderUnsupportedAllocation(allocation);
  }
}

function escapeString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function renderUnsupportedAllocation(allocation: never): string {
  throw new Error(
    `Unsupported allocation type ${allocation as unknown as string}`
  );
}
