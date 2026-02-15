# WorkflowSpec Overview

## Purpose

WorkflowSpec provides a declarative, versioned format for long-running flows that mix automation and human review. Specs stay inside `@contractspec/lib.contracts-spec` (`src/workflow/spec.ts`) so the same definition powers runtime execution, documentation, and future generation.

## Core Types

- `WorkflowMeta`: ownership metadata (`title`, `domain`, `owners`, `tags`, `stability`) plus `name` and `version`.
- `WorkflowDefinition`:
  - `entryStepId?`: optional explicit entry point (defaults to first step).
  - `steps[]`: ordered list of `Step` descriptors.
  - `transitions[]`: directed edges between steps with optional expressions.
  - `sla?`: aggregated timing hints for the overall flow or per-step budgets.
  - `compensation?`: fallback operations executed when a workflow is rolled back or fails.
- `Step`:
  - `type`: `human`, `automation`, or `decision`.
  - `action`: references either a `ContractSpec` (`operation`) or `FormSpec` (`form`).
  - Optional `guard`, `timeoutMs`, and retry policy (`maxAttempts`, `backoff`, `delayMs`, `maxDelayMs?`).
  - `requiredIntegrations?`: integration slot ids that must be bound before the step may execute.
  - `requiredCapabilities?`: `CapabilityRef[]` that must be enabled in the resolved app config.
- `Transition`: `from` → `to` with optional `condition` string (simple data expressions).

## Registry & Validation

- `WorkflowRegistry` (`src/workflow/spec.ts`) stores specs by key `<name>.v<version>` and exposes `register`, `list`, and `get`.
- `validateWorkflowSpec()` (`src/workflow/validation.ts`) checks:
  - Duplicate step IDs.
  - Unknown `from`/`to` transitions.
  - Empty guards/conditions.
  - Reachability from the entry step.
  - Cycles in the graph.
  - Operation/Form references against provided registries.
- `assertWorkflowSpecValid()` wraps validation and throws `WorkflowValidationError` when errors remain.

## Runtime

- `WorkflowRunner` (`src/workflow/runner.ts`) executes workflows and coordinates steps.
  - `start(name, version?, initialData?)` returns a `workflowId`.
  - `executeStep(workflowId, input?)` runs the current step (automation or human).
  - `getState(workflowId)` retrieves the latest state snapshot.
  - `cancel(workflowId)` marks the workflow as cancelled.
  - `preFlightCheck(name, version?, resolvedConfig?)` evaluates integration/capability requirements before the workflow starts.
  - Throws `WorkflowPreFlightError` if required integration slots are unbound or required capabilities are disabled.
- `StateStore` (`src/workflow/state.ts`) abstracts persistence. V1 ships with:
  - `InMemoryStateStore` (`src/workflow/adapters/memory-store.ts`) for tests/dev.
  - Placeholder factories for file/database adapters (`adapters/file-adapter.ts`, `adapters/db-adapter.ts`).
- Guard evaluation: expression guards run through `evaluateExpression()` (`src/workflow/expression.ts`); custom policy guards can be provided via `guardEvaluator`.
- Events: the runner emits `workflow.started`, `workflow.step_completed`, `workflow.step_failed`, and `workflow.cancelled` through the optional `eventEmitter`.
- React bindings (`@contractspec/lib.presentation-runtime-react`):
  - `useWorkflow` hook (polls state, exposes `executeStep`, `cancel`, `refresh`).
  - `WorkflowStepper` progress indicator using design-system Stepper.
  - `WorkflowStepRenderer` helper to render human/automation/decision steps with sensible fallbacks.

## Authoring Checklist

1. Reuse existing operations/forms; create new specs when missing.
2. Prefer explicit `entryStepId` for clarity (especially with decision branches).
3. Give automation steps an `operation` and human steps a `form` (warnings surface otherwise).
4. Use short, meaningful step IDs (`submit`, `review`, `finalize`) to simplify analytics.
5. Keep guard expressions deterministic; complex policy logic should move to PolicySpec (Phase 2).

## Testing

- Add unit tests for new workflows via `assertWorkflowSpecValid`.
- Use the new Vitest suites (`validation.test.ts`, `expression.test.ts`, `runner.test.ts`) as examples.
- CLI support will arrive in Phase 1 PR 3 (`contractspec create --type workflow`).

## Tooling

- `contractspec create --type workflow` scaffolds a WorkflowSpec with interactive prompts.
- `contractspec build <spec.workflow.ts>` generates a runner scaffold (`.runner.ts`) wired to `WorkflowRunner` and the in-memory store.
- `contractspec validate` understands `.workflow.ts` files and checks core structure (meta, steps, transitions).

## Next Steps (Non-MVP)

- Persistence adapters (database/file) for workflow state (Phase 2).
- React bindings (`useWorkflow`, `WorkflowStepper`) and presentation-runtime integration (PR 3).
- Policy engine integration (`guard.type === 'policy'` validated against PolicySpec).
- Telemetry hooks for step execution metrics.

