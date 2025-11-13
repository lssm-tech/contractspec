import { input, number, select, confirm } from '@inquirer/prompts';
import type {
  IntegrationCapabilityRefData,
  IntegrationCapabilityRequirementData,
  IntegrationCategoryData,
  IntegrationConfigFieldData,
  IntegrationConfigFieldType,
  IntegrationHealthCheckMethod,
  IntegrationSpecData,
  Stability,
} from '../../../types';

const STABILITY_CHOICES: { name: string; value: Stability }[] = [
  { name: 'Experimental', value: 'experimental' },
  { name: 'Beta', value: 'beta' },
  { name: 'Stable', value: 'stable' },
  { name: 'Deprecated', value: 'deprecated' },
];

const CATEGORY_CHOICES: { name: string; value: IntegrationCategoryData }[] = [
  { name: 'Payments', value: 'payments' },
  { name: 'Email', value: 'email' },
  { name: 'Calendar', value: 'calendar' },
  { name: 'SMS', value: 'sms' },
  { name: 'AI - LLM', value: 'ai-llm' },
  { name: 'AI - Voice', value: 'ai-voice' },
  { name: 'Speech to Text', value: 'speech-to-text' },
  { name: 'Vector Database', value: 'vector-db' },
  { name: 'Object Storage', value: 'storage' },
  { name: 'Accounting', value: 'accounting' },
  { name: 'CRM', value: 'crm' },
  { name: 'Helpdesk', value: 'helpdesk' },
  { name: 'Custom', value: 'custom' },
];

const CONFIG_TYPE_CHOICES: {
  name: string;
  value: IntegrationConfigFieldType;
  description: string;
}[] = [
  { name: 'String', value: 'string', description: 'Text or tokens' },
  { name: 'Number', value: 'number', description: 'Numeric value' },
  { name: 'Boolean', value: 'boolean', description: 'True/False' },
];

const HEALTH_CHECK_CHOICES: {
  name: string;
  value: IntegrationHealthCheckMethod;
  description: string;
}[] = [
  { name: 'Ping endpoint (default)', value: 'ping', description: 'Simple ping or status request' },
  { name: 'List resources', value: 'list', description: 'List entities (e.g., customers) to validate access' },
  { name: 'Custom (manual health check)', value: 'custom', description: 'Custom logic handled by connector implementation' },
];

export async function integrationWizard(
  defaults?: Partial<IntegrationSpecData>
): Promise<IntegrationSpecData> {
  const name = await input({
    message:
      'Integration key (dot notation, e.g., "payments.stripe"):',
    default: defaults?.name,
    validate: validateDotNotation,
  });

  const version = await number({
    message: 'Version:',
    default: defaults?.version ?? 1,
    required: true,
    validate: positiveInt,
  });

  const domain = await input({
    message: 'Domain / bounded context:',
    default: defaults?.domain ?? name.split('.')[0] ?? 'platform',
    validate: (value: string) =>
      value.trim().length > 0 || 'Domain is required',
  });

  const displayName = await input({
    message: 'Display name (UI label):',
    default: defaults?.displayName ?? toTitleCase(name.split('.').pop() ?? name),
    validate: (value: string) =>
      value.trim().length > 0 || 'Display name is required',
  });

  const title = await input({
    message: 'Title (internal title used in docs):',
    default: defaults?.title ?? `${displayName} Integration`,
    validate: (value: string) =>
      value.trim().length > 0 || 'Title is required',
  });

  const description = await input({
    message: 'Description (1–2 sentences):',
    default: defaults?.description ?? '',
  });

  const category = await select<IntegrationCategoryData>({
    message: 'Integration category:',
    choices: CATEGORY_CHOICES,
    default: defaults?.category ?? 'custom',
  });

  const stability = await select<Stability>({
    message: 'Stability:',
    choices: STABILITY_CHOICES,
    default: defaults?.stability ?? 'experimental',
  });

  const ownersInput = await input({
    message: 'Owners (comma-separated, e.g., "@team.platform, @team.payments"):',
    default: defaults?.owners?.join(', ') ?? '@team.platform',
    validate: validateOwners,
  });

  const tagsInput = await input({
    message: 'Tags (comma-separated, optional):',
    default: defaults?.tags?.join(', ') ?? '',
  });

  const capabilitiesProvided = await collectProvidedCapabilities(
    defaults?.capabilitiesProvided
  );

  const capabilitiesRequired = await collectRequiredCapabilities(
    defaults?.capabilitiesRequired
  );

  const configFields = await collectConfigFields(defaults?.configFields);

  const docsUrl = await input({
    message: 'Documentation URL (optional):',
    default: defaults?.docsUrl ?? '',
  });

  const rateLimitRpm = await optionalNumberInput(
    'Rate limit (requests per minute, optional):',
    defaults?.rateLimitRpm
  );

  const rateLimitRph = await optionalNumberInput(
    'Rate limit (requests per hour, optional):',
    defaults?.rateLimitRph
  );

  const healthCheckMethod = await select<IntegrationHealthCheckMethod>({
    message: 'Health check method:',
    choices: HEALTH_CHECK_CHOICES,
    default: defaults?.healthCheckMethod ?? 'ping',
  });

  const healthCheckTimeoutMs = await number({
    message: 'Health check timeout (ms):',
    default: defaults?.healthCheckTimeoutMs ?? 5000,
    required: true,
    validate: positiveInt,
  });

  return {
    name,
    version,
    description,
    owners: splitList(ownersInput),
    tags: splitList(tagsInput),
    stability,
    title,
    domain,
    displayName,
    category,
    capabilitiesProvided,
    capabilitiesRequired,
    configFields,
    docsUrl: docsUrl.trim() || undefined,
    rateLimitRpm,
    rateLimitRph,
    healthCheckMethod,
    healthCheckTimeoutMs,
  };
}

async function collectProvidedCapabilities(
  defaults?: IntegrationCapabilityRefData[]
): Promise<IntegrationCapabilityRefData[]> {
  const items: IntegrationCapabilityRefData[] = [];
  let addAnother = true;
  let index = 0;

  while (addAnother || items.length === 0) {
    const def = defaults?.[index];
    const key = await input({
      message: 'Provided capability key (e.g., "payments.psp"):',
      default: def?.key ?? (items.length === 0 ? 'payments.psp' : ''),
      validate: (value: string) =>
        value.trim().length > 0 || 'Capability key is required',
    });
    const version = await number({
      message: 'Capability version:',
      default: def?.version ?? 1,
      required: true,
      validate: positiveInt,
    });

    items.push({ key, version });

    addAnother = await confirm({
      message: 'Add another provided capability?',
      default: false,
    });
    index += 1;
  }
  return items;
}

async function collectRequiredCapabilities(
  defaults?: IntegrationCapabilityRequirementData[]
): Promise<IntegrationCapabilityRequirementData[]> {
  const hasRequirements = await confirm({
    message: 'Does this integration require other capabilities?',
    default: Boolean(defaults && defaults.length > 0),
  });
  if (!hasRequirements) return [];

  const items: IntegrationCapabilityRequirementData[] = [];
  let index = 0;
  let addAnother = true;

  while (addAnother || items.length === 0) {
    const def = defaults?.[index];
    const key = await input({
      message: 'Required capability key:',
      default: def?.key ?? '',
      validate: (value: string) =>
        value.trim().length > 0 || 'Capability key is required',
    });
    const versionRaw = await input({
      message: 'Required capability version (optional):',
      default:
        typeof def?.version === 'number' && !Number.isNaN(def.version)
          ? String(def.version)
          : '',
    });
    const optional = await confirm({
      message: 'Is this requirement optional?',
      default: def?.optional ?? false,
    });
    const reason = await input({
      message: 'Reason / notes (optional):',
      default: def?.reason ?? '',
    });

    items.push({
      key,
      version: parseOptionalNumber(versionRaw),
      optional,
      reason: reason.trim() || undefined,
    });

    addAnother = await confirm({
      message: 'Add another required capability?',
      default: false,
    });
    index += 1;
  }

  return items;
}

async function collectConfigFields(
  defaults?: IntegrationConfigFieldData[]
): Promise<IntegrationConfigFieldData[]> {
  const fields: IntegrationConfigFieldData[] = [];
  let addAnother = true;
  let index = 0;

  while (addAnother || fields.length === 0) {
    const def = defaults?.[index];
    const key = await input({
      message: 'Config field key (e.g., "apiKey"):',
      default: def?.key ?? (fields.length === 0 ? 'apiKey' : ''),
      validate: (value: string) =>
        value.trim().length > 0 || 'Config key is required',
    });

    const type = await select<IntegrationConfigFieldType>({
      message: 'Config field type:',
      choices: CONFIG_TYPE_CHOICES,
      default: def?.type ?? 'string',
    });

    const required = await confirm({
      message: 'Is this field required?',
      default: def?.required ?? true,
    });

    const description = await input({
      message: 'Field description (optional):',
      default: def?.description ?? '',
    });

    fields.push({
      key,
      type,
      required,
      description: description.trim() || undefined,
    });

    addAnother = await confirm({
      message: 'Add another config field?',
      default: false,
    });
    index += 1;
  }

  return fields;
}

function validateDotNotation(value: string): true | string {
  return /^[a-z][a-z0-9]*(\.[a-z][a-z0-9_-]*)+$/i.test(value)
    ? true
    : 'Use dot notation like "domain.integration.provider"';
}

function validateOwners(value: string): true | string {
  if (value.trim().length === 0) return 'At least one owner is required';
  return true;
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function positiveInt(value: number): true | string {
  return Number.isInteger(value) && value > 0
    ? true
    : 'Must be a positive integer';
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function optionalNumberInput(
  message: string,
  defaultValue?: number
): Promise<number | undefined> {
  const raw = await input({
    message,
    default:
      typeof defaultValue === 'number' && !Number.isNaN(defaultValue)
        ? String(defaultValue)
        : '',
  });
  return parseOptionalNumber(raw.trim());
}

function toTitleCase(value: string): string {
  return value
    .split(/[-_.\s]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

