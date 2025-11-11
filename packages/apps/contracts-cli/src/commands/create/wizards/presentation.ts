import inquirer from 'inquirer';
import type { PresentationSpecData, PresentationKind, Stability } from '../../../types.js';

/**
 * Interactive wizard for creating presentation specs
 */
export async function presentationWizard(defaults?: Partial<PresentationSpecData>): Promise<PresentationSpecData> {
  // Use type assertion to work around inquirer v12's stricter types
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'presentationKind',
      message: 'Presentation kind:',
      choices: [
        { name: 'Web Component (React)', value: 'web_component' },
        { name: 'Markdown/MDX (documentation)', value: 'markdown' },
        { name: 'Data (JSON/XML export)', value: 'data' },
      ],
      default: defaults?.presentationKind || 'web_component',
    },
    {
      type: 'input',
      name: 'name',
      message: 'Presentation name (dot notation, e.g., "user.profile_card"):',
      default: defaults?.name,
      validate: (input: string) => {
        if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*)+$/i.test(input)) {
          return 'Must be dot notation like "domain.presentation_name"';
        }
        return true;
      },
    },
    {
      type: 'number',
      name: 'version',
      message: 'Version:',
      default: defaults?.version || 1,
      validate: (input: number) => {
        if (!Number.isInteger(input) || input < 1) {
          return 'Version must be a positive integer';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description (what this presentation shows/provides):',
      default: defaults?.description,
      validate: (input: string) => input.trim().length > 0 || 'Description is required',
    },
    {
      type: 'list',
      name: 'stability',
      message: 'Stability:',
      choices: ['experimental', 'beta', 'stable', 'deprecated'],
      default: defaults?.stability || 'beta',
    },
    {
      type: 'input',
      name: 'owners',
      message: 'Owners (comma-separated):',
      default: defaults?.owners?.join(', ') || '@team',
      filter: (input: string) => input.split(',').map((s) => s.trim()).filter(Boolean),
      validate: (input: string[]) => {
        if (input.length === 0) return 'At least one owner is required';
        if (!input.every((o) => o.startsWith('@'))) {
          return 'Owners must start with @';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'tags',
      message: 'Tags (comma-separated):',
      default: defaults?.tags?.join(', ') || '',
      filter: (input: string) => input.split(',').map((s) => s.trim()).filter(Boolean),
    },
  ] as any);

  return {
    presentationKind: answers.presentationKind as PresentationKind,
    name: answers.name,
    version: answers.version,
    description: answers.description,
    stability: answers.stability as Stability,
    owners: answers.owners,
    tags: answers.tags,
  };
}

