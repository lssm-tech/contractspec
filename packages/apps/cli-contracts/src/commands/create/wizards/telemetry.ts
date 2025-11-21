import { confirm, input, number, select } from '@inquirer/prompts';
import type {
  TelemetryEventData,
  TelemetryPropertyData,
  TelemetryProviderData,
  TelemetrySpecData,
  TelemetryPrivacy,
  Stability,
} from '../../../types';

const PRIVACY_CHOICES: { name: string; value: TelemetryPrivacy }[] = [
  { name: 'Public', value: 'public' },
  { name: 'Internal', value: 'internal' },
  { name: 'PII', value: 'pii' },
  { name: 'Sensitive', value: 'sensitive' },
];

const PROPERTY_TYPE_CHOICES: {
  name: string;
  value: TelemetryPropertyData['type'];
}[] = [
  { name: 'String', value: 'string' },
  { name: 'Number', value: 'number' },
  { name: 'Boolean', value: 'boolean' },
  { name: 'Timestamp', value: 'timestamp' },
  { name: 'JSON', value: 'json' },
];

const PROVIDER_CHOICES: {
  name: string;
  value: TelemetryProviderData['type'];
}[] = [
  { name: 'PostHog', value: 'posthog' },
  { name: 'Segment', value: 'segment' },
  { name: 'OpenTelemetry', value: 'opentelemetry' },
  { name: 'Internal', value: 'internal' },
];

export async function telemetryWizard(): Promise<TelemetrySpecData> {
  const name = await input({
    message: 'Telemetry spec name (e.g., "sigil.telemetry"):',
    validate: (value: string) => value.trim().length > 0 || 'Name is required',
  });

  const versionValue = await number({
    message: 'Version:',
    default: 1,
    validate: (value?: number) =>
      typeof value === 'number' && Number.isInteger(value) && value > 0
        ? true
        : 'Version must be a positive integer',
  });
  const version = versionValue ?? 1;

  const description = await input({
    message: 'Description:',
    default: '',
  });

  const domain = await input({
    message: 'Domain / bounded context:',
    default: name.split('.')[0] ?? '',
    validate: (value: string) =>
      value.trim().length > 0 || 'Domain is required',
  });

  const ownersInput = await input({
    message: 'Owners (comma-separated, e.g., "@team, @person"):',
    default: '@team.telemetry',
    validate: validateOwners,
  });

  const tagsInput = await input({
    message: 'Tags (comma-separated, optional):',
    default: '',
  });

  const stability = await select<Stability>({
    message: 'Stability:',
    choices: [
      { name: 'Experimental', value: 'experimental' },
      { name: 'Beta', value: 'beta' },
      { name: 'Stable', value: 'stable' },
      { name: 'Deprecated', value: 'deprecated' },
    ],
    default: 'experimental',
  });

  const defaultRetention = await number({
    message: 'Default retention days (optional):',
    default: 30,
  });

  const defaultSamplingRate = await number({
    message: 'Default sampling rate (0-1):',
    default: 1,
    validate: (value?: number) =>
      typeof value === 'number' && value >= 0 && value <= 1
        ? true
        : 'Sampling rate must be between 0 and 1',
  });

  const anomalyEnabled = await confirm({
    message: 'Enable global anomaly detection?',
    default: false,
  });

  let anomalyCheckIntervalMs: number | undefined;
  if (anomalyEnabled) {
    anomalyCheckIntervalMs = await number({
      message: 'Anomaly check interval (ms):',
      default: 60000,
      validate: positiveNumber,
    });
  }

  const providers: TelemetryProviderData[] = [];
  let addAnotherProvider = await confirm({
    message: 'Configure a telemetry provider?',
    default: false,
  });

  while (addAnotherProvider) {
    const providerType = await select<TelemetryProviderData['type']>({
      message: 'Provider type:',
      choices: PROVIDER_CHOICES,
    });
    const providerConfig = await input({
      message: 'Provider config (JSON string or description):',
      default: '{}',
    });
    providers.push({
      type: providerType,
      config: providerConfig,
    });
    addAnotherProvider = await confirm({
      message: 'Add another provider?',
      default: false,
    });
  }

  const events = await collectEvents();

  return {
    name,
    version,
    description,
    domain,
    owners: splitList(ownersInput),
    tags: splitList(tagsInput),
    stability,
    defaultRetentionDays: defaultRetention ?? undefined,
    defaultSamplingRate: defaultSamplingRate ?? undefined,
    anomalyEnabled,
    anomalyCheckIntervalMs: anomalyCheckIntervalMs ?? undefined,
    providers,
    events,
  };
}

async function collectEvents(): Promise<TelemetryEventData[]> {
  const events: TelemetryEventData[] = [];
  let addAnother = true;

  while (addAnother || events.length === 0) {
    const eventName = await input({
      message: 'Event name (e.g., "sigil.telemetry.workflow_step"):',
      validate: (value: string) =>
        value.trim().length > 0 || 'Event name is required',
    });
    const eventVersionValue = await number({
      message: 'Event version:',
      default: 1,
      validate: (value?: number) =>
        typeof value === 'number' && Number.isInteger(value) && value > 0
          ? true
          : 'Version must be a positive integer',
    });
    const eventVersion = eventVersionValue ?? 1;
    const what = await input({
      message: 'What happened?',
      validate: (value: string) =>
        value.trim().length > 0 || '"What" is required',
    });
    const who = await input({
      message: 'Who is involved? (optional)',
      default: '',
    });
    const why = await input({
      message: 'Why does it matter? (optional)',
      default: '',
    });
    const privacy = await select({
      message: 'Privacy level:',
      choices: PRIVACY_CHOICES,
      default: 'internal',
    });

    const retentionDays = await number({
      message: 'Retention days for this event (optional):',
      default: undefined,
    });
    let retentionPolicy: 'archive' | 'delete' | undefined;
    if (typeof retentionDays === 'number') {
      retentionPolicy = await select<'archive' | 'delete'>({
        message: 'Retention policy:',
        choices: [
          { name: 'Archive', value: 'archive' },
          { name: 'Delete', value: 'delete' },
        ],
        default: 'archive',
      });
    }

    const samplingRate = await number({
      message: 'Sampling rate for this event (0-1, optional):',
      default: undefined,
    });
    const samplingConditions =
      typeof samplingRate === 'number'
        ? await input({
            message: 'Sampling conditions (comma-separated, optional):',
            default: '',
          })
        : undefined;

    const anomalyEnabled = await confirm({
      message: 'Enable anomaly detection for this event?',
      default: false,
    });

    let anomalyMinimumSample: number | undefined;
    let anomalyRules: TelemetryEventData['anomalyRules'];
    let anomalyActions: TelemetryEventData['anomalyActions'];
    if (anomalyEnabled) {
      anomalyMinimumSample = await number({
        message: 'Minimum samples before detecting anomalies:',
        default: 10,
        validate: positiveNumber,
      });
      anomalyRules = await collectAnomalyRules();
      const action = await select<'alert' | 'log' | 'trigger_regen'>({
        message: 'Anomaly actions:',
        choices: [
          { name: 'Alert', value: 'alert' },
          { name: 'Log', value: 'log' },
          { name: 'Trigger regeneration', value: 'trigger_regen' },
        ],
        default: 'alert',
        loop: false,
      });
      anomalyActions = [action];
    }

    const tagsInput = await input({
      message: 'Tags for this event (comma-separated, optional):',
      default: '',
    });

    const properties = await collectProperties();

    events.push({
      name: eventName,
      version: eventVersion,
      what,
      who: who || undefined,
      why: why || undefined,
      privacy,
      properties,
      retentionDays: retentionDays ?? undefined,
      retentionPolicy,
      samplingRate: typeof samplingRate === 'number' ? samplingRate : undefined,
      samplingConditions: samplingConditions || undefined,
      anomalyEnabled,
      anomalyMinimumSample,
      anomalyRules,
      anomalyActions,
      tags: splitList(tagsInput),
    });

    addAnother = await confirm({
      message: 'Add another event?',
      default: events.length === 0,
    });
  }

  return events;
}

async function collectProperties(): Promise<TelemetryPropertyData[]> {
  const properties: TelemetryPropertyData[] = [];
  let addAnother = true;
  while (addAnother || properties.length === 0) {
    const name = await input({
      message: 'Property name:',
      validate: (value: string) =>
        value.trim().length > 0 || 'Property name is required',
    });
    const type = await select<TelemetryPropertyData['type']>({
      message: 'Property type:',
      choices: PROPERTY_TYPE_CHOICES,
      default: 'string',
    });
    const required = await confirm({
      message: 'Required?',
      default: false,
    });
    const pii = await confirm({
      message: 'Contains PII?',
      default: false,
    });
    const redact = pii
      ? await confirm({
          message: 'Redact this property?',
          default: true,
        })
      : false;
    const description = await input({
      message: 'Description (optional):',
      default: '',
    });
    properties.push({
      name,
      type,
      required,
      pii,
      redact,
      description: description || undefined,
    });
    addAnother = await confirm({
      message: 'Add another property?',
      default: properties.length < 2,
    });
  }
  return properties;
}

async function collectAnomalyRules(): Promise<
  TelemetryEventData['anomalyRules']
> {
  const rules: TelemetryEventData['anomalyRules'] = [];
  let addAnother = true;
  while (addAnother || rules.length === 0) {
    const metric = await input({
      message: 'Metric name to monitor:',
      validate: (value: string) =>
        value.trim().length > 0 || 'Metric name is required',
    });
    const min = await number({
      message: 'Minimum threshold (optional):',
      default: undefined,
    });
    const max = await number({
      message: 'Maximum threshold (optional):',
      default: undefined,
    });
    rules.push({
      metric,
      min: typeof min === 'number' ? min : undefined,
      max: typeof max === 'number' ? max : undefined,
    });
    addAnother = await confirm({
      message: 'Add another anomaly rule?',
      default: false,
    });
  }
  return rules;
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateOwners(value: string) {
  const owners = splitList(value);
  if (owners.length === 0) return 'At least one owner is required';
  if (!owners.every((owner) => owner.startsWith('@'))) {
    return 'Owners must start with @ (e.g., "@team")';
  }
  return true;
}

function positiveNumber(value?: number) {
  if (typeof value !== 'number' || value <= 0) {
    return 'Must be a positive number';
  }
  return true;
}
