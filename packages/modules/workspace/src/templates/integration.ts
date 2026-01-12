import type { IntegrationSpecData } from '../types/spec-types';
import { toPascalCase } from './utils';
import {
  escape,
  renderByokSetup,
  renderConfigExample,
  renderConfigSchema,
  renderConstraints,
  renderProvides,
  renderRequires,
  renderSecretExample,
  renderSecretSchema,
  stabilityToEnum,
} from './integration-utils';

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

  const provides = renderProvides(data);
  const requires = renderRequires(data);

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

  return `import { StabilityEnum, defineIntegration } from '@contractspec/lib.contracts';
import type { IntegrationSpecRegistry } from '@contractspec/lib.contracts/integrations/spec';

export const ${varName} = defineIntegration({
  meta: {
    key: '${escape(data.name)}',
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
${configSchema}    example: ${configExample},
  },
  secretSchema: {
${secretSchema}    example: ${secretExample},
  },
${docsUrl}${constraints}${byokSetup}  healthCheck: {
    method: '${data.healthCheckMethod}',
    timeoutMs: ${data.healthCheckTimeoutMs ?? 5000},
  },
});

export function ${registerFn}(registry: IntegrationSpecRegistry): IntegrationSpecRegistry {
  return registry.register(${varName});
}
`;
}
