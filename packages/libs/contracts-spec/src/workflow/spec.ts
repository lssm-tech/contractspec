import type { CapabilityRef } from '../capabilities';
import type { OwnerShipMeta } from '../ownership';
import type { OpRef, FormRef } from '../features';
import type { ExperimentRef } from '../experiments/spec';
import { SpecContractRegistry } from '../registry';

// Re-export for backwards compatibility
export type { FormRef };

export type StepType = 'human' | 'automation' | 'decision';

export type WorkflowStatus =
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type GuardConditionKind = 'policy' | 'expression';

export type WorkflowRuntimeAdapterKey =
  | 'langgraph'
  | 'langchain'
  | 'workflow-devkit';

export type WorkflowExecutionErrorKind =
  | 'fatal'
  | 'retryable'
  | 'timeout'
  | 'guard_rejected'
  | 'policy_blocked';

export interface WorkflowRuntimeCapabilities {
  /** Optional adapter availability map for external workflow runtimes. */
  adapters?: Partial<Record<WorkflowRuntimeAdapterKey, boolean>>;
  /** Whether workflow execution should persist checkpoints. */
  checkpointing?: boolean;
  /** Whether workflow execution supports suspend/resume semantics. */
  suspendResume?: boolean;
  /** Whether workflow execution can delegate to approval gateways. */
  approvalGateway?: boolean;
}

export interface WorkflowRuntimePorts {
  /** Symbolic identifier for checkpoint store adapter. */
  checkpointStore?: string;
  /** Symbolic identifier for suspend/resume adapter. */
  suspension?: string;
  /** Symbolic identifier for retry classifier adapter. */
  retryClassifier?: string;
  /** Symbolic identifier for approval gateway adapter. */
  approvalGateway?: string;
}

export interface WorkflowRuntimeConfig {
  capabilities?: WorkflowRuntimeCapabilities;
  ports?: WorkflowRuntimePorts;
}

export interface GuardCondition {
  type: GuardConditionKind;
  /** Policy name or expression string depending on the type. */
  value: string;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoff: 'linear' | 'exponential';
  delayMs: number;
  /** Optional max delay cap for exponential backoff. */
  maxDelayMs?: number;
}

export interface StepAction {
  /** Operation executed for automation steps. */
  operation?: OpRef;
  /** Form rendered for human input steps. */
  form?: FormRef;
}

export interface Step {
  id: string;
  type: StepType;
  label: string;
  description?: string;
  action?: StepAction;
  guard?: GuardCondition;
  timeoutMs?: number;
  retry?: RetryPolicy;
  /** Integration slot identifiers required before this step can execute. */
  requiredIntegrations?: string[];
  /** Capabilities that must be enabled for this step to execute. */
  requiredCapabilities?: CapabilityRef[];
}

export interface Transition {
  from: string;
  to: string;
  label?: string;
  /** Expression evaluated against workflow data (e.g., `data.approved === true`). */
  condition?: string;
}

export interface SLA {
  totalDurationMs?: number;
  stepDurationMs?: Record<string, number>;
}

export interface CompensationStep {
  stepId: string;
  operation: OpRef;
  description?: string;
}

export interface CompensationStrategy {
  trigger?: 'on_failure' | 'manual';
  steps: CompensationStep[];
}

export interface WorkflowDefinition {
  steps: Step[];
  transitions: Transition[];
  /** Optional explicit entry step. Defaults to the first step when omitted. */
  entryStepId?: string;
  sla?: SLA;
  compensation?: CompensationStrategy;
}

export type WorkflowMeta = OwnerShipMeta;

export interface WorkflowSpec {
  meta: WorkflowMeta;
  definition: WorkflowDefinition;
  /** Optional runtime config for adapter-first workflow orchestration. */
  runtime?: WorkflowRuntimeConfig;
  /** Optional metadata merged by workflow composition overlays. */
  metadata?: Record<string, unknown>;
  /** Optional annotations merged by workflow composition overlays. */
  annotations?: Record<string, unknown>;
  policy?: { flags?: string[] };
  experiments?: ExperimentRef[];
}

export class WorkflowRegistry extends SpecContractRegistry<
  'workflow',
  WorkflowSpec
> {
  constructor(items?: WorkflowSpec[]) {
    super('workflow', items);
  }
}
