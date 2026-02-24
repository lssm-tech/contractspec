/**
 * Runtime workflow context for simplified workflow interaction.
 *
 * Provides a context object that wraps workflow execution state and
 * provides convenient methods for state management, transitions,
 * SLA tracking, and compensation.
 *
 * @module workflow/context
 *
 * @example
 * ```typescript
 * import { createWorkflowContext, WorkflowRunner } from '@contractspec/lib.contracts-spec';
 *
 * // Create context from running workflow
 * const ctx = createWorkflowContext(runner, workflowId);
 *
 * // Access state
 * console.log(ctx.currentStep);
 * console.log(ctx.state.data);
 *
 * // Check transitions
 * if (ctx.canTransition('review')) {
 *   await ctx.transition('review', { approved: true });
 * }
 *
 * // Track SLA
 * if (ctx.isSlaViolated('totalDuration')) {
 *   console.log('Remaining time:', ctx.getRemainingTime('totalDuration'));
 * }
 * ```
 */

import type { StepExecution, WorkflowState } from './state';
import type { Step, WorkflowSpec } from './spec';

// ─────────────────────────────────────────────────────────────────────────────
// Error Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Error thrown when a workflow operation fails.
 */
export class WorkflowContextError extends Error {
  readonly errorType: WorkflowContextErrorType;
  readonly workflowId: string;
  readonly details?: Record<string, unknown>;

  constructor(
    type: WorkflowContextErrorType,
    workflowId: string,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'WorkflowContextError';
    this.errorType = type;
    this.workflowId = workflowId;
    this.details = details;
  }
}

export type WorkflowContextErrorType =
  | 'invalid_transition'
  | 'workflow_completed'
  | 'workflow_failed'
  | 'step_not_found'
  | 'guard_rejected'
  | 'sla_violated';

// ─────────────────────────────────────────────────────────────────────────────
// Transition Types
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkflowTransitionResult {
  success: boolean;
  previousStep: string;
  currentStep: string;
  status: WorkflowState['status'];
  error?: string;
}

export interface AvailableTransition {
  from: string;
  to: string;
  label?: string;
  condition?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SLA Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SlaStatus {
  key: string;
  type: 'workflow' | 'step';
  stepId?: string;
  limitMs: number;
  elapsedMs: number;
  remainingMs: number;
  violated: boolean;
  percentUsed: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// History Types
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkflowEvent {
  timestamp: Date;
  type:
    | 'step_started'
    | 'step_completed'
    | 'step_failed'
    | 'step_retried'
    | 'transition';
  stepId?: string;
  fromStep?: string;
  toStep?: string;
  input?: unknown;
  output?: unknown;
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context Interface
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Runtime context for interacting with a workflow instance.
 *
 * Provides a simplified interface over WorkflowRunner for common
 * workflow operations like state access, transitions, and SLA tracking.
 */
export interface WorkflowContext<
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Unique workflow instance identifier. */
  readonly workflowId: string;

  /** Workflow spec key. */
  readonly workflowKey: string;

  /** Workflow spec version. */
  readonly workflowVersion: string;

  /** Current step identifier. */
  readonly currentStep: string;

  /** Current workflow status. */
  readonly status: WorkflowState['status'];

  /** Workflow data/state. */
  readonly data: TData;

  /** Execution history. */
  readonly history: readonly StepExecution[];

  // ─────────────────────────────────────────────────────────────────────────
  // State Management
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get the current workflow state.
   * @returns Full workflow state object
   */
  getState(): WorkflowState<TData>;

  /**
   * Get a value from workflow data.
   * @param key - Data key to retrieve
   * @returns Value or undefined
   */
  getData<Key extends keyof TData>(key: Key): TData[Key] | undefined;

  /**
   * Check if workflow is in a terminal state.
   * @returns True if completed, failed, or cancelled
   */
  isTerminal(): boolean;

  /**
   * Check if workflow is running.
   * @returns True if status is 'running'
   */
  isRunning(): boolean;

  // ─────────────────────────────────────────────────────────────────────────
  // Step Information
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get the current step definition.
   * @returns Step definition or undefined
   */
  getCurrentStepDef(): Step | undefined;

  /**
   * Get the retry count for a step.
   * @param stepId - Step to check (defaults to current step)
   * @returns Number of retry attempts
   */
  getRetryCount(stepId?: string): number;

  // ─────────────────────────────────────────────────────────────────────────
  // Transitions
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Check if a transition to a target step is valid.
   * @param toStepId - Target step identifier
   * @returns True if transition is valid from current step
   */
  canTransition(toStepId: string): boolean;

  /**
   * Get all available transitions from current step.
   * @returns Array of available transitions
   */
  getAvailableTransitions(): AvailableTransition[];

  /**
   * Check if the current step has any outgoing transitions.
   * @returns True if there are outgoing transitions
   */
  hasNextStep(): boolean;

  // ─────────────────────────────────────────────────────────────────────────
  // SLA Tracking
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get remaining time for an SLA constraint.
   * @param slaKey - 'totalDuration' or step ID
   * @returns Remaining milliseconds, or null if no SLA configured
   */
  getRemainingTime(slaKey: string): number | null;

  /**
   * Check if an SLA constraint has been violated.
   * @param slaKey - 'totalDuration' or step ID
   * @returns True if SLA has been violated
   */
  isSlaViolated(slaKey: string): boolean;

  /**
   * Get status of all SLA constraints.
   * @returns Array of SLA statuses
   */
  getAllSlaStatuses(): SlaStatus[];

  // ─────────────────────────────────────────────────────────────────────────
  // Compensation
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Check if compensation/rollback is available.
   * @returns True if workflow has compensation strategy
   */
  hasCompensation(): boolean;

  /**
   * Get steps that have compensation handlers.
   * @returns Array of step IDs with compensation
   */
  getCompensableSteps(): string[];

  // ─────────────────────────────────────────────────────────────────────────
  // Events
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Convert execution history to workflow events.
   * @returns Array of workflow events
   */
  getEvents(): WorkflowEvent[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Context Implementation
// ─────────────────────────────────────────────────────────────────────────────

class WorkflowContextImpl<
  TData extends Record<string, unknown> = Record<string, unknown>,
> implements WorkflowContext<TData> {
  constructor(
    private readonly state: WorkflowState<TData>,
    private readonly spec: WorkflowSpec
  ) {}

  get workflowId(): string {
    return this.state.workflowId;
  }

  get workflowKey(): string {
    return this.state.workflowName;
  }

  get workflowVersion(): string {
    return this.state.workflowVersion;
  }

  get currentStep(): string {
    return this.state.currentStep;
  }

  get status(): WorkflowState['status'] {
    return this.state.status;
  }

  get data(): TData {
    return this.state.data as TData;
  }

  get history(): readonly StepExecution[] {
    return this.state.history;
  }

  // State Management
  getState(): WorkflowState<TData> {
    return this.state;
  }

  getData<Key extends keyof TData>(key: Key): TData[Key] | undefined {
    return this.state.data[key];
  }

  isTerminal(): boolean {
    return (
      this.state.status === 'completed' ||
      this.state.status === 'failed' ||
      this.state.status === 'cancelled'
    );
  }

  isRunning(): boolean {
    return this.state.status === 'running';
  }

  // Step Information
  getCurrentStepDef(): Step | undefined {
    return this.spec.definition.steps.find(
      (s) => s.id === this.state.currentStep
    );
  }

  getRetryCount(stepId?: string): number {
    const id = stepId ?? this.state.currentStep;
    return this.state.retryCounts?.[id] ?? 0;
  }

  // Transitions
  canTransition(toStepId: string): boolean {
    const transitions = this.spec.definition.transitions.filter(
      (t) => t.from === this.state.currentStep && t.to === toStepId
    );
    return transitions.length > 0;
  }

  getAvailableTransitions(): AvailableTransition[] {
    return this.spec.definition.transitions
      .filter((t) => t.from === this.state.currentStep)
      .map((t) => ({
        from: t.from,
        to: t.to,
        label: t.label,
        condition: t.condition,
      }));
  }

  hasNextStep(): boolean {
    return this.spec.definition.transitions.some(
      (t) => t.from === this.state.currentStep
    );
  }

  // SLA Tracking
  getRemainingTime(slaKey: string): number | null {
    const sla = this.spec.definition.sla;
    if (!sla) return null;

    const now = Date.now();

    if (slaKey === 'totalDuration') {
      if (!sla.totalDurationMs) return null;
      const elapsed = now - this.state.createdAt.getTime();
      return Math.max(0, sla.totalDurationMs - elapsed);
    }

    // Step-specific SLA
    const stepLimit = sla.stepDurationMs?.[slaKey];
    if (!stepLimit) return null;

    const stepExecution = this.state.history.find(
      (h) => h.stepId === slaKey && h.status === 'running'
    );
    if (!stepExecution) return stepLimit; // Not started yet

    const elapsed = now - stepExecution.startedAt.getTime();
    return Math.max(0, stepLimit - elapsed);
  }

  isSlaViolated(slaKey: string): boolean {
    const remaining = this.getRemainingTime(slaKey);
    return remaining !== null && remaining <= 0;
  }

  getAllSlaStatuses(): SlaStatus[] {
    const sla = this.spec.definition.sla;
    if (!sla) return [];

    const statuses: SlaStatus[] = [];
    const now = Date.now();

    // Workflow-level SLA
    if (sla.totalDurationMs) {
      const elapsed = now - this.state.createdAt.getTime();
      const remaining = Math.max(0, sla.totalDurationMs - elapsed);
      statuses.push({
        key: 'totalDuration',
        type: 'workflow',
        limitMs: sla.totalDurationMs,
        elapsedMs: elapsed,
        remainingMs: remaining,
        violated: remaining <= 0,
        percentUsed: (elapsed / sla.totalDurationMs) * 100,
      });
    }

    // Step-level SLAs
    if (sla.stepDurationMs) {
      for (const [stepId, limitMs] of Object.entries(sla.stepDurationMs)) {
        const stepExecution = this.state.history.find(
          (h) => h.stepId === stepId && h.status === 'running'
        );

        const elapsed = stepExecution
          ? now - stepExecution.startedAt.getTime()
          : 0;
        const remaining = Math.max(0, limitMs - elapsed);

        statuses.push({
          key: stepId,
          type: 'step',
          stepId,
          limitMs,
          elapsedMs: elapsed,
          remainingMs: remaining,
          violated: stepExecution !== undefined && remaining <= 0,
          percentUsed: (elapsed / limitMs) * 100,
        });
      }
    }

    return statuses;
  }

  // Compensation
  hasCompensation(): boolean {
    return this.spec.definition.compensation !== undefined;
  }

  getCompensableSteps(): string[] {
    const compensation = this.spec.definition.compensation;
    if (!compensation) return [];
    return compensation.steps.map((s) => s.stepId);
  }

  // Events
  getEvents(): WorkflowEvent[] {
    const events: WorkflowEvent[] = [];

    for (const execution of this.state.history) {
      // Step started
      events.push({
        timestamp: execution.startedAt,
        type: 'step_started',
        stepId: execution.stepId,
        input: execution.input,
      });

      // Step completed/failed
      if (execution.completedAt) {
        if (execution.status === 'completed') {
          events.push({
            timestamp: execution.completedAt,
            type: 'step_completed',
            stepId: execution.stepId,
            output: execution.output,
          });
        } else if (execution.status === 'failed') {
          events.push({
            timestamp: execution.completedAt,
            type: 'step_failed',
            stepId: execution.stepId,
            error: execution.error,
          });
        }
      }
    }

    // Sort by timestamp
    events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return events;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a workflow context from state and spec.
 *
 * @param state - Current workflow state
 * @param spec - Workflow specification
 * @returns WorkflowContext for interacting with the workflow
 *
 * @example
 * ```typescript
 * const state = await runner.getState(workflowId);
 * const spec = registry.get(state.workflowName, state.workflowVersion);
 * const ctx = createWorkflowContext(state, spec);
 *
 * console.log('Current step:', ctx.currentStep);
 * console.log('Available transitions:', ctx.getAvailableTransitions());
 * ```
 */
export function createWorkflowContext<
  TData extends Record<string, unknown> = Record<string, unknown>,
>(state: WorkflowState<TData>, spec: WorkflowSpec): WorkflowContext<TData> {
  return new WorkflowContextImpl<TData>(state, spec);
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate workflow progress as a percentage.
 *
 * @param ctx - Workflow context
 * @returns Progress percentage (0-100)
 */
export function calculateWorkflowProgress(ctx: WorkflowContext): number {
  const state = ctx.getState();
  const completedSteps = new Set(
    state.history.filter((h) => h.status === 'completed').map((h) => h.stepId)
  );

  // This is a simple calculation; actual progress may need spec-specific logic
  // since workflows can have branches and loops
  const _totalSteps = completedSteps.size + (ctx.isTerminal() ? 0 : 1);

  if (ctx.status === 'completed') return 100;
  if (ctx.status === 'failed' || ctx.status === 'cancelled') {
    // Return progress at time of failure
    return completedSteps.size > 0 ? Math.min(99, completedSteps.size * 20) : 0;
  }

  return Math.min(99, completedSteps.size * 20);
}

/**
 * Get the duration of a workflow in milliseconds.
 *
 * @param ctx - Workflow context
 * @returns Duration in milliseconds
 */
export function getWorkflowDuration(ctx: WorkflowContext): number {
  const state = ctx.getState();
  const endTime = ctx.isTerminal() ? state.updatedAt.getTime() : Date.now();
  return endTime - state.createdAt.getTime();
}

/**
 * Get the average step duration in milliseconds.
 *
 * @param ctx - Workflow context
 * @returns Average duration or 0 if no completed steps
 */
export function getAverageStepDuration(ctx: WorkflowContext): number {
  const completedSteps = ctx.history.filter(
    (h) => h.status === 'completed' && h.completedAt
  );

  if (completedSteps.length === 0) return 0;

  const totalDuration = completedSteps.reduce((sum, step) => {
    if (!step.completedAt) return sum;
    const duration = step.completedAt.getTime() - step.startedAt.getTime();
    return sum + duration;
  }, 0);

  return totalDuration / completedSteps.length;
}
