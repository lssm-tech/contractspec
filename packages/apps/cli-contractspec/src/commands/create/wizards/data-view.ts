import { confirm, input, number, select } from '@inquirer/prompts';
import type {
  DataViewFieldData,
  DataViewKind,
  DataViewSpecData,
  Stability,
} from '../../../types';

const KIND_CHOICES: { name: string; value: DataViewKind }[] = [
  { name: 'List', value: 'list' },
  { name: 'Table', value: 'table' },
  { name: 'Detail', value: 'detail' },
  { name: 'Grid', value: 'grid' },
];

const FORMAT_CHOICES = [
  { name: 'Text (default)', value: 'text' },
  { name: 'Number', value: 'number' },
  { name: 'Currency', value: 'currency' },
  { name: 'Percentage', value: 'percentage' },
  { name: 'Date', value: 'date' },
  { name: 'Date & Time', value: 'dateTime' },
  { name: 'Boolean', value: 'boolean' },
];

const STABILITY_CHOICES: { name: string; value: Stability }[] = [
  { name: 'Experimental', value: 'experimental' },
  { name: 'Beta', value: 'beta' },
  { name: 'Stable', value: 'stable' },
  { name: 'Deprecated', value: 'deprecated' },
];

export async function dataViewWizard(
  defaults?: Partial<DataViewSpecData>
): Promise<DataViewSpecData> {
  const name = await input({
    message: 'Data view name (dot notation, e.g., "residents.admin.list"):',
    default: defaults?.name,
    validate: (value: string) =>
      /^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*)+$/i.test(value) ||
      'Must use dot notation like "domain.module.key"',
  });

  const version = await number({
    message: 'Version:',
    default: defaults?.version ? Number(defaults.version) : 1,
    required: true,
    validate: (value: number) =>
      Number.isInteger(value) && value > 0
        ? true
        : 'Version must be a positive integer',
  });

  const entity = await input({
    message: 'Entity (e.g., "resident", "space"):',
    default: defaults?.entity,
    validate: (value: string) =>
      value.trim().length > 0 || 'Entity is required',
  });

  const kind = await select<DataViewKind>({
    message: 'View kind:',
    choices: KIND_CHOICES,
    default: defaults?.kind ?? 'table',
  });

  const title = await input({
    message: 'Title (human label):',
    default: defaults?.title ?? toTitleCase(name),
    validate: (value: string) => value.trim().length > 0 || 'Title is required',
  });

  const description = await input({
    message: 'Description (1–2 sentences):',
    default: defaults?.description ?? '',
  });

  const domain = await input({
    message: 'Domain / bounded context:',
    default: defaults?.domain ?? name.split('.')[0] ?? entity,
    validate: (value: string) =>
      value.trim().length > 0 || 'Domain is required',
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

  const primaryOperationName = await input({
    message:
      'Primary query operation name (dot notation, e.g., "residents.list"):',
    default: defaults?.primaryOperation?.name,
    validate: (value: string) =>
      /^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*)+$/i.test(value) ||
      'Must use dot notation',
  });

  const primaryOperationVersion = await number({
    message: 'Primary query operation version:',
    default: defaults?.primaryOperation?.version ?? 1,
    required: true,
    validate: positiveInt,
  });

  let itemOperation: { name: string; version: number } | undefined =
    defaults?.itemOperation;

  if (kind === 'detail') {
    const needsItemOperation = await confirm({
      message:
        'Add a dedicated item fetch operation (recommended for detail views)?',
      default: Boolean(defaults?.itemOperation),
    });
    if (needsItemOperation) {
      const itemName = await input({
        message:
          'Item query operation name (dot notation, e.g., "residents.getById"):',
        default: defaults?.itemOperation?.name,
        validate: (value: string) =>
          /^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*)+$/i.test(value) ||
          'Must use dot notation',
      });
      const itemVersion = await number({
        message: 'Item query operation version:',
        default: defaults?.itemOperation?.version ?? 1,
        required: true,
        validate: positiveInt,
      });
      itemOperation = { name: itemName, version: itemVersion };
    }
  }

  const fields = await collectFields(defaults?.fields);

  const primaryField = await input({
    message:
      'Primary field key (leave blank to use the first field defined above):',
    default: defaults?.primaryField,
  });

  const secondaryFields = await input({
    message:
      'Secondary field keys (comma-separated, optional for list/detail views):',
    default: defaults?.secondaryFields?.join(', ') ?? '',
  });

  return {
    entity,
    name,
    version: String(version),
    title,
    description,
    domain,
    owners: splitList(ownersInput),
    tags: splitList(tagsInput),
    stability,
    kind,
    primaryOperation: {
      name: primaryOperationName,
      version: primaryOperationVersion,
    },
    itemOperation,
    fields,
    primaryField: primaryField.trim() || undefined,
    secondaryFields: splitList(secondaryFields),
  };
}

async function collectFields(
  defaults?: DataViewFieldData[]
): Promise<DataViewFieldData[]> {
  const fields: DataViewFieldData[] = [];
  let addAnother = true;
  let index = 0;

  while (addAnother || fields.length === 0) {
    const def = defaults?.[index];
    const key = await input({
      message: 'Field key (identifier, e.g., "fullName"):',
      default: def?.key ?? (fields.length === 0 ? 'name' : ''),
      validate: (value: string) =>
        value.trim().length > 0 || 'Field key is required',
    });

    const label = await input({
      message: 'Field label (display name):',
      default: def?.label ?? toTitleCase(key),
      validate: (value: string) =>
        value.trim().length > 0 || 'Field label is required',
    });

    const dataPath = await input({
      message: 'Dot-path in the record (e.g., "address.city"):',
      default: def?.dataPath ?? key,
      validate: (value: string) =>
        value.trim().length > 0 || 'Data path is required',
    });

    const format = await select({
      message: 'Formatting hint:',
      choices: FORMAT_CHOICES,
      default: def?.format ?? 'text',
    });

    const sortable = await confirm({
      message: 'Make this field sortable?',
      default: def?.sortable ?? false,
    });

    const filterable = await confirm({
      message: 'Make this field filterable?',
      default: def?.filterable ?? false,
    });

    fields.push({
      key,
      label,
      dataPath,
      format,
      sortable,
      filterable,
    });

    addAnother = await confirm({
      message: 'Add another field?',
      default: fields.length < 3,
    });
    index += 1;
  }

  return fields;
}

function positiveInt(value: number) {
  return Number.isInteger(value) && value > 0
    ? true
    : 'Must be a positive integer';
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toTitleCase(value: string): string {
  return value
    .split(/[-_.\s]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function validateOwners(value: string) {
  const owners = splitList(value);
  if (owners.length === 0) return 'At least one owner is required';
  if (!owners.every((owner) => owner.startsWith('@'))) {
    return 'Owners must start with @ (e.g., "@team")';
  }
  return true;
}
