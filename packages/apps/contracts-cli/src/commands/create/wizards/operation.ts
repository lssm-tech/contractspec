import { confirm, input, number, select } from '@inquirer/prompts';
import type { OperationSpecData } from '../../../types';

/**
 * Interactive wizard for creating operation specs
 */
export async function operationWizard(
  defaults?: Partial<OperationSpecData>
): Promise<OperationSpecData> {
  // Use type assertion to work around inquirer v12's stricter types
  const kind = await select({
    message: 'Operation kind:',
    choices: [
      {
        name: 'Command (changes state, has side effects)',
        value: 'command' as const,
      },
      { name: 'Query (read-only, idempotent)', value: 'query' as const },
    ],
    default: defaults?.kind || 'command',
  });
  const name = await input({
    message: 'Operation name (dot notation, e.g., "user.signup"):',
    default: defaults?.name,
    validate: (input: string) => {
      if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*)+$/i.test(input)) {
        return 'Must be dot notation like "domain.operation"';
      }
      return true;
    },
  });
  const version = await number({
    message: 'Version:',
    required: true,
    default: defaults?.version || 1,
    validate: (input: number) => {
      if (!Number.isInteger(input) || input < 1) {
        return 'Version must be a positive integer';
      }
      return true;
    },
  });

  const description = await input({
    message: 'Short description (1-2 sentences):',
    default: defaults?.description,
    validate: (input: string) =>
      input.trim().length > 0 || 'Description is required',
  });

  const goal = await input({
    message: 'Business goal (why this operation exists):',
    default: defaults?.goal,
    validate: (input: string) => input.trim().length > 0 || 'Goal is required',
  });

  const context = await input({
    message: "Context (background, constraints, what it does/doesn't do):",
    default: defaults?.context,
    validate: (input: string) =>
      input.trim().length > 0 || 'Context is required',
  });

  const stability = await select<
    'experimental' | 'beta' | 'stable' | 'deprecated'
  >({
    message: 'Stability:',
    choices: ['experimental', 'beta', 'stable', 'deprecated'],
    // default: defaults?.stability || 'beta',
  });

  const owners = await input({
    message: 'Owners (comma-separated, e.g., "@team, @person"):',
    default: defaults?.owners?.join(', ') || '@team',
    // transformer: (input: string) => input.split(',').map((s) => s.trim()).filter(Boolean),
    validate: (input: string) => {
      if (input.length === 0) return 'At least one owner is required';
      const owners = input
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (!owners.every((o) => o.startsWith('@'))) {
        return 'Owners must start with @';
      }
      return true;
    },
  });

  const tags = await input({
    message: 'Tags (comma-separated, e.g., "auth, signup"):',
    default: defaults?.tags?.join(', ') || '',
    // filter: (input: string) => input.split(',').map((s) => s.trim()).filter(Boolean),
  });

  const auth = await select({
    message: 'Required authentication:',
    choices: [
      { name: 'Anonymous (no auth required)', value: 'anonymous' as const },
      { name: 'User (authenticated user)', value: 'user' as const },
      { name: 'Admin (admin privileges)', value: 'admin' as const },
    ],
    default: defaults?.auth || 'user',
  });

  const hasInput = await confirm({
    message: 'Does this operation have input parameters?',
    default: defaults?.hasInput ?? true,
  });
  const hasOutput = await confirm({
    message: 'Does this operation return data?',
    default: defaults?.hasOutput ?? true,
  });

  const flags = await input({
    message: 'Feature flags (comma-separated, optional):',
    default: defaults?.flags?.join(', ') || '',
    // filter: (input: string) => input.split(',').map((s) => s.trim()).filter(Boolean),
  });

  const emitsEvents = await confirm({
    message: 'Does this operation emit events?',
    default: defaults?.emitsEvents ?? false,
  });

  return {
    kind,
    name,
    version,
    description,
    goal,
    context,
    stability,
    owners: owners
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    tags: tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    auth: auth,
    hasInput: hasInput,
    hasOutput: hasOutput,
    flags: flags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    emitsEvents: emitsEvents,
  };
}
