import type { FormRegistry } from '../forms';
import type { SpecRegistry } from '../registry';
import type {
  Step,
  Transition,
  WorkflowDefinition,
  WorkflowSpec,
} from './spec';

export type WorkflowValidationLevel = 'error' | 'warning';

export interface WorkflowValidationIssue {
  level: WorkflowValidationLevel;
  message: string;
  context?: Record<string, unknown>;
}

export interface ValidateWorkflowSpecOptions {
  operations?: SpecRegistry;
  forms?: FormRegistry;
}

export class WorkflowValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: WorkflowValidationIssue[]
  ) {
    super(message);
    this.name = 'WorkflowValidationError';
  }
}

/**
 * Validate workflow structure, references, and reachability.
 * Returns the collected issues. Consumers may call {@link assertWorkflowSpecValid}
 * to throw on validation errors.
 */
export function validateWorkflowSpec(
  spec: WorkflowSpec,
  options: ValidateWorkflowSpecOptions = {}
): WorkflowValidationIssue[] {
  const issues: WorkflowValidationIssue[] = [];
  const { definition } = spec;

  if (!definition.steps.length) {
    issues.push({
      level: 'error',
      message: 'Workflow must declare at least one step.',
    });
    return issues;
  }

  const stepsById = indexSteps(definition, issues);
  const entryStepId = definition.entryStepId ?? definition.steps[0]?.id ?? null;

  if (!entryStepId) {
    issues.push({
      level: 'error',
      message: 'Workflow requires an entry step (definition.entryStepId).',
    });
  } else if (!stepsById.has(entryStepId)) {
    issues.push({
      level: 'error',
      message: `Entry step "${entryStepId}" is not defined in steps.`,
    });
  }

  const adjacency = buildAdjacency(definition, stepsById, issues);

  validateStepActions(definition.steps, options, issues);
  validateReachability(entryStepId, stepsById, adjacency, issues);
  detectCycles(adjacency, issues);

  return issues;
}

export function assertWorkflowSpecValid(
  spec: WorkflowSpec,
  options: ValidateWorkflowSpecOptions = {}
): void {
  const issues = validateWorkflowSpec(spec, options);
  const errors = issues.filter((issue) => issue.level === 'error');
  if (errors.length) {
    throw new WorkflowValidationError(
      `Workflow ${spec.meta.name}.v${spec.meta.version} is invalid`,
      issues
    );
  }
}

function indexSteps(
  definition: WorkflowDefinition,
  issues: WorkflowValidationIssue[]
) {
  const stepsById = new Map<string, Step>();
  for (const step of definition.steps) {
    if (stepsById.has(step.id)) {
      issues.push({
        level: 'error',
        message: `Duplicate step id "${step.id}" detected.`,
      });
      continue;
    }
    stepsById.set(step.id, step);
    if (step.type === 'automation' && !step.action?.operation) {
      issues.push({
        level: 'warning',
        message: `Automation step "${step.id}" does not declare an operation.`,
      });
    }
    if (step.type === 'human' && !step.action?.form) {
      issues.push({
        level: 'warning',
        message: `Human step "${step.id}" does not declare a form.`,
      });
    }
    if (step.guard && !step.guard.value.trim()) {
      issues.push({
        level: 'error',
        message: `Guard for step "${step.id}" must have a non-empty value.`,
      });
    }
  }
  return stepsById;
}

function buildAdjacency(
  definition: WorkflowDefinition,
  stepsById: Map<string, Step>,
  issues: WorkflowValidationIssue[]
) {
  const adjacency = new Map<string, Set<string>>();
  const incoming = new Map<string, number>();

  for (const stepId of stepsById.keys()) {
    adjacency.set(stepId, new Set());
    incoming.set(stepId, 0);
  }

  for (const transition of definition.transitions) {
    const from = stepsById.get(transition.from);
    const to = stepsById.get(transition.to);

    if (!from) {
      issues.push({
        level: 'error',
        message: `Transition refers to unknown "from" step "${transition.from}".`,
      });
      continue;
    }
    if (!to) {
      issues.push({
        level: 'error',
        message: `Transition refers to unknown "to" step "${transition.to}".`,
      });
      continue;
    }

    adjacency.get(transition.from)?.add(transition.to);
    incoming.set(transition.to, (incoming.get(transition.to) ?? 0) + 1);

    validateTransition(transition, issues);
  }

  const roots = [...incoming.entries()]
    .filter(([, count]) => count === 0)
    .map(([id]) => id);
  if (roots.length > 1) {
    issues.push({
      level: 'warning',
      message: `Workflow has multiple potential entry steps: ${roots.join(', ')}`,
    });
  }

  return adjacency;
}

function validateTransition(
  transition: Transition,
  issues: WorkflowValidationIssue[]
) {
  if (transition.condition && !transition.condition.trim()) {
    issues.push({
      level: 'error',
      message: `Transition ${transition.from} -> ${transition.to} declares an empty condition.`,
    });
  }
}

function validateStepActions(
  steps: Step[],
  options: ValidateWorkflowSpecOptions,
  issues: WorkflowValidationIssue[]
) {
  for (const step of steps) {
    const action = step.action;
    if (!action) continue;
    if (action.operation && options.operations) {
      const op = options.operations.getSpec(
        action.operation.name,
        action.operation.version
      );
      if (!op) {
        issues.push({
          level: 'error',
          message: `Step "${step.id}" references unknown operation ${action.operation.name}.v${action.operation.version}.`,
        });
      }
    }
    if (action.form && options.forms) {
      const form = options.forms.get(action.form.key, action.form.version);
      if (!form) {
        issues.push({
          level: 'error',
          message: `Step "${step.id}" references unknown form ${action.form.key}.v${action.form.version}.`,
        });
      }
    }
  }
}

function validateReachability(
  entryStepId: string | null,
  stepsById: Map<string, Step>,
  adjacency: Map<string, Set<string>>,
  issues: WorkflowValidationIssue[]
) {
  if (!entryStepId || !stepsById.has(entryStepId)) return;
  const visited = new Set<string>();
  const queue = [entryStepId];
  visited.add(entryStepId);

  while (queue.length) {
    const current = queue.shift();
    if (!current) continue;
    const neighbours = adjacency.get(current);
    if (!neighbours) continue;
    for (const next of neighbours) {
      if (visited.has(next)) continue;
      visited.add(next);
      queue.push(next);
    }
  }

  for (const stepId of stepsById.keys()) {
    if (!visited.has(stepId)) {
      issues.push({
        level: 'error',
        message: `Step "${stepId}" is unreachable from entry step "${entryStepId}".`,
      });
    }
  }
}

function detectCycles(
  adjacency: Map<string, Set<string>>,
  issues: WorkflowValidationIssue[]
) {
  const visited = new Set<string>();
  const stack = new Set<string>();
  let cycleReported = false;

  const dfs = (node: string) => {
    if (stack.has(node)) {
      if (!cycleReported) {
        issues.push({
          level: 'error',
          message: `Workflow contains a cycle involving step "${node}".`,
        });
        cycleReported = true;
      }
      return;
    }
    if (visited.has(node)) return;

    stack.add(node);
    const neighbours = adjacency.get(node);
    if (neighbours) {
      for (const next of neighbours) dfs(next);
    }
    stack.delete(node);
    visited.add(node);
  };

  for (const node of adjacency.keys()) dfs(node);
}
