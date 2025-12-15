import { input, select, number } from '@inquirer/prompts';
import type { EventSpecData, Stability } from '../../../types';

/**
 * Interactive wizard for creating event specs
 */
export async function eventWizard(
  defaults?: Partial<EventSpecData>
): Promise<EventSpecData> {
  const name = await input({
    message:
      'Event name (dot notation, past tense, e.g., "user.signup_completed"):',
    default: defaults?.name,
    validate: (input: string) => {
      if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*)+$/i.test(input)) {
        return 'Must be dot notation like "domain.event_name"';
      }
      return true;
    },
  });

  const version = await number({
    message: 'Version:',
    default: defaults?.version || 1,
    required: true,
    validate: (input: number) => {
      if (!Number.isInteger(input) || input < 1) {
        return 'Version must be a positive integer';
      }
      return true;
    },
  });

  const description = await input({
    message: 'Description (when this event is emitted):',
    default: defaults?.description,
    validate: (input: string) =>
      input.trim().length > 0 || 'Description is required',
  });

  const stability = (await select({
    message: 'Stability:',
    choices: [
      { value: 'experimental' },
      { value: 'beta' },
      { value: 'stable' },
      { value: 'deprecated' },
    ],
    default: defaults?.stability || 'beta',
  })) as Stability;

  const ownersInput = await input({
    message: 'Owners (comma-separated, e.g., "@team, @person"):',
    default: defaults?.owners?.join(', ') || '@team',
    validate: (input: string) => {
      const owners = input
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (owners.length === 0) return 'At least one owner is required';
      if (!owners.every((o) => o.startsWith('@'))) {
        return 'Owners must start with @';
      }
      return true;
    },
  });
  const owners = ownersInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const tagsInput = await input({
    message: 'Tags (comma-separated):',
    default: defaults?.tags?.join(', ') || '',
  });
  const tags = tagsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const piiFieldsInput = await input({
    message:
      'PII fields in payload (comma-separated paths, e.g., "email, name"):',
    default: defaults?.piiFields?.join(', ') || '',
  });
  const piiFields = piiFieldsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    name,
    version,
    description,
    stability,
    owners,
    tags,
    piiFields,
  };
}
