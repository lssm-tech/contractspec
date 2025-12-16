import type {
  IntegrationConfigFieldData,
  IntegrationSecretFieldData,
  IntegrationSpecData,
  Stability,
} from '../types/spec-types';

export function renderConfigSchema(
  fields: IntegrationConfigFieldData[]
): string {
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

export function renderSecretSchema(
  fields: IntegrationSecretFieldData[]
): string {
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

export function renderConfigExample(
  fields: IntegrationConfigFieldData[]
): string {
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

export function renderSecretExample(
  fields: IntegrationSecretFieldData[]
): string {
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

export function renderConstraints(rpm?: number, rph?: number): string {
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

export function renderByokSetup(
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

export function mapConfigType(
  type: IntegrationConfigFieldData['type']
): string {
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

export function stabilityToEnum(stability: Stability): string {
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

export function renderProvides(data: IntegrationSpecData): string {
  return data.capabilitiesProvided
    .map((cap) => `      { key: '${cap.key}', version: ${cap.version} }`)
    .join(',\n');
}

export function renderRequires(data: IntegrationSpecData): string {
  if (data.capabilitiesRequired.length === 0) return '';

  return `    requires: [
${data.capabilitiesRequired
  .map((req) => {
    const version =
      typeof req.version === 'number' ? `, version: ${req.version}` : '';
    const optional = req.optional ? ', optional: true' : '';
    const reason = req.reason ? `, reason: '${escape(req.reason)}'` : '';
    return `      { key: '${req.key}'${version}${optional}${reason} }`;
  })
  .join(',\n')}
    ],`;
}

export function escape(value: string): string {
  return value.replace(/`/g, '\\`').replace(/'/g, "\\'");
}


