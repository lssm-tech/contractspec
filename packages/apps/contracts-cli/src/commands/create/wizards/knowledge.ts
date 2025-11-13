import { confirm, input, number, select } from '@inquirer/prompts';
import type {
  KnowledgeCategoryData,
  KnowledgeSpaceSpecData,
  KnowledgeTrustLevel,
  Stability,
} from '../../../types';

const STABILITY_CHOICES: { name: string; value: Stability }[] = [
  { name: 'Experimental', value: 'experimental' },
  { name: 'Beta', value: 'beta' },
  { name: 'Stable', value: 'stable' },
  { name: 'Deprecated', value: 'deprecated' },
];

const CATEGORY_CHOICES: { name: string; value: KnowledgeCategoryData }[] = [
  { name: 'Canonical (ground truth)', value: 'canonical' },
  { name: 'Operational (playbooks, runbooks)', value: 'operational' },
  { name: 'External (mirrored third-party docs)', value: 'external' },
  { name: 'Ephemeral (temporary context)', value: 'ephemeral' },
];

const TRUST_LEVEL_CHOICES: { name: string; value: KnowledgeTrustLevel }[] = [
  { name: 'High', value: 'high' },
  { name: 'Medium', value: 'medium' },
  { name: 'Low', value: 'low' },
];

const CATEGORY_DEFAULTS: Record<
  KnowledgeCategoryData,
  { trustLevel: KnowledgeTrustLevel; automationWritable: boolean }
> = {
  canonical: { trustLevel: 'high', automationWritable: false },
  operational: { trustLevel: 'medium', automationWritable: true },
  external: { trustLevel: 'low', automationWritable: false },
  ephemeral: { trustLevel: 'low', automationWritable: true },
};

export async function knowledgeWizard(
  defaults?: Partial<KnowledgeSpaceSpecData>
): Promise<KnowledgeSpaceSpecData> {
  const name = await input({
    message:
      'Knowledge space key (dot notation, e.g., "knowledge.product-canon"):',
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
    default: defaults?.domain ?? name.split('.')[0] ?? 'knowledge',
    validate: (value: string) =>
      value.trim().length > 0 || 'Domain is required',
  });

  const displayName = await input({
    message: 'Display name:',
    default: defaults?.displayName ?? toTitleCase(name.split('.').pop() ?? name),
    validate: (value: string) =>
      value.trim().length > 0 || 'Display name is required',
  });

  const title = await input({
    message: 'Title (internal title used in docs):',
    default: defaults?.title ?? `${displayName} Knowledge Space`,
    validate: (value: string) =>
      value.trim().length > 0 || 'Title is required',
  });

  const description = await input({
    message: 'Description (purpose of this knowledge space):',
    default: defaults?.description ?? '',
  });

  const category = await select<KnowledgeCategoryData>({
    message: 'Knowledge category:',
    choices: CATEGORY_CHOICES,
    default: defaults?.category ?? 'operational',
  });

  const stability = await select<Stability>({
    message: 'Stability:',
    choices: STABILITY_CHOICES,
    default: defaults?.stability ?? 'experimental',
  });

  const ownersInput = await input({
    message: 'Owners (comma-separated, e.g., "@team.knowledge"):',
    default: defaults?.owners?.join(', ') ?? '@team.knowledge',
    validate: validateOwners,
  });

  const tagsInput = await input({
    message: 'Tags (comma-separated, optional):',
    default: defaults?.tags?.join(', ') ?? '',
  });

  const ttlRaw = await input({
    message:
      'Retention TTL in days (leave blank for indefinite / inherit from category):',
    default:
      defaults?.retention?.ttlDays === null
        ? ''
        : defaults?.retention?.ttlDays != null
        ? String(defaults.retention.ttlDays)
        : category === 'canonical'
        ? ''
        : category === 'ephemeral'
        ? '7'
        : '',
  });

  const archiveAfterRaw = await input({
    message:
      'Archive after days of inactivity (optional, blank to skip):',
    default:
      defaults?.retention?.archiveAfterDays != null
        ? String(defaults.retention.archiveAfterDays)
        : '',
  });

  const defaultsForCategory = CATEGORY_DEFAULTS[category];
  let trustLevel = defaults?.trustLevel ?? defaultsForCategory.trustLevel;
  let automationWritable =
    defaults?.automationWritable ?? defaultsForCategory.automationWritable;

  if (category === 'canonical') {
    trustLevel = 'high';
    automationWritable = false;
  } else {
    trustLevel = await select<KnowledgeTrustLevel>({
      message: 'Trust level for workflow/agent consumption:',
      choices: TRUST_LEVEL_CHOICES,
      default: trustLevel,
    });

    automationWritable = await confirm({
      message: 'Allow automation to write/update this knowledge space?',
      default: automationWritable,
    });
  }

  const policyName = await input({
    message: 'Policy name for access control (optional):',
    default: defaults?.policyName ?? '',
  });

  const policyVersion =
    policyName.trim().length > 0
      ? parseOptionalNumber(
          (
            await input({
              message: 'Policy version (optional):',
              default:
                defaults?.policyVersion != null
                  ? String(defaults.policyVersion)
                  : '',
            })
          ).trim()
        )
      : undefined;

  const embeddingModel = await input({
    message: 'Embedding model identifier (optional):',
    default: defaults?.embeddingModel ?? '',
  });

  const chunkSizeRaw = await input({
    message: 'Chunk size (characters, optional):',
    default:
      defaults?.chunkSize != null ? String(defaults.chunkSize) : '800',
  });

  const vectorDbIntegration = await input({
    message: 'Vector DB integration key (optional):',
    default:
      defaults?.vectorDbIntegration ??
      (category === 'canonical' || category === 'operational'
        ? 'vectordb.qdrant'
        : ''),
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
    retention: {
      ttlDays: ttlRaw.trim().length === 0 ? null : parseOptionalNumber(ttlRaw),
      archiveAfterDays: parseOptionalNumber(archiveAfterRaw),
    },
    policyName: policyName.trim() || undefined,
    policyVersion,
    trustLevel,
    automationWritable,
    embeddingModel: embeddingModel.trim() || undefined,
    chunkSize: parseOptionalNumber(chunkSizeRaw),
    vectorDbIntegration:
      vectorDbIntegration.trim() || undefined,
  };
}

function validateDotNotation(value: string): true | string {
  return /^[a-z][a-z0-9]*(\.[a-z][a-z0-9_-]*)+$/i.test(value)
    ? true
    : 'Use dot notation like "knowledge.product-canon"';
}

function positiveInt(value: number): true | string {
  return Number.isInteger(value) && value > 0
    ? true
    : 'Version must be a positive integer';
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

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toTitleCase(value: string): string {
  return value
    .split(/[-_.\s]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

