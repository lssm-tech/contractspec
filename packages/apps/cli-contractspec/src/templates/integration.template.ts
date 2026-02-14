import type {
  IntegrationConfigFieldData,
  IntegrationSecretFieldData,
  IntegrationSpecData,
  Stability,
} from '../types';

export function generateIntegrationSpec(data: IntegrationSpecData): string {
  const specName = toPascalCase(data.name.split('.').pop() ?? 'Integration');
  const varName = `${specName}IntegrationSpec`;
  const registerFn = `register${specName}Integration`;

  const supportedModes = data.supportedModes.length
    ? data.supportedModes
    : ['managed'];
  const supportedModesLine = supportedModes
    .map((mode) => `'${mode}'`)
    .join(', ');

  const provides = data.capabilitiesProvided
    .map((cap) => `      { key: '${cap.key}', version: ${cap.version} }`)
    .join(',\n');

  const requires =
    data.capabilitiesRequired.length > 0
      ? `    requires: [
${data.capabilitiesRequired
  .map((req) => {
    const version =
      typeof req.version === 'number' ? `, version: ${req.version}` : '';
    const optional = req.optional ? ', optional: true' : '';
    const reason = req.reason ? `, reason: '${escape(req.reason)}'` : '';
    return `      { key: '${req.key}'${version}${optional}${reason} }`;
  })
  .join(',\n')}
    ],`
      : '';

  const configSchema = renderConfigSchema(data.configFields);
  const configExample = renderConfigExample(data.configFields);
  const secretSchema = renderSecretSchema(data.secretFields);
  const secretExample = renderSecretExample(data.secretFields);
  const docsUrl = data.docsUrl ? `  docsUrl: '${escape(data.docsUrl)}',\n` : '';
  const constraints = renderConstraints(data.rateLimitRpm, data.rateLimitRph);
  const byokSetup = renderByokSetup(
    supportedModes,
    data.byokSetupInstructions,
    data.byokRequiredScopes
  );

  return `import { StabilityEnum } from '@contractspec/lib.contracts/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '@contractspec/lib.contracts-integrations';

export const ${varName} = defineIntegration({
  meta: {
    key: '${data.name}',
    version: ${data.version},
    category: '${data.category}',
    displayName: '${escape(data.displayName)}',
    title: '${escape(data.title)}',
    description: '${escape(data.description)}',
    domain: '${escape(data.domain)}',
    owners: [${data.owners.map((owner) => `'${escape(owner)}'`).join(', ')}],
    tags: [${data.tags.map((tag) => `'${escape(tag)}'`).join(', ')}],
    stability: StabilityEnum.${stabilityToEnum(data.stability)},
  },
  supportedModes: [${supportedModesLine}],
  capabilities: {
    provides: [
${provides}
    ],
${requires.length > 0 ? `${requires}\n` : ''}  },
  configSchema: {
${configSchema}
    example: ${configExample},
  },
  secretSchema: {
${secretSchema}
    example: ${secretExample},
  },
${docsUrl}${constraints}${byokSetup}  healthCheck: {
    method: '${data.healthCheckMethod}',
    timeoutMs: ${data.healthCheckTimeoutMs},
  },
});

export function ${registerFn}(
  registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
  return registry.register(${varName});
}
`;
}

function renderConfigSchema(fields: IntegrationConfigFieldData[]): string {
  const requiredFields = fields.filter((field) => field.required);
  const requiredBlock =
    requiredFields.length > 0
      ? `      required: [${requiredFields
          .map((field) => `'${field.key}'`)
          .join(', ')}],
`
      : '';

  const properties = fields.length
    ? fields
        .map((field) => {
          const description = field.description
            ? `, description: '${escape(field.description)}'`
            : '';
          return `        ${field.key}: { type: '${mapConfigType(
            field.type
          )}'${description} }`;
        })
        .join(',\n')
    : '';

  return `    schema: {
      type: 'object',
${requiredBlock}      properties: {
${properties || '      '}
      },
    },\n`;
}

function renderSecretSchema(fields: IntegrationSecretFieldData[]): string {
  const requiredFields = fields.filter((field) => field.required);
  const requiredBlock =
    requiredFields.length > 0
      ? `      required: [${requiredFields
          .map((field) => `'${field.key}'`)
          .join(', ')}],
`
      : '';

  const properties = fields.length
    ? fields
        .map((field) => {
          const description = field.description
            ? `, description: '${escape(field.description)}'`
            : '';
          return `        ${field.key}: { type: 'string'${description} }`;
        })
        .join(',\n')
    : '';

  return `    schema: {
      type: 'object',
${requiredBlock}      properties: {
${properties || '      '}
      },
    },\n`;
}

function renderConfigExample(fields: IntegrationConfigFieldData[]): string {
  if (fields.length === 0) {
    return `{}`;
  }

  const exampleEntries = fields.map((field) => {
    switch (field.type) {
      case 'number':
        return `    ${field.key}: 0`;
      case 'boolean':
        return `    ${field.key}: true`;
      case 'string':
      default:
        return `    ${field.key}: '${field.key.toUpperCase()}_VALUE'`;
    }
  });

  return `{
${exampleEntries.join(',\n')}
  }`;
}

function renderSecretExample(fields: IntegrationSecretFieldData[]): string {
  if (fields.length === 0) {
    return `{}`;
  }

  const exampleEntries = fields.map(
    (field) => `    ${field.key}: '${field.key.toUpperCase()}_SECRET'`
  );

  return `{
${exampleEntries.join(',\n')}
  }`;
}

function renderConstraints(rpm?: number, rph?: number): string {
  if (rpm == null && rph == null) return '';
  const entries: string[] = [];
  if (rpm != null) entries.push(`      rpm: ${rpm}`);
  if (rph != null) entries.push(`      rph: ${rph}`);
  return `  constraints: {
    rateLimit: {
${entries.join(',\n')}
    },
  },
`;
}

function renderByokSetup(
  modes: string[],
  instructions?: string,
  scopes?: string[]
): string {
  if (!modes.includes('byok')) {
    return '';
  }

  const instructionsLine = instructions
    ? `    setupInstructions: '${escape(instructions)}',\n`
    : '';
  const scopesLine =
    scopes && scopes.length
      ? `    requiredScopes: [${scopes
          .map((scope) => `'${escape(scope)}'`)
          .join(', ')}],\n`
      : '';

  if (!instructionsLine && !scopesLine) {
    return '';
  }

  return `  byokSetup: {
${instructionsLine}${scopesLine}  },
`;
}

function mapConfigType(type: IntegrationConfigFieldData['type']): string {
  switch (type) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
    default:
      return 'string';
  }
}

function stabilityToEnum(stability: Stability): string {
  switch (stability) {
    case 'beta':
      return 'Beta';
    case 'stable':
      return 'Stable';
    case 'deprecated':
      return 'Deprecated';
    case 'experimental':
    default:
      return 'Experimental';
  }
}

function toPascalCase(value: string): string {
  return value
    .split(/[-_.]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function escape(value: string): string {
  return value.replace(/`/g, '\\`').replace(/'/g, "\\'");
}
