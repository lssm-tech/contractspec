# @contractspec/lib.contracts-spec

Core contract declarations, registries, and shared execution primitives for ContractSpec.

Website: https://contractspec.io/

## Why this package exists

`@contractspec/lib.contracts-spec` is the foundation of the split from `@contractspec/lib.contracts`.

It gives you one place to define behavior before implementation:

1. Declare specs (operations, events, forms, resources, policies).
2. Bind handlers.
3. Project the same contracts into REST, GraphQL, MCP, and React runtimes.

This spec-first flow improves determinism, regeneration safety, and multi-surface consistency.

## Package boundary (important)

Use this package for:

- Contract declarations (`defineCommand`, `defineQuery`, `defineEvent`, `defineResourceTemplate`, etc.).
- Core registries (`OperationSpecRegistry`, `EventRegistry`, `FormRegistry`, `ResourceRegistry`).
- Shared execution/runtime-neutral types (`HandlerCtx`, policy decision types, telemetry trigger types).
- Contract installation helpers (`installOp`, `op`, `makeEmit`).

Do not use this package for framework adapters:

- REST adapters -> `@contractspec/lib.contracts-runtime-server-rest`
- GraphQL adapters -> `@contractspec/lib.contracts-runtime-server-graphql`
- MCP adapters -> `@contractspec/lib.contracts-runtime-server-mcp`
- React runtime rendering -> `@contractspec/lib.contracts-runtime-client-react`
- Integration provider/secret catalogs -> `@contractspec/lib.contracts-integrations`

## Installation

```bash
npm install @contractspec/lib.contracts-spec @contractspec/lib.schema
# or
bun add @contractspec/lib.contracts-spec @contractspec/lib.schema
```

## Core concepts

- `defineCommand` / `defineQuery`: typed operation specs with metadata, I/O schema, policy, transport hints, and side effects.
- `OperationSpecRegistry`: registers specs, binds handlers, and executes with validation/policy/event guards.
- `defineEvent` + `EventRegistry`: typed event contracts and lookup.
- `defineResourceTemplate` + `ResourceRegistry`: URI-template-based resource contracts.
- `FormRegistry`: contract-first form declarations consumed by UI runtimes.
- `installOp`: one-call helper to register + bind operation handlers.
- `makeEmit`: typed helper for declared event emission in handlers.

## Full contract inventory (explicit map)

The package currently exposes **445 subpath exports**. For AI agents and contributors, this section is a concrete map of what exists and where.

### 1) Registry-level contract types (semantic model)

From `src/types.ts`, `ContractSpecType` currently includes:

- `operation`
- `event`
- `presentation`
- `feature`
- `capability`
- `data-view`
- `form`
- `agent`
- `migration`
- `workflow`
- `experiment`
- `integration`
- `theme`
- `knowledge`
- `telemetry`
- `example`
- `app-config`
- `product-intent`
- `policy`
- `test-spec`
- `type`
- `knowledge-space`

### 2) Export/file artifact kinds (suffix-based)

These are the concrete contract artifact kinds visible in this package exports:

- `.capability` (12)
- `.feature` (6)
- `.command` (11)
- `.event` (12)
- `.query` (8)
- `.form` (1)
- `.presentation` (2)
- `.dataView` (3)
- `.docs` (2)
- `.contracts` (1)
- `.docblock` (44)

### 3) Category -> kinds matrix

- `app-config`: `capability(1)`, `contracts(1)`, `feature(1)`, `docblock(1)`, `plain(9)`
- `control-plane`: `capability(5)`, `command(9)`, `event(10)`, `query(6)`, `plain(12)`
- `docs`: `capability(1)`, `command(2)`, `event(2)`, `query(2)`, `form(1)`, `presentation(2)`, `dataView(3)`, `docs(2)`, `docblock(30)`, `plain(21)`
- `integrations`: `capability(4)`, `feature(4)`, `docblock(1)`, `plain(110)`
- `knowledge`: `capability(1)`, `feature(1)`, `docblock(1)`, `plain(25)`
- `capabilities`: `docblock(1)`, `plain(8)`
- `data-views`: `docblock(1)`, `plain(9)`
- `examples`: `docblock(1)`, `plain(7)`
- `experiments`: `docblock(1)`, `plain(3)`
- `forms`: `docblock(1)`, `plain(3)`
- `policy`: `docblock(1)`, `plain(9)`
- `presentations`: `docblock(1)`, `plain(5)`
- `regenerator`: `docblock(1)`, `plain(8)`
- `telemetry`: `docblock(1)`, `plain(5)`
- `workflow`: `docblock(1)`, `plain(14)`
- `workspace-config`: `docblock(1)`, `plain(4)`
- Plain-only categories also exist (for example `operations`, `features`, `jobs`, `llm`, `product-intent`, `translations`, `serialization`, `tests`, `versioning`, etc.)

### 4) Fully enumerated named contracts by category

#### app-config

- Capability: `app-config/app-config.capability`
- Contracts: `app-config/app-config.contracts`
- Feature: `app-config/app-config.feature`

#### control-plane

- Capabilities:
  - `control-plane/capabilities/controlPlaneApproval.capability`
  - `control-plane/capabilities/controlPlaneAudit.capability`
  - `control-plane/capabilities/controlPlaneChannelRuntime.capability`
  - `control-plane/capabilities/controlPlaneCore.capability`
  - `control-plane/capabilities/controlPlaneSkillRegistry.capability`
- Commands:
  - `control-plane/commands/controlPlaneExecutionApprove.command`
  - `control-plane/commands/controlPlaneExecutionCancel.command`
  - `control-plane/commands/controlPlaneExecutionReject.command`
  - `control-plane/commands/controlPlaneExecutionStart.command`
  - `control-plane/commands/controlPlaneIntentSubmit.command`
  - `control-plane/commands/controlPlanePlanCompile.command`
  - `control-plane/commands/controlPlanePlanVerify.command`
  - `control-plane/commands/controlPlaneSkillDisable.command`
  - `control-plane/commands/controlPlaneSkillInstall.command`
- Events:
  - `control-plane/events/controlPlaneExecutionCompleted.event`
  - `control-plane/events/controlPlaneExecutionFailed.event`
  - `control-plane/events/controlPlaneExecutionStepBlocked.event`
  - `control-plane/events/controlPlaneExecutionStepCompleted.event`
  - `control-plane/events/controlPlaneExecutionStepStarted.event`
  - `control-plane/events/controlPlaneIntentReceived.event`
  - `control-plane/events/controlPlanePlanCompiled.event`
  - `control-plane/events/controlPlanePlanRejected.event`
  - `control-plane/events/controlPlaneSkillInstalled.event`
  - `control-plane/events/controlPlaneSkillRejected.event`
- Queries:
  - `control-plane/queries/controlPlaneExecutionGet.query`
  - `control-plane/queries/controlPlaneExecutionList.query`
  - `control-plane/queries/controlPlanePolicyExplain.query`
  - `control-plane/queries/controlPlaneSkillList.query`
  - `control-plane/queries/controlPlaneSkillVerify.query`
  - `control-plane/queries/controlPlaneTraceGet.query`

#### docs

- Capability: `docs/capabilities/documentationSystem.capability`
- Commands:
  - `docs/commands/docsGenerate.command`
  - `docs/commands/docsPublish.command`
- Events:
  - `docs/events/docsGenerated.event`
  - `docs/events/docsPublished.event`
- Queries:
  - `docs/queries/contractReference.query`
  - `docs/queries/docsIndex.query`
- Form: `docs/forms/docsSearch.form`
- Presentations:
  - `docs/presentations/docsLayout.presentation`
  - `docs/presentations/docsReferencePage.presentation`
- Data views:
  - `docs/views/contractReference.dataView`
  - `docs/views/docsIndex.dataView`
  - `docs/views/exampleCatalog.dataView`
- Docs contracts:
  - `docs/meta.docs`
  - `docs/tech-contracts.docs`

#### integrations

- Capabilities:
  - `integrations/integrations.capability`
  - `integrations/health/health.capability`
  - `integrations/meeting-recorder/meeting-recorder.capability`
  - `integrations/openbanking/openbanking.capability`
- Features:
  - `integrations/integrations.feature`
  - `integrations/health/health.feature`
  - `integrations/meeting-recorder/meeting-recorder.feature`
  - `integrations/openbanking/openbanking.feature`

#### knowledge

- Capability: `knowledge/knowledge.capability`
- Feature: `knowledge/knowledge.feature`

### 5) DocBlock coverage map (for AI context retrieval)

`*.docblock` exports are distributed across categories and act as narrative/architecture context assets.

- `docs`: 30 docblocks
- `app-config`: 1
- `capabilities`: 1
- `data-views`: 1
- `examples`: 1
- `experiments`: 1
- `forms`: 1
- `integrations`: 1
- `knowledge`: 1
- `policy`: 1
- `presentations`: 1
- `regenerator`: 1
- `telemetry`: 1
- `workflow`: 1
- `workspace-config`: 1

If you are building AI tooling, these docblocks are often the best first-pass grounding layer before reading implementation files.

## End-to-end quick start

### 1) Define schema models and specs

```ts
import { SchemaModel, ScalarTypeEnum } from "@contractspec/lib.schema";
import {
  defineCommand,
  defineEvent,
  defineQuery,
} from "@contractspec/lib.contracts-spec";

const WorkspaceInput = new SchemaModel({
  name: "WorkspaceInput",
  fields: {
    workspaceId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
  },
});

const WorkspaceOutput = new SchemaModel({
  name: "WorkspaceOutput",
  fields: {
    workspaceId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
  },
});

const WorkspaceCreatedPayload = new SchemaModel({
  name: "WorkspaceCreatedPayload",
  fields: {
    workspaceId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
  },
});

export const WorkspaceCreated = defineEvent({
  meta: {
    key: "workspace.created",
    version: "1.0.0",
    title: "Workspace created",
    description: "Emitted after a workspace is created.",
    stability: "stable",
    owners: ["platform.core"],
    tags: ["workspace", "event"],
  },
  payload: WorkspaceCreatedPayload,
});

export const GetWorkspace = defineQuery({
  meta: {
    key: "workspace.get",
    version: "1.0.0",
    title: "Get workspace",
    description: "Returns workspace metadata for the current tenant.",
    goal: "Expose read-only workspace state to the UI.",
    context: "Used by dashboard bootstrap.",
    stability: "stable",
    owners: ["platform.core"],
    tags: ["workspace", "query"],
  },
  io: { input: WorkspaceInput, output: WorkspaceOutput },
  policy: { auth: "user" },
});

export const CreateWorkspace = defineCommand({
  meta: {
    key: "workspace.create",
    version: "1.0.0",
    title: "Create workspace",
    description: "Creates a new workspace.",
    goal: "Provision a workspace for a tenant.",
    context: "Triggered by onboarding flows.",
    stability: "stable",
    owners: ["platform.core"],
    tags: ["workspace", "command"],
  },
  io: { input: WorkspaceInput, output: WorkspaceOutput },
  policy: { auth: "admin" },
  sideEffects: {
    emits: [{ ref: WorkspaceCreated.meta, when: "after_create" }] as const,
  },
});
```

### 2) Register specs and bind handlers

```ts
import {
  EventRegistry,
  installOp,
  makeEmit,
  OperationSpecRegistry,
} from "@contractspec/lib.contracts-spec";
import {
  CreateWorkspace,
  GetWorkspace,
  WorkspaceCreated,
} from "./workspace.spec";

export const events = new EventRegistry().register(WorkspaceCreated);
export const operations = new OperationSpecRegistry();

installOp(operations, GetWorkspace, async (input) => ({
  workspaceId: input.workspaceId,
  name: "Acme Workspace",
}));

installOp(operations, CreateWorkspace, async (input, ctx) => {
  const result = {
    workspaceId: input.workspaceId,
    name: "Acme Workspace",
  };

  const emit = makeEmit(CreateWorkspace, ctx);
  await emit.ref(WorkspaceCreated, { workspaceId: input.workspaceId });
  return result;
});
```

### 3) Execute from runtime context

```ts
import type { HandlerCtx } from "@contractspec/lib.contracts-spec";
import { operations, events } from "./registry";

const ctx: HandlerCtx = {
  actor: "admin",
  channel: "web",
  eventSpecResolver: events,
  eventPublisher: async (envelope) => {
    console.log("published", envelope.key, envelope.version);
  },
};

const output = await operations.execute(
  "workspace.create",
  "1.0.0",
  { workspaceId: "wk_123" },
  ctx
);

console.log(output);
```

## Execution behavior (why this is AI-friendly)

`OperationSpecRegistry.execute(...)` runs predictable steps:

1. Resolve spec/version.
2. Parse input.
3. Apply policy hooks when provided (`ctx.decide`, `ctx.rateLimit`).
4. Guard event emission against declared side effects.
5. Execute handler.
6. Parse output when output is a schema model.
7. Emit telemetry when configured.

This deterministic contract -> runtime flow is a strong base for code generation and AI-driven refactors.

## AI assistant guidance

When writing code:

- Start here when asked to "add a new operation/event/form/resource contract".
- Keep `meta.key` stable and increment versions for behavior changes.
- Define spec first, then bind handler, then expose transport.

When reading code:

- Treat `<meta.key, meta.version>` as the canonical identity.
- Expect one operation contract to project into multiple transports.

## Split migration from deprecated monolith

- `@contractspec/lib.contracts` -> `@contractspec/lib.contracts-spec`
- `@contractspec/lib.contracts/operations/*` -> `@contractspec/lib.contracts-spec/operations/*`
- `@contractspec/lib.contracts/events` -> `@contractspec/lib.contracts-spec/events`
- `@contractspec/lib.contracts/resources` -> `@contractspec/lib.contracts-spec/resources`
- `@contractspec/lib.contracts/forms/*` -> `@contractspec/lib.contracts-spec/forms/*`

Runtime packages moved out:

- REST runtime -> `@contractspec/lib.contracts-runtime-server-rest`
- GraphQL runtime -> `@contractspec/lib.contracts-runtime-server-graphql`
- MCP runtime -> `@contractspec/lib.contracts-runtime-server-mcp`
- React runtime -> `@contractspec/lib.contracts-runtime-client-react`
- Integration contracts -> `@contractspec/lib.contracts-integrations`
