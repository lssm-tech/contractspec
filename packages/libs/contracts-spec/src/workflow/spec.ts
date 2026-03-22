import type { CapabilityRef } from '../capabilities';
import type { DocBlock } from '../docs/types';
import type { ExperimentRef } from '../experiments/spec';
import type { FormRef, OpRef } from '../features';
import type { OwnerShipMeta } from '../ownership';
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

export interface StepModelHints {
	/** Preferred benchmark dimension for model selection. */
	dimension?: string;
	/** Weighted priorities across multiple dimensions. */
	priorities?: { dimension: string; weight: number }[];
	/** Hard constraints for model filtering. */
	constraints?: Record<string, unknown>;
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
	/** Hints for ranking-driven AI model selection on this step. */
	modelHints?: StepModelHints;
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

export const tech_workflows_overview_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.workflows.overview',
		title: 'WorkflowSpec Overview',
		summary:
			'WorkflowSpec provides a declarative, versioned format for long-running flows that mix automation and human review, including runtime adapter capabilities/ports for checkpointing and suspend-resume orchestration. Specs stay inside `@contractspec/lib.contracts-spec` (`src/workflow/spec.ts`) so the same definition powers runtime execution, documentation, and future generation.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/workflows/overview',
		tags: ['tech', 'workflows', 'overview'],
		body: "# WorkflowSpec Overview\n\n## Purpose\n\nWorkflowSpec provides a declarative, versioned format for long-running flows that mix automation and human review. Specs stay inside `@contractspec/lib.contracts-spec` (`src/workflow/spec.ts`) so the same definition powers runtime execution, documentation, and future generation.\n\n## Core Types\n\n- `WorkflowMeta`: ownership metadata (`title`, `domain`, `owners`, `tags`, `stability`) plus `name` and `version`.\n- `WorkflowDefinition`:\n  - `entryStepId?`: optional explicit entry point (defaults to first step).\n  - `steps[]`: ordered list of `Step` descriptors.\n  - `transitions[]`: directed edges between steps with optional expressions.\n  - `sla?`: aggregated timing hints for the overall flow or per-step budgets.\n  - `compensation?`: fallback operations executed when a workflow is rolled back or fails.\n- `Step`:\n  - `type`: `human`, `automation`, or `decision`.\n  - `action`: references either a `ContractSpec` (`operation`) or `FormSpec` (`form`).\n  - Optional `guard`, `timeoutMs`, and retry policy (`maxAttempts`, `backoff`, `delayMs`, `maxDelayMs?`).\n  - `requiredIntegrations?`: integration slot ids that must be bound before the step may execute.\n  - `requiredCapabilities?`: `CapabilityRef[]` that must be enabled in the resolved app config.\n- `Transition`: `from` \u2192 `to` with optional `condition` string (simple data expressions).\n\n## Registry & Validation\n\n- `WorkflowRegistry` (`src/workflow/spec.ts`) stores specs by key `<name>.v<version>` and exposes `register`, `list`, and `get`.\n- `validateWorkflowSpec()` (`src/workflow/validation.ts`) checks:\n  - Duplicate step IDs.\n  - Unknown `from`/`to` transitions.\n  - Empty guards/conditions.\n  - Reachability from the entry step.\n  - Cycles in the graph.\n  - Operation/Form references against provided registries.\n- `assertWorkflowSpecValid()` wraps validation and throws `WorkflowValidationError` when errors remain.\n\n## Runtime\n\n- `WorkflowRunner` (`src/workflow/runner.ts`) executes workflows and coordinates steps.\n  - `start(name, version?, initialData?)` returns a `workflowId`.\n  - `executeStep(workflowId, input?)` runs the current step (automation or human).\n  - `getState(workflowId)` retrieves the latest state snapshot.\n  - `cancel(workflowId)` marks the workflow as cancelled.\n  - `preFlightCheck(name, version?, resolvedConfig?)` evaluates integration/capability requirements before the workflow starts.\n  - Throws `WorkflowPreFlightError` if required integration slots are unbound or required capabilities are disabled.\n- `StateStore` (`src/workflow/state.ts`) abstracts persistence. V1 ships with:\n  - `InMemoryStateStore` (`src/workflow/adapters/memory-store.ts`) for tests/dev.\n  - Placeholder factories for file/database adapters (`adapters/file-adapter.ts`, `adapters/db-adapter.ts`).\n- Guard evaluation: expression guards run through `evaluateExpression()` (`src/workflow/expression.ts`); custom policy guards can be provided via `guardEvaluator`.\n- Events: the runner emits `workflow.started`, `workflow.step_completed`, `workflow.step_failed`, and `workflow.cancelled` through the optional `eventEmitter`.\n- React bindings (`@contractspec/lib.presentation-runtime-react`):\n  - `useWorkflow` hook (polls state, exposes `executeStep`, `cancel`, `refresh`).\n  - `WorkflowStepper` progress indicator using design-system Stepper.\n  - `WorkflowStepRenderer` helper to render human/automation/decision steps with sensible fallbacks.\n\n## Authoring Checklist\n\n1. Reuse existing operations/forms; create new specs when missing.\n2. Prefer explicit `entryStepId` for clarity (especially with decision branches).\n3. Give automation steps an `operation` and human steps a `form` (warnings surface otherwise).\n4. Use short, meaningful step IDs (`submit`, `review`, `finalize`) to simplify analytics.\n5. Keep guard expressions deterministic; complex policy logic should move to PolicySpec (Phase 2).\n\n## Testing\n\n- Add unit tests for new workflows via `assertWorkflowSpecValid`.\n- Use the new Vitest suites (`validation.test.ts`, `expression.test.ts`, `runner.test.ts`) as examples.\n- CLI support will arrive in Phase 1 PR 3 (`contractspec create --type workflow`).\n\n## Tooling\n\n- `contractspec create --type workflow` scaffolds a WorkflowSpec with interactive prompts.\n- `contractspec build <spec.workflow.ts>` generates a runner scaffold (`.runner.ts`) wired to `WorkflowRunner` and the in-memory store.\n- `contractspec validate` understands `.workflow.ts` files and checks core structure (meta, steps, transitions).\n\n## Next Steps (Non-MVP)\n\n- Persistence adapters (database/file) for workflow state (Phase 2).\n- React bindings (`useWorkflow`, `WorkflowStepper`) and presentation-runtime integration (PR 3).\n- Policy engine integration (`guard.type === 'policy'` validated against PolicySpec).\n- Telemetry hooks for step execution metrics.\n\n",
	},
];
