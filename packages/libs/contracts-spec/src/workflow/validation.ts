import type { FormRegistry } from '../forms';
import type { OperationSpecRegistry } from '../operations/registry';
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
  operations?: OperationSpecRegistry;
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
      `Workflow ${spec.meta.key}.v${spec.meta.version} is invalid`,
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
      const op = options.operations.get(
        action.operation.key,
        action.operation.version
      );
      if (!op) {
        issues.push({
          level: 'error',
          message: `Step "${step.id}" references unknown operation ${action.operation.key}.v${action.operation.version}.`,
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

// ─────────────────────────────────────────────────────────────────────────────
// Cross-Registry Validation
// ─────────────────────────────────────────────────────────────────────────────

import type { WorkflowRegistry } from './spec';
import type { EventRegistry } from '../events';
import type { CapabilityRegistry } from '../capabilities/capabilities';

export interface WorkflowConsistencyDeps {
  workflows: WorkflowRegistry;
  operations?: OperationSpecRegistry;
  forms?: FormRegistry;
  events?: EventRegistry;
  capabilities?: CapabilityRegistry;
}

export interface WorkflowValidationResult {
  valid: boolean;
  issues: WorkflowValidationIssue[];
}

/**
 * Validate workflow consistency across registries.
 *
 * Checks that:
 * - All workflow specs are internally valid
 * - Operations referenced by steps exist
 * - Forms referenced by steps exist
 * - Capabilities required by steps exist
 *
 * @param deps - Registry dependencies
 * @returns Validation result
 */
export function validateWorkflowConsistency(
  deps: WorkflowConsistencyDeps
): WorkflowValidationResult {
  const issues: WorkflowValidationIssue[] = [];

  // Validate each workflow spec
  for (const workflow of deps.workflows.list()) {
    const specOptions: ValidateWorkflowSpecOptions = {
      operations: deps.operations,
      forms: deps.forms,
    };
    const specIssues = validateWorkflowSpec(workflow, specOptions);
    issues.push(
      ...specIssues.map((i) => ({
        ...i,
        message: `[${workflow.meta.key}.v${workflow.meta.version}] ${i.message}`,
      }))
    );

    // Validate capability references
    if (deps.capabilities) {
      for (const step of workflow.definition.steps) {
        for (const capRef of step.requiredCapabilities ?? []) {
          const cap = deps.capabilities.get(capRef.key, capRef.version);
          if (!cap) {
            issues.push({
              level: 'error',
              message: `[${workflow.meta.key}.v${workflow.meta.version}] Step "${step.id}" references unknown capability "${capRef.key}.v${capRef.version}"`,
              context: { stepId: step.id, capability: capRef },
            });
          }
        }
      }
    }

    // Validate compensation operations
    if (workflow.definition.compensation && deps.operations) {
      for (const compStep of workflow.definition.compensation.steps) {
        const op = deps.operations.get(
          compStep.operation.key,
          compStep.operation.version
        );
        if (!op) {
          issues.push({
            level: 'error',
            message: `[${workflow.meta.key}.v${workflow.meta.version}] Compensation for step "${compStep.stepId}" references unknown operation "${compStep.operation.key}.v${compStep.operation.version}"`,
            context: { stepId: compStep.stepId, operation: compStep.operation },
          });
        }
      }
    }

    // Validate SLA step references
    if (workflow.definition.sla?.stepDurationMs) {
      const stepIds = new Set(workflow.definition.steps.map((s) => s.id));
      for (const stepId of Object.keys(
        workflow.definition.sla.stepDurationMs
      )) {
        if (!stepIds.has(stepId)) {
          issues.push({
            level: 'warning',
            message: `[${workflow.meta.key}.v${workflow.meta.version}] SLA references unknown step "${stepId}"`,
            context: { stepId },
          });
        }
      }
    }
  }

  return {
    valid: issues.filter((i) => i.level === 'error').length === 0,
    issues,
  };
}

/**
 * Assert workflow consistency across registries.
 *
 * @param deps - Registry dependencies
 * @throws {WorkflowValidationError} If validation fails
 */
export function assertWorkflowConsistency(deps: WorkflowConsistencyDeps): void {
  const result = validateWorkflowConsistency(deps);
  if (!result.valid) {
    throw new WorkflowValidationError(
      'Workflow consistency check failed',
      result.issues
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Additional Validation Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate SLA configuration is reasonable.
 *
 * @param spec - Workflow spec to validate
 * @returns Array of validation issues
 */
export function validateSlaConfig(
  spec: WorkflowSpec
): WorkflowValidationIssue[] {
  const issues: WorkflowValidationIssue[] = [];
  const sla = spec.definition.sla;
  if (!sla) return issues;

  // Check total duration is positive
  if (sla.totalDurationMs !== undefined && sla.totalDurationMs <= 0) {
    issues.push({
      level: 'error',
      message: 'SLA totalDurationMs must be positive',
      context: { totalDurationMs: sla.totalDurationMs },
    });
  }

  // Check step durations are positive
  if (sla.stepDurationMs) {
    for (const [stepId, duration] of Object.entries(sla.stepDurationMs)) {
      if (duration <= 0) {
        issues.push({
          level: 'error',
          message: `SLA stepDurationMs for "${stepId}" must be positive`,
          context: { stepId, duration },
        });
      }
    }

    // Warn if total duration is less than sum of step durations
    const stepDurationsSum = Object.values(sla.stepDurationMs).reduce(
      (sum, d) => sum + d,
      0
    );
    if (sla.totalDurationMs && stepDurationsSum > sla.totalDurationMs) {
      issues.push({
        level: 'warning',
        message: `Sum of step durations (${stepDurationsSum}ms) exceeds total duration (${sla.totalDurationMs}ms)`,
        context: { stepDurationsSum, totalDurationMs: sla.totalDurationMs },
      });
    }
  }

  return issues;
}

/**
 * Validate compensation configuration.
 *
 * @param spec - Workflow spec to validate
 * @returns Array of validation issues
 */
export function validateCompensation(
  spec: WorkflowSpec
): WorkflowValidationIssue[] {
  const issues: WorkflowValidationIssue[] = [];
  const compensation = spec.definition.compensation;
  if (!compensation) return issues;

  const stepIds = new Set(spec.definition.steps.map((s) => s.id));
  const coveredSteps = new Set<string>();

  for (const compStep of compensation.steps) {
    // Check step exists
    if (!stepIds.has(compStep.stepId)) {
      issues.push({
        level: 'error',
        message: `Compensation references unknown step "${compStep.stepId}"`,
        context: { stepId: compStep.stepId },
      });
    }

    // Check for duplicate compensation
    if (coveredSteps.has(compStep.stepId)) {
      issues.push({
        level: 'warning',
        message: `Multiple compensation handlers for step "${compStep.stepId}"`,
        context: { stepId: compStep.stepId },
      });
    }
    coveredSteps.add(compStep.stepId);

    // Check operation reference
    if (!compStep.operation?.key || !compStep.operation?.version) {
      issues.push({
        level: 'error',
        message: `Compensation for step "${compStep.stepId}" must specify operation with key and version`,
        context: { stepId: compStep.stepId },
      });
    }
  }

  // Warn about automation steps without compensation
  const automationSteps = spec.definition.steps.filter(
    (s) => s.type === 'automation'
  );
  for (const step of automationSteps) {
    if (!coveredSteps.has(step.id)) {
      issues.push({
        level: 'warning',
        message: `Automation step "${step.id}" has no compensation handler`,
        context: { stepId: step.id },
      });
    }
  }

  return issues;
}

/**
 * Validate retry configuration.
 *
 * @param spec - Workflow spec to validate
 * @returns Array of validation issues
 */
export function validateRetryConfig(
  spec: WorkflowSpec
): WorkflowValidationIssue[] {
  const issues: WorkflowValidationIssue[] = [];

  for (const step of spec.definition.steps) {
    if (!step.retry) continue;

    if (step.retry.maxAttempts <= 0) {
      issues.push({
        level: 'error',
        message: `Step "${step.id}" retry maxAttempts must be positive`,
        context: { stepId: step.id, maxAttempts: step.retry.maxAttempts },
      });
    }

    if (step.retry.delayMs <= 0) {
      issues.push({
        level: 'error',
        message: `Step "${step.id}" retry delayMs must be positive`,
        context: { stepId: step.id, delayMs: step.retry.delayMs },
      });
    }

    if (
      step.retry.maxDelayMs !== undefined &&
      step.retry.maxDelayMs < step.retry.delayMs
    ) {
      issues.push({
        level: 'warning',
        message: `Step "${step.id}" retry maxDelayMs (${step.retry.maxDelayMs}) is less than delayMs (${step.retry.delayMs})`,
        context: { stepId: step.id },
      });
    }
  }

  return issues;
}

/**
 * Perform comprehensive workflow validation.
 *
 * @param spec - Workflow spec to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function validateWorkflowComprehensive(
  spec: WorkflowSpec,
  options: ValidateWorkflowSpecOptions = {}
): WorkflowValidationResult {
  const issues: WorkflowValidationIssue[] = [];

  // Basic validation
  issues.push(...validateWorkflowSpec(spec, options));

  // SLA validation
  issues.push(...validateSlaConfig(spec));

  // Compensation validation
  issues.push(...validateCompensation(spec));

  // Retry validation
  issues.push(...validateRetryConfig(spec));

  return {
    valid: issues.filter((i) => i.level === 'error').length === 0,
    issues,
  };
}
