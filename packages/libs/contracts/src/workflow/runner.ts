import { randomUUID } from 'node:crypto';
import type {
  GuardCondition,
  Step,
  WorkflowRegistry,
  WorkflowSpec,
} from './spec';
import type { StateStore, WorkflowState, StepExecution } from './state';
import { evaluateExpression } from './expression';
import type { OpRef } from '../features';
import type { CapabilityRef } from '../capabilities';
import type {
  ResolvedAppConfig,
  ResolvedIntegration,
  ResolvedKnowledge,
  ResolvedTranslation,
} from '../app-config/runtime';
import type { ResolvedBranding } from '../app-config/branding';
import type { TranslationResolver } from '../types';
import type { SecretProvider } from '../integrations/secrets/provider';

export interface OperationExecutorContext {
  workflow: WorkflowState;
  step: Step;
  resolvedAppConfig?: ResolvedAppConfig;
  integrations?: ResolvedIntegration[];
  knowledge?: ResolvedKnowledge[];
  branding?: ResolvedBranding;
  translation?: ResolvedTranslation;
  translationResolver?: TranslationResolver;
  secretProvider?: SecretProvider;
}

export type OperationExecutor = (
  op: OpRef,
  input: unknown,
  context: OperationExecutorContext
) => Promise<unknown>;

export type WorkflowPreFlightIssueType = 'integration' | 'capability';

export type WorkflowPreFlightIssueSeverity = 'error' | 'warning';

export interface WorkflowPreFlightIssue {
  stepId: string;
  type: WorkflowPreFlightIssueType;
  identifier: string;
  severity: WorkflowPreFlightIssueSeverity;
  reason: string;
}

export interface WorkflowPreFlightResult {
  canStart: boolean;
  issues: WorkflowPreFlightIssue[];
}

export interface GuardContext {
  workflow: WorkflowState;
  step: Step;
  input?: unknown;
}

export type GuardEvaluator = (
  guard: GuardCondition,
  context: GuardContext
) => Promise<boolean> | boolean;

export interface WorkflowRunnerConfig {
  registry: WorkflowRegistry;
  stateStore: StateStore;
  opExecutor: OperationExecutor;
  guardEvaluator?: GuardEvaluator;
  eventEmitter?: (event: string, payload: Record<string, unknown>) => void;
  appConfigProvider?: (
    state: WorkflowState
  ) => ResolvedAppConfig | undefined | Promise<ResolvedAppConfig | undefined>;
  enforceCapabilities?: (
    operation: OpRef,
    context: OperationExecutorContext
  ) => void | Promise<void>;
  secretProvider?: SecretProvider;
  translationResolver?: TranslationResolver;
}

export class WorkflowRunner {
  constructor(private readonly config: WorkflowRunnerConfig) {}

  async preFlightCheck(
    workflowName: string,
    version?: number,
    resolvedConfig?: ResolvedAppConfig
  ): Promise<WorkflowPreFlightResult> {
    const spec = this.getSpec(workflowName, version);
    return this.performPreFlight(spec, resolvedConfig);
  }

  async start(
    workflowName: string,
    version?: number,
    initialData?: Record<string, unknown>
  ): Promise<string> {
    const spec = this.getSpec(workflowName, version);
    const entryStepId = resolveEntryStepId(spec);
    const now = new Date();
    const workflowId = randomUUID();

    const state: WorkflowState = {
      workflowId,
      workflowName: spec.meta.name,
      workflowVersion: spec.meta.version,
      currentStep: entryStepId,
      data: { ...(initialData ?? {}) },
      history: [],
      status: 'running',
      createdAt: now,
      updatedAt: now,
    };

    const resolvedAppConfig = this.config.appConfigProvider
      ? await this.config.appConfigProvider(state)
      : undefined;

    const preFlightResult = await this.performPreFlight(
      spec,
      resolvedAppConfig
    );
    if (!preFlightResult.canStart) {
      throw new WorkflowPreFlightError(preFlightResult.issues);
    }

    await this.config.stateStore.create(state);
    this.emit('workflow.started', {
      workflowId,
      workflowName: spec.meta.name,
      workflowVersion: spec.meta.version,
      currentStep: entryStepId,
    });
    return workflowId;
  }

  async executeStep(workflowId: string, input?: unknown): Promise<void> {
    const state = await this.getStateOrThrow(workflowId);
    if (isTerminalStatus(state.status)) {
      throw new Error(
        `Workflow ${workflowId} is in terminal status "${state.status}".`
      );
    }

    const spec = this.getSpec(state.workflowName, state.workflowVersion);
    const step = getCurrentStep(spec, state.currentStep);
    const guardOk = await this.evaluateGuard(step, state, input);
    if (!guardOk)
      throw new Error(`GuardRejected: ${state.workflowName} -> ${step.id}`);

    const execution: StepExecution = {
      stepId: step.id,
      startedAt: new Date(),
      status: 'running',
      input,
    };

    const workingState: WorkflowState = {
      ...state,
      data: { ...state.data },
      history: [...state.history],
    };

    try {
      const output = await this.runStepAction(step, workingState, input);
      execution.output = output;
      execution.status = 'completed';
      execution.completedAt = new Date();
      workingState.history.push(execution);
      workingState.updatedAt = new Date();

      if (isRecord(input)) {
        workingState.data = { ...workingState.data, ...input };
      }
      if (isRecord(output)) {
        workingState.data = { ...workingState.data, ...output };
      }

      const nextStepId = this.pickNextStepId(
        spec,
        workingState,
        step,
        input,
        output
      );

      if (nextStepId) {
        workingState.currentStep = nextStepId;
        workingState.status = 'running';
      } else if (!hasOutgoing(spec, step.id)) {
        workingState.status = 'completed';
      } else {
        throw new Error(
          `No transition matched after executing step "${step.id}".`
        );
      }

      await this.config.stateStore.update(workflowId, () => workingState);
      this.emit('workflow.step_completed', {
        workflowId,
        workflowName: state.workflowName,
        stepId: step.id,
        status: workingState.status,
      });
    } catch (error) {
      execution.status = 'failed';
      execution.completedAt = new Date();
      execution.error =
        error instanceof Error ? error.message : String(error);
      workingState.history.push(execution);
      workingState.status = 'failed';
      workingState.updatedAt = new Date();
      await this.config.stateStore.update(workflowId, () => workingState);
      this.emit('workflow.step_failed', {
        workflowId,
        workflowName: state.workflowName,
        stepId: step.id,
        error: execution.error ?? 'unknown',
      });
      throw error;
    }
  }

  async getState(workflowId: string): Promise<WorkflowState> {
    return this.getStateOrThrow(workflowId);
  }

  async cancel(workflowId: string): Promise<void> {
    const state = await this.getStateOrThrow(workflowId);
    if (state.status === 'cancelled') return;

    const nextState: WorkflowState = {
      ...state,
      status: 'cancelled',
      updatedAt: new Date(),
    };
    await this.config.stateStore.update(workflowId, () => nextState);
    this.emit('workflow.cancelled', {
      workflowId,
      workflowName: state.workflowName,
    });
  }

  private async performPreFlight(
    spec: WorkflowSpec,
    resolvedConfig?: ResolvedAppConfig
  ): Promise<WorkflowPreFlightResult> {
    if (!resolvedConfig) {
      return { canStart: true, issues: [] };
    }

    const issues: WorkflowPreFlightIssue[] = [];
    const integrationBySlot = new Map<string, ResolvedIntegration>();
    for (const integration of resolvedConfig.integrations) {
      integrationBySlot.set(integration.slot.slotId, integration);
    }

    for (const step of spec.definition.steps) {
      for (const slotId of step.requiredIntegrations ?? []) {
        const integration = integrationBySlot.get(slotId);
        if (!integration) {
          issues.push({
            stepId: step.id,
            type: 'integration',
            identifier: slotId,
            severity: 'error',
            reason: `Integration slot "${slotId}" is not bound in the resolved app config.`,
          });
          continue;
        }
        const status = integration.connection.status;
        if (status === 'disconnected' || status === 'error') {
          issues.push({
            stepId: step.id,
            type: 'integration',
            identifier: slotId,
            severity: 'error',
            reason: `Integration slot "${slotId}" is in status "${status}".`,
          });
        } else if (status === 'unknown') {
          issues.push({
            stepId: step.id,
            type: 'integration',
            identifier: slotId,
            severity: 'warning',
            reason: `Integration slot "${slotId}" reports unknown health status.`,
          });
        }
      }
    }

    const enabledCapabilities = new Set(
      resolvedConfig.capabilities.enabled.map(capabilityKey)
    );
    for (const step of spec.definition.steps) {
      for (const required of step.requiredCapabilities ?? []) {
        if (!enabledCapabilities.has(capabilityKey(required))) {
          issues.push({
            stepId: step.id,
            type: 'capability',
            identifier: capabilityKey(required),
            severity: 'error',
            reason: `Capability "${required.key}@${required.version}" is not enabled.`,
          });
        }
      }
    }

    const canStart = issues.every((issue) => issue.severity !== 'error');
    return { canStart, issues };
  }

  private async evaluateGuard(
    step: Step,
    state: WorkflowState,
    input: unknown
  ) {
    if (!step.guard) return true;
    if (this.config.guardEvaluator)
      return this.config.guardEvaluator(step.guard, {
        workflow: state,
        step,
        input,
      });
    if (step.guard.type === 'expression') {
      return evaluateExpression(step.guard.value, {
        data: state.data,
        input,
      });
    }
    return true;
  }

  private async runStepAction(
    step: Step,
    state: WorkflowState,
    input: unknown
  ): Promise<unknown> {
    if (step.type === 'automation') {
      const op = step.action?.operation;
      if (!op)
        throw new Error(`Automation step "${step.id}" requires an operation.`);
      const resolvedAppConfig = this.config.appConfigProvider
        ? await this.config.appConfigProvider(state)
        : undefined;
      const executorContext: OperationExecutorContext = {
        workflow: state,
        step,
        resolvedAppConfig,
        integrations: resolvedAppConfig?.integrations ?? [],
        knowledge: resolvedAppConfig?.knowledge ?? [],
        branding: resolvedAppConfig?.branding,
        translation: resolvedAppConfig?.translation,
        translationResolver: this.config.translationResolver,
        secretProvider: this.config.secretProvider,
      };
      if (this.config.enforceCapabilities) {
        await this.config.enforceCapabilities(op, executorContext);
      }
      return this.config.opExecutor(op, input, executorContext);
    }

    if (step.type === 'human') {
      return input;
    }

    // decision step
    return input;
  }

  private pickNextStepId(
    spec: WorkflowSpec,
    state: WorkflowState,
    step: Step,
    input: unknown,
    output: unknown
  ): string | null {
    const transitions = spec.definition.transitions.filter(
      (t) => t.from === step.id
    );
    for (const transition of transitions) {
      if (
        evaluateExpression(transition.condition, {
          data: state.data,
          input,
          output,
        })
      ) {
        const target = spec.definition.steps.find((s) => s.id === transition.to);
        if (!target)
          throw new Error(
            `Transition ${transition.from} -> ${transition.to} points to missing step.`
          );
        return target.id;
      }
    }
    return null;
  }

  private getSpec(name: string, version?: number): WorkflowSpec {
    const spec = this.config.registry.get(name, version);
    if (!spec)
      throw new Error(
        `Workflow spec not found for ${name}${version ? `.v${version}` : ''}`
      );
    return spec;
  }

  private async getStateOrThrow(workflowId: string): Promise<WorkflowState> {
    const state = await this.config.stateStore.get(workflowId);
    if (!state) throw new Error(`Workflow state not found for ${workflowId}`);
    return state;
  }

  private emit(event: string, payload: Record<string, unknown>) {
    this.config.eventEmitter?.(event, payload);
  }
}

function resolveEntryStepId(spec: WorkflowSpec): string {
  const entry =
    spec.definition.entryStepId ?? spec.definition.steps[0]?.id ?? null;
  if (!entry)
    throw new Error(
      `Workflow ${spec.meta.name}.v${spec.meta.version} has no entry step.`
    );
  return entry;
}

function getCurrentStep(spec: WorkflowSpec, stepId: string): Step {
  const step = spec.definition.steps.find((s) => s.id === stepId);
  if (!step)
    throw new Error(
      `Step "${stepId}" not found in workflow ${spec.meta.name}.v${spec.meta.version}.`
    );
  return step;
}

function hasOutgoing(spec: WorkflowSpec, stepId: string): boolean {
  return spec.definition.transitions.some((t) => t.from === stepId);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    value != null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

function isTerminalStatus(status: WorkflowState['status']) {
  return status === 'completed' || status === 'failed' || status === 'cancelled';
}

export class WorkflowPreFlightError extends Error {
  constructor(public readonly issues: WorkflowPreFlightIssue[]) {
    super(
      `Workflow pre-flight failed: ${issues
        .filter((issue) => issue.severity === 'error')
        .map((issue) => `${issue.type}:${issue.identifier}`)
        .join(', ')}`
    );
    this.name = 'WorkflowPreFlightError';
  }
}

function capabilityKey(ref: CapabilityRef): string {
  return `${ref.key}@${ref.version}`;
}

