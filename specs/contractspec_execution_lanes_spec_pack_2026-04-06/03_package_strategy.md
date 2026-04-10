# 03 Package Strategy

## Recommended packages

### Primary package
`@contractspec/lib.execution-lanes`

Responsibilities:
- lane specs and registries
- handoff artifact schemas
- completion-loop state machine
- team-run state machine
- staffing / role-profile resolution
- control-plane interfaces
- adapter ports for concrete backends

### Optional operator package
`@contractspec/module.execution-console`

Responsibilities:
- timeline UI
- worker status board
- mailbox viewer
- evidence drawer
- pause / resume / shutdown controls
- lane history visualization

## Why not put this into existing packages?

### Not `@contractspec/lib.contracts-spec`
That package should stay focused on:
- defining contracts
- registering specs
- shared runtime-neutral primitives

If execution lanes go there wholesale, the package stops being a contract core and becomes a workflow product.

### Not `@contractspec/lib.ai-agent`
That package should stay focused on:
- sessions
- memory
- tools
- approvals
- providers
- runtime adapters

It should execute orchestrations, not own their product semantics.

### Not `@contractspec/lib.harness`
That package should stay focused on:
- evidence normalization
- evaluation
- replay bundles
- proof-oriented workflows

It is the verifier's substrate, not the lane model itself.

## Dependency graph

`lib.execution-lanes`
- depends on `lib.contracts-spec`
- depends on `lib.ai-agent`
- depends on `lib.harness`
- may depend on `lib.observability`
- may depend on `lib.workflow-composer` or workflow subpaths where helpful
- must not depend directly on one terminal backend

`module.execution-console`
- depends on `lib.execution-lanes`
- depends on existing UI/runtime surface packages as needed

## Suggested repo layout

- `packages/libs/execution-lanes/`
  - `src/spec/`
  - `src/registry/`
  - `src/lanes/clarify/`
  - `src/lanes/plan/`
  - `src/lanes/complete/`
  - `src/lanes/team/`
  - `src/runtime/`
  - `src/adapters/`
  - `src/evidence/`
  - `src/interop/`
  - `src/types.ts`

- `packages/modules/execution-console/`
  - `src/components/`
  - `src/pages/`
  - `src/hooks/`
  - `src/types/`

## Export strategy

Minimal core exports:
- `defineExecutionLane`
- `ExecutionLaneRegistry`
- `defineRoleProfile`
- `RoleProfileRegistry`
- `createCompletionLoop`
- `createTeamRun`
- `createLaneSelector`
- `createLaneRuntime`
- `createEvidenceGate`
- `createTeamBackendAdapter`
- `createCompletionBackendAdapter`

## Ownership split across existing packages

### `@contractspec/lib.contracts-spec`
Add only the minimum shared contracts if needed:
- maybe shared enums / ids
- maybe lightweight `ExecutionArtifactRef` types
- avoid moving the full runtime model here

### `@contractspec/lib.ai-agent`
Reuse for:
- session state
- provider selection
- tool loop control
- approval workflow
- runtime adapters
- checkpoint metadata

### `@contractspec/lib.harness`
Reuse for:
- evidence normalization
- proof bundles
- replay-safe verification
- evaluation policies
- run comparisons

## Default implementation posture

The default implementation should be:
- additive
- backend-agnostic
- resumable
- audit-friendly
- boring in the best way

Human civilization desperately under-invests in boring reliability.
This package should correct that a little.
