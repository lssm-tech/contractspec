import type { TelemetrySpecData } from '../types/spec-types';
import { toPascalCase } from './utils';

export function generateTelemetrySpec(data: TelemetrySpecData): string {
  const specVar =
    toPascalCase(data.name.split('.').pop() ?? 'Telemetry') + 'Telemetry';

  const providers = data.providers?.length
    ? `providers: [
${data.providers
  .map(
    (provider) => `      {
        type: '${provider.type}',
        config: ${formatConfigValue(provider.config)},
      }`
  )
  .join(',\n')}
    ],`
    : '';

  const events = data.events
    .map((event) => {
      const properties = event.properties
        .map(
          (prop) => `      '${prop.name}': {
        type: '${prop.type}',
        ${prop.required ? 'required: true,' : ''}
        ${prop.pii ? 'pii: true,' : ''}
        ${prop.redact ? 'redact: true,' : ''}
        ${
          prop.description
            ? `description: '${escapeString(prop.description)}',`
            : ''
        }
      }`
        )
        .join(',\n');

      const anomalyRules = event.anomalyRules?.length
        ? `      anomalyDetection: {
        enabled: true,
        ${typeof event.anomalyMinimumSample === 'number' ? `minimumSample: ${event.anomalyMinimumSample},` : ''}
        thresholds: [
${event.anomalyRules
  .map(
    (rule) => `          {
            metric: '${escapeString(rule.metric)}',
            ${typeof rule.min === 'number' ? `min: ${rule.min},` : ''}
            ${typeof rule.max === 'number' ? `max: ${rule.max},` : ''}
          }`
  )
  .join(',\n')}
        ],
        actions: [${(event.anomalyActions ?? [])
          .map((action) => `'${action}'`)
          .join(', ')}],
      },`
        : event.anomalyEnabled
          ? `      anomalyDetection: {
        enabled: true,
        ${typeof event.anomalyMinimumSample === 'number' ? `minimumSample: ${event.anomalyMinimumSample},` : ''}
      },`
          : '';

      return `    {
      name: '${escapeString(event.name)}',
      version: ${event.version},
      semantics: {
        what: '${escapeString(event.what)}',
        ${event.who ? `who: '${escapeString(event.who)}',` : ''}
        ${event.why ? `why: '${escapeString(event.why)}',` : ''}
      },
      privacy: '${event.privacy}',
      properties: {
${properties}
      },
      ${
        typeof event.retentionDays === 'number'
          ? `retention: { days: ${event.retentionDays}, ${
              event.retentionPolicy ? `policy: '${event.retentionPolicy}'` : ''
            } },`
          : ''
      }
      ${
        typeof event.samplingRate === 'number'
          ? `sampling: { rate: ${event.samplingRate}${
              event.samplingConditions
                ? `, conditions: ['${escapeString(event.samplingConditions)}']`
                : ''
            } },`
          : ''
      }
${anomalyRules}
      ${event.tags?.length ? `tags: [${event.tags.map((tag) => `'${escapeString(tag)}'`).join(', ')}],` : ''}
    }`;
    })
    .join(',\n');

  return `import type { TelemetrySpec } from '@lssm/lib.contracts/telemetry';

export const ${specVar}: TelemetrySpec = {
  meta: {
    name: '${escapeString(data.name)}',
    version: ${data.version},
    title: '${escapeString(data.name)} telemetry',
    description: '${escapeString(
      data.description || 'Describe the purpose of this telemetry spec.'
    )}',
    domain: '${escapeString(data.domain)}',
    owners: [${data.owners.map((owner) => `'${escapeString(owner)}'`).join(', ')}],
    tags: [${data.tags.map((tag) => `'${escapeString(tag)}'`).join(', ')}],
    stability: '${data.stability}',
  },
  config: {
    ${typeof data.defaultRetentionDays === 'number' ? `defaultRetentionDays: ${data.defaultRetentionDays},` : ''}
    ${typeof data.defaultSamplingRate === 'number' ? `defaultSamplingRate: ${data.defaultSamplingRate},` : ''}
    ${data.anomalyEnabled ? `anomalyDetection: { enabled: true${typeof data.anomalyCheckIntervalMs === 'number' ? `, checkIntervalMs: ${data.anomalyCheckIntervalMs}` : ''} },` : ''}
${providers}
  },
  events: [
${events}
  ],
};
`;
}

function escapeString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatConfigValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '{}';
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    return trimmed;
  }
  return `'${escapeString(trimmed)}'`;
}

