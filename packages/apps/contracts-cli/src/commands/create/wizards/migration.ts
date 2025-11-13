import { confirm, input, number, select } from '@inquirer/prompts';
import type {
  MigrationSpecData,
  MigrationStepData,
  MigrationStepKind,
  Stability,
} from '../../../types';

const STEP_KIND_CHOICES: { name: string; value: MigrationStepKind }[] = [
  { name: 'Schema (SQL)', value: 'schema' },
  { name: 'Data script', value: 'data' },
  { name: 'Validation / assertion', value: 'validation' },
];

const STABILITY_CHOICES: { name: string; value: Stability }[] = [
  { name: 'Experimental', value: 'experimental' },
  { name: 'Beta', value: 'beta' },
  { name: 'Stable', value: 'stable' },
  { name: 'Deprecated', value: 'deprecated' },
];

export async function migrationWizard(
  defaults?: Partial<MigrationSpecData>
): Promise<MigrationSpecData> {
  const name = await input({
    message: 'Migration name (e.g., "core.db.2025_01_add_users"):',
    default: defaults?.name,
    validate: (value: string) =>
      value.trim().length > 0 || 'Migration name is required',
  });

  const versionInput = await number({
    message: 'Version:',
    default: defaults?.version ?? 1,
    validate: (value?: number) =>
      typeof value === 'number' && Number.isInteger(value) && value > 0
        ? true
        : 'Version must be a positive integer',
  });
  const version = typeof versionInput === 'number' ? versionInput : 1;

  const title = await input({
    message: 'Title (human friendly):',
    default: defaults?.title ?? toTitleCase(name),
    validate: required,
  });

  const description = await input({
    message: 'Description (1-2 sentences):',
    default: defaults?.description ?? '',
  });

  const domain = await input({
    message: 'Domain / bounded context:',
    default: defaults?.domain ?? name.split('.')[0] ?? 'core',
    validate: required,
  });

  const stability = await select<Stability>({
    message: 'Stability:',
    choices: STABILITY_CHOICES,
    default: defaults?.stability ?? 'experimental',
  });

  const ownersInput = await input({
    message: 'Owners (comma-separated, e.g., "@team, @person"):',
    default: defaults?.owners?.join(', ') ?? '@team',
    validate: validateOwners,
  });

  const tagsInput = await input({
    message: 'Tags (comma-separated, optional):',
    default: defaults?.tags?.join(', ') ?? '',
  });

  const dependenciesInput = await input({
    message: 'Dependencies (comma-separated migration keys, optional):',
    default: (defaults?.dependencies ?? []).join(', '),
  });

  const upSteps = await collectSteps('Add an up step?', defaults?.up ?? [], true);

  let downSteps: MigrationStepData[] | undefined = defaults?.down;
  const needDown = await confirm({
    message: 'Add rollback (down) steps?',
    default: (defaults?.down?.length ?? 0) > 0,
  });
  if (needDown) {
    downSteps = await collectSteps('Add a down step?', defaults?.down ?? [], false);
  } else {
    downSteps = undefined;
  }

  return {
    name,
    version,
    title,
    description,
    domain,
    stability,
    owners: splitList(ownersInput),
    tags: splitList(tagsInput),
    dependencies: splitList(dependenciesInput),
    up: upSteps,
    down: downSteps,
  };
}

async function collectSteps(
  message: string,
  defaults: MigrationStepData[],
  requireAtLeastOne: boolean
): Promise<MigrationStepData[]> {
  const steps: MigrationStepData[] = [];
  let addAnother = true;
  let index = 0;

  while (addAnother || (requireAtLeastOne && steps.length === 0)) {
    const def = defaults[index];
    const kind = await select<MigrationStepKind>({
      message: 'Step kind:',
      choices: STEP_KIND_CHOICES,
      default: def?.kind ?? 'schema',
    });
    const description = await input({
      message: 'Step description:',
      default: def?.description ?? '',
    });

    const trimmedDescription = description.trim();
    let step: MigrationStepData = trimmedDescription
      ? { kind, description: trimmedDescription }
      : { kind };
    switch (kind) {
      case 'schema': {
        const sql = await input({
          message: 'SQL to execute:',
          default: def?.sql ?? '',
          validate: required,
        });
        step = { ...step, sql };
        break;
      }
      case 'data': {
        const script = await input({
          message: 'Script body or reference (file path, command, etc.):',
          default: def?.script ?? '',
          validate: required,
        });
        step = { ...step, script };
        break;
      }
      case 'validation': {
        const assertion = await input({
          message: 'Assertion expression/SQL (should return truthy):',
          default: def?.assertion ?? '',
          validate: required,
        });
        step = { ...step, assertion };
        break;
      }
    }
    steps.push(step);

    addAnother = await confirm({
      message,
      default: requireAtLeastOne ? steps.length < 2 : false,
    });
    index += 1;
  }

  return steps;
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toTitleCase(value: string): string {
  return value
    .split(/[-_.\s]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function required(value: string) {
  return value.trim().length > 0 || 'Value is required';
}

function validateOwners(value: string) {
  const owners = splitList(value);
  if (owners.length === 0) return 'At least one owner is required';
  if (!owners.every((owner) => owner.startsWith('@'))) {
    return 'Owners must start with @ (e.g., "@team")';
  }
  return true;
}

