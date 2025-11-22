import { confirm, input, number, select } from '@inquirer/prompts';
import type {
  WorkflowSpecData,
  WorkflowStepData,
  StepType,
  WorkflowTransitionData,
} from '../../../types';

const DOT_PATH_REGEX = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*)+$/i;

export async function workflowWizard(
  defaults?: Partial<WorkflowSpecData>
): Promise<WorkflowSpecData> {
  const name = await input({
    message: 'Workflow name (dot notation, e.g., "sigil.onboarding.basic"):',
    default: defaults?.name,
    validate: validateDotPath,
  });

  const title = await input({
    message: 'Human-friendly title:',
    default: defaults?.title ?? toTitle(name),
    validate: required,
  });

  const version = await number({
    message: 'Version:',
    required: true,
    default: defaults?.version ?? 1,
    validate: validatePositiveInteger,
  });

  const description = await input({
    message: 'Short description:',
    default: defaults?.description,
    validate: required,
  });

  const domain = await input({
    message: 'Domain / bounded context:',
    default: defaults?.domain ?? name.split('.')[0] ?? 'core',
    validate: required,
  });

  const stability = await select<
    'experimental' | 'beta' | 'stable' | 'deprecated'
  >({
    message: 'Stability:',
    choices: ['experimental', 'beta', 'stable', 'deprecated'],
    default: defaults?.stability ?? 'experimental',
  });

  const ownersInput = await input({
    message: 'Owners (comma-separated, e.g., "@team, @person"):',
    default: defaults?.owners?.join(', ') || '@team',
    validate: validateOwners,
  });

  const tagsInput = await input({
    message: 'Tags (comma-separated):',
    default: defaults?.tags?.join(', ') || '',
  });

  const steps = await collectSteps(defaults?.steps);

  const entryStepId = await input({
    message: 'Entry step ID:',
    default: defaults?.entryStepId ?? steps[0]?.id,
    validate: (value: string) => {
      if (!value) return 'Entry step is required';
      if (!steps.some((step) => step.id === value)) {
        return `Step "${value}" not found.`;
      }
      return true;
    },
  });

  const sequentialTransitions = buildSequentialTransitions(steps);
  let transitions: WorkflowTransitionData[] = [...sequentialTransitions];

  const addMoreTransitions = await confirm({
    message: 'Add additional transitions?',
    default: false,
  });

  if (addMoreTransitions) {
    transitions = await extendTransitions(transitions, steps);
  }

  const policyFlagsInput = await input({
    message: 'Policy flags (comma-separated, optional):',
    default: defaults?.policyFlags?.join(', ') || '',
  });

  return {
    name,
    title,
    version,
    description,
    domain,
    stability,
    owners: splitList(ownersInput),
    tags: splitList(tagsInput),
    steps,
    entryStepId,
    transitions,
    policyFlags: splitList(policyFlagsInput),
  };
}

async function collectSteps(
  defaults?: WorkflowStepData[]
): Promise<WorkflowStepData[]> {
  const steps: WorkflowStepData[] = [];
  const existingIds = new Set<string>();

  let addMore = true;
  let defaultIndex = 0;

  while (addMore || steps.length === 0) {
    const defaultStep = defaults?.[defaultIndex];

    const id = await input({
      message: 'Step ID (slug, e.g., "start" or "review"):',
      default: defaultStep?.id ?? (steps.length === 0 ? 'start' : ''),
      validate: (value: string) => {
        if (!value.trim()) return 'Step ID is required';
        if (existingIds.has(value)) return 'Step ID must be unique';
        return true;
      },
    });

    const label = await input({
      message: 'Step label (display name):',
      default: defaultStep?.label ?? toTitle(id),
      validate: required,
    });

    const type = await select<StepType>({
      message: 'Step type:',
      choices: [
        { name: 'Automation (operation)', value: 'automation' as const },
        { name: 'Human (form)', value: 'human' as const },
        { name: 'Decision (branching)', value: 'decision' as const },
      ],
      default: defaultStep?.type ?? 'automation',
    });

    const description = await input({
      message: 'Step description (optional):',
      default: defaultStep?.description ?? '',
    });

    const step: WorkflowStepData = {
      id,
      label,
      type,
      description: description.trim() || undefined,
    };

    if (type === 'automation') {
      const operationName = await input({
        message: 'Operation name (dot notation):',
        default: defaultStep?.operation?.name,
        validate: (value: string) =>
          value.trim().length === 0 || validateDotPath(value),
      });
      if (operationName.trim()) {
        const operationVersion = await number({
          message: 'Operation version:',
          default: defaultStep?.operation?.version ?? 1,
          validate: validatePositiveInteger,
          required: true,
        });
        step.operation = {
          name: operationName,
          version: operationVersion,
        };
      }
    }

    if (type === 'human') {
      const formKey = await input({
        message: 'Form key:',
        default: defaultStep?.form?.key,
        validate: (value: string) => value.trim().length > 0 || true,
      });
      if (formKey.trim()) {
        const formVersion = await number({
          message: 'Form version:',
          default: defaultStep?.form?.version ?? 1,
          validate: validatePositiveInteger,
          required: true,
        });
        step.form = { key: formKey, version: formVersion };
      }
    }

    steps.push(step);
    existingIds.add(id);
    defaultIndex += 1;

    addMore = await confirm({
      message: 'Add another step?',
      default: steps.length < 3,
    });
  }

  return steps;
}

function buildSequentialTransitions(
  steps: WorkflowStepData[]
): WorkflowTransitionData[] {
  const transitions: WorkflowTransitionData[] = [];
  for (let i = 0; i < steps.length - 1; i++) {
    transitions.push({
      from: steps[i]!.id,
      to: steps[i + 1]!.id,
    });
  }
  return transitions;
}

async function extendTransitions(
  existing: WorkflowTransitionData[],
  steps: WorkflowStepData[]
) {
  const transitions = [...existing];
  let addAnother = true;
  while (addAnother) {
    const from = await select<string>({
      message: 'Transition from step:',
      choices: steps.map((step) => ({ name: step.label, value: step.id })),
    });
    const to = await select<string>({
      message: 'Transition to step:',
      choices: steps
        .filter((step) => step.id !== from)
        .map((step) => ({ name: step.label, value: step.id })),
    });
    const condition = await input({
      message: 'Condition (expression, optional):',
      default: '',
    });
    transitions.push({
      from,
      to,
      condition: condition.trim() || undefined,
    });
    addAnother = await confirm({
      message: 'Add another transition?',
      default: false,
    });
  }
  return transitions;
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function required(value: string) {
  return value.trim().length > 0 || 'This field is required';
}

function validateDotPath(value: string) {
  if (!value.trim()) return 'Value is required';
  if (!DOT_PATH_REGEX.test(value)) {
    return 'Must be dot notation like "domain.module.item"';
  }
  return true;
}

function validatePositiveInteger(value: number) {
  if (!value) return 'Value is required';
  if (!Number.isInteger(value) || value < 1) {
    return 'Must be a positive integer';
  }
  return true;
}

function validateOwners(value: string) {
  if (!value.trim()) return 'At least one owner is required';
  const owners = splitList(value);
  if (!owners.every((o) => o.startsWith('@'))) {
    return 'Owners must start with @';
  }
  return true;
}

function toTitle(input: string) {
  return input
    .split(/[-_.]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
