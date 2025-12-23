import { input, select, number } from '@inquirer/prompts';
import type {
  PresentationKind,
  PresentationSpecData,
  Stability,
} from '../../../types';

/**
 * Interactive wizard for creating presentation specs
 */
export async function presentationWizard(
  defaults?: Partial<PresentationSpecData>
): Promise<PresentationSpecData> {
  const presentationKind = (await select({
    message: 'Presentation kind:',
    choices: [
      { name: 'Web Component (React)', value: 'web_component' },
      { name: 'Markdown/MDX (documentation)', value: 'markdown' },
      { name: 'Data (JSON/XML export)', value: 'data' },
    ],
    default: defaults?.presentationKind || 'web_component',
  })) as PresentationKind;

  const name = await input({
    message: 'Presentation name (dot notation, e.g., "user.profile_card"):',
    default: defaults?.name,
    validate: (input: string) => {
      if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*)+$/i.test(input)) {
        return 'Must be dot notation like "domain.presentation_name"';
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
    message: 'Description (what this presentation shows/provides):',
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
    message: 'Owners (comma-separated):',
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

  return {
    presentationKind,
    name,
    version,
    description,
    stability,
    owners,
    tags,
  };
}
