import { confirm, input, number, select } from '@inquirer/prompts';
import type {
  ExperimentAllocationData,
  ExperimentMetricData,
  ExperimentSpecData,
  ExperimentVariantData,
  ExperimentVariantOverrideData,
  Stability,
  TargetedAllocationData,
  TargetingRuleData,
} from '../../../types';

const ALLOCATION_CHOICES: {
  name: string;
  value: ExperimentAllocationData['type'];
}[] = [
  { name: 'Random', value: 'random' },
  { name: 'Sticky', value: 'sticky' },
  { name: 'Targeted', value: 'targeted' },
];

export async function experimentWizard(): Promise<ExperimentSpecData> {
  const name = await input({
    message: 'Experiment name (e.g., "sigil.onboarding.split_form"):',
    validate: required,
  });

  const versionValue = await number({
    message: 'Version:',
    default: 1,
    validate: positiveInt,
  });
  const version = versionValue ?? 1;

  const description = await input({
    message: 'Description:',
    default: '',
  });

  const domain = await input({
    message: 'Domain / bounded context:',
    default: name.split('.')[0] ?? '',
    validate: required,
  });

  const ownersInput = await input({
    message: 'Owners (comma-separated, e.g., "@team, @person"):',
    default: '@team.experiment',
    validate: validateOwners,
  });

  const tagsInput = await input({
    message: 'Tags (comma-separated, optional):',
    default: 'experiment',
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

  const controlVariant = await input({
    message: 'Control variant id:',
    default: 'control',
    validate: required,
  });

  const variants = await collectVariants(controlVariant);
  const allocation = await collectAllocation();
  const successMetrics = await collectMetrics();

  return {
    name,
    version,
    description,
    domain,
    owners: splitList(ownersInput),
    tags: splitList(tagsInput),
    stability,
    controlVariant,
    variants,
    allocation,
    successMetrics,
  };
}

async function collectVariants(
  controlVariant: string
): Promise<ExperimentVariantData[]> {
  const variants: ExperimentVariantData[] = [];
  let addAnother = true;

  while (addAnother || variants.length === 0) {
    const id = await input({
      message: 'Variant id:',
      default: variants.length === 0 ? controlVariant : undefined,
      validate: required,
    });

    const name = await input({
      message: 'Variant label:',
      default: id,
    });

    const description = await input({
      message: 'Variant description (optional):',
      default: '',
    });

    const weightValue = await number({
      message: 'Weight (optional, defaults to 1):',
      default: undefined,
    });

    const overrides = await collectOverrides();
    const normalizedOverrides = overrides.length > 0 ? overrides : undefined;

    variants.push({
      id,
      name,
      description: description || undefined,
      weight: typeof weightValue === 'number' ? weightValue : undefined,
      overrides: normalizedOverrides,
    });

    addAnother = await confirm({
      message: 'Add another variant?',
      default: variants.length === 0,
    });
  }

  return variants;
}

async function collectOverrides(): Promise<ExperimentVariantOverrideData[]> {
  const overrides: ExperimentVariantOverrideData[] = [];
  let addOverride = await confirm({
    message: 'Add variant overrides (DataView/Workflow/Theme)?',
    default: false,
  });

  while (addOverride) {
    const type = await select<ExperimentVariantOverrideData['type']>({
      message: 'Override type:',
      choices: [
        { name: 'Data view', value: 'dataView' },
        { name: 'Workflow', value: 'workflow' },
        { name: 'Theme', value: 'theme' },
        { name: 'Policy', value: 'policy' },
        { name: 'Presentation', value: 'presentation' },
      ],
    });
    const target = await input({
      message: 'Target spec name:',
      validate: required,
    });
    const versionValue = await number({
      message: 'Target version (optional):',
      default: undefined,
    });
    overrides.push({
      type,
      target,
      version: typeof versionValue === 'number' ? versionValue : undefined,
    });

    addOverride = await confirm({
      message: 'Add another override?',
      default: false,
    });
  }
  return overrides;
}

async function collectAllocation(): Promise<ExperimentAllocationData> {
  const type = await select<ExperimentAllocationData['type']>({
    message: 'Allocation strategy:',
    choices: ALLOCATION_CHOICES,
    default: 'random',
  });

  switch (type) {
    case 'random': {
      const salt = await input({
        message: 'Salt (optional for deterministic hashing):',
        default: '',
      });
      return { type, salt: salt || undefined };
    }
    case 'sticky': {
      const attribute = await select<'userId' | 'organizationId' | 'sessionId'>(
        {
          message: 'Sticky attribute:',
          choices: [
            { name: 'User ID', value: 'userId' },
            { name: 'Organization ID', value: 'organizationId' },
            { name: 'Session ID', value: 'sessionId' },
          ],
          default: 'userId',
        }
      );
      const salt = await input({
        message: 'Salt (optional):',
        default: '',
      });
      return { type, attribute, salt: salt || undefined };
    }
    case 'targeted': {
      const rules = await collectTargetingRules();
      const fallback = await select<'control' | 'random'>({
        message: 'Fallback when no rule matches:',
        choices: [
          { name: 'Control', value: 'control' },
          { name: 'Random', value: 'random' },
        ],
        default: 'control',
      });
      const allocation: TargetedAllocationData = {
        type: 'targeted',
        rules,
        fallback,
      };
      return allocation;
    }
    default:
      return { type: 'random' };
  }
}

async function collectTargetingRules(): Promise<TargetingRuleData[]> {
  const rules: TargetingRuleData[] = [];
  let addRule = true;
  while (addRule || rules.length === 0) {
    const variantId = await input({
      message: 'Variant id for this rule:',
      validate: required,
    });
    const percentageValue = await number({
      message: 'Percentage of matching traffic (0-1, optional):',
      default: undefined,
    });
    const policyName = await input({
      message: 'Policy name (optional):',
      default: '',
    });
    let policyVersion: number | undefined;
    if (policyName.trim().length > 0) {
      const policyVersionValue = await number({
        message: 'Policy version (optional):',
        default: undefined,
      });
      policyVersion =
        typeof policyVersionValue === 'number' ? policyVersionValue : undefined;
    }
    const expression = await input({
      message:
        'Expression (optional, e.g., "context.attributes.segment === \'vip\'"):',
      default: '',
    });
    rules.push({
      variantId,
      percentage:
        typeof percentageValue === 'number' ? percentageValue : undefined,
      policy: policyName.trim()
        ? { name: policyName.trim(), version: policyVersion }
        : undefined,
      expression: expression || undefined,
    });
    addRule = await confirm({
      message: 'Add another targeting rule?',
      default: false,
    });
  }
  return rules;
}

async function collectMetrics(): Promise<ExperimentMetricData[] | undefined> {
  const metrics: ExperimentMetricData[] = [];
  let addMetric = await confirm({
    message: 'Add success metrics?',
    default: false,
  });
  while (addMetric) {
    const name = await input({
      message: 'Metric name:',
      validate: required,
    });
    const eventName = await input({
      message: 'Telemetry event name:',
      validate: required,
    });
    const eventVersionValue = await number({
      message: 'Telemetry event version:',
      default: 1,
      validate: positiveInt,
    });
    const aggregation = await select<ExperimentMetricData['aggregation']>({
      message: 'Aggregation:',
      choices: [
        { name: 'Count', value: 'count' },
        { name: 'Average', value: 'avg' },
        { name: 'p75', value: 'p75' },
        { name: 'p90', value: 'p90' },
        { name: 'p95', value: 'p95' },
        { name: 'p99', value: 'p99' },
      ],
      default: 'count',
    });
    const targetValue = await number({
      message: 'Target (optional):',
      default: undefined,
    });
    metrics.push({
      name,
      eventName,
      eventVersion: eventVersionValue ?? 1,
      aggregation,
      target: typeof targetValue === 'number' ? targetValue : undefined,
    });
    addMetric = await confirm({
      message: 'Add another metric?',
      default: false,
    });
  }
  return metrics.length > 0 ? metrics : undefined;
}

function required(value: string) {
  return value.trim().length > 0 || 'Value is required';
}

function positiveInt(value?: number) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return 'Must be a positive integer';
  }
  return true;
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
