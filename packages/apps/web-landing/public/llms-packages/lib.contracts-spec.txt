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
- Agent definition contracts (`defineAgent`, `AgentRegistry`, `AgentSpec`, `AgentToolConfig`).
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
- `defineAgent` + `AgentRegistry`: typed agent-definition contracts that runtime packages execute, export, or adapt.
- `OperationSpecRegistry`: registers specs, binds handlers, and executes with validation/policy/event guards.
- `defineEvent` + `EventRegistry`: typed event contracts and lookup.
- `defineResourceTemplate` + `ResourceRegistry`: URI-template-based resource contracts.
- `FormRegistry`: contract-first form declarations consumed by UI runtimes.
- `installOp`: one-call helper to register + bind operation handlers.
- `makeEmit`: typed helper for declared event emission in handlers.

## Agent Definitions

Agent declarations now live in `@contractspec/lib.contracts-spec/agent`.

```ts
import { AgentRegistry, defineAgent } from "@contractspec/lib.contracts-spec/agent";

const SupportBot = defineAgent({
  meta: {
    key: "support.bot",
    version: "1.0.0",
    description: "Customer support assistant",
    owners: ["support"],
    tags: ["support"],
    stability: "experimental",
  },
  instructions: "Resolve tickets and escalate low-confidence cases.",
  tools: [{ name: "support.resolve" }],
});

const registry = new AgentRegistry().register(SupportBot);
```

Runtime execution, exporters, MCP bridges, and provider adapters stay in
`@contractspec/lib.ai-agent`.

## Migration Note

If you previously imported agent-definition contracts from
`@contractspec/lib.ai-agent/spec`, migrate to:

- `@contractspec/lib.contracts-spec/agent`
- `@contractspec/lib.contracts-spec/agent/spec`
- `@contractspec/lib.contracts-spec/agent/registry`

## Bundle requires alignment

When using `@contractspec/lib.surface-runtime`, bundle specs declare required features via `ModuleBundleSpec.requires` (e.g. `{ key: 'ai-chat', version: '1.0.0' }`). These entries should match `FeatureModuleSpec.meta` from `defineFeature`. Register features (e.g. `AiChatFeature` from `@contractspec/module.ai-chat`) in a `FeatureRegistry` when validating bundle requirements. The bundle runtime can call `registry.get(key)` to verify each required feature exists before resolution.

## Canonical self-contained examples by contract type

Use these example packages when you want one focused, importable reference per contract layer. `knowledge` and `type` are covered through the exported knowledge bindings/source configs and schema models. `agent` definitions now live directly in this package via `@contractspec/lib.contracts-spec/agent`.

- `operation`, `feature`, `example`, `type`: [`@contractspec/example.minimal`](../../examples/minimal/README.md)
- `event`, `presentation`, `capability`, `test-spec`: [`@contractspec/example.workflow-system`](../../examples/workflow-system/README.md)
- `data-view`: [`@contractspec/example.data-grid-showcase`](../../examples/data-grid-showcase/README.md)
- `visualization`: [`@contractspec/example.visualization-showcase`](../../examples/visualization-showcase/README.md)
- `agent`: [`@contractspec/example.agent-console`](../../examples/agent-console/README.md)
- `harness-scenario`, `harness-suite`: focused reference [`@contractspec/example.harness-lab`](../../examples/harness-lab/README.md), product/business proof [`@contractspec/example.agent-console`](../../examples/agent-console/README.md)
- `knowledge`, `knowledge-space`, lightweight `app-config`: [`@contractspec/example.knowledge-canon`](../../examples/knowledge-canon/README.md)
- `integration`, `workflow`, integration-oriented `app-config`: [`@contractspec/example.integration-stripe`](../../examples/integration-stripe/README.md)
- `policy`, `form`, `translation`: [`@contractspec/example.locale-jurisdiction-gate`](../../examples/locale-jurisdiction-gate/README.md)
- `product-intent`: [`@contractspec/example.product-intent`](../../examples/product-intent/README.md)
- `experiment`, `theme`: [`@contractspec/example.personalization`](../../examples/personalization/README.md)
- `job`: [`@contractspec/example.openbanking-powens`](../../examples/openbanking-powens/README.md)
- `migration`: [`@contractspec/example.versioned-knowledge-base`](../../examples/versioned-knowledge-base/README.md)
- `telemetry`: [`@contractspec/example.pocket-family-office`](../../examples/pocket-family-office/README.md)

## Full contract inventory (explicit map)

<!-- CONTRACT_INVENTORY:START -->

The package currently exposes **375 subpath exports**. This map is auto-generated for high-context navigation and AI grounding.

> Auto-generated by `bun run readme:inventory` (`scripts/update-readme-contract-inventory.ts`). Do not edit this section manually.

### 1) Registry-level contract types (semantic model)

From `src/types.ts`, `ContractSpecType` currently includes:

- `agent`
- `app-config`
- `capability`
- `data-view`
- `event`
- `example`
- `experiment`
- `feature`
- `form`
- `harness-scenario`
- `harness-suite`
- `integration`
- `job`
- `knowledge`
- `knowledge-space`
- `migration`
- `operation`
- `policy`
- `presentation`
- `product-intent`
- `telemetry`
- `test-spec`
- `theme`
- `translation`
- `type`
- `visualization`
- `workflow`

### 2) Export/file artifact kinds (suffix-based)

These are the concrete contract artifact kinds visible in package exports:

- `.capability` (17)
- `.feature` (10)
- `.command` (28)
- `.event` (28)
- `.query` (24)
- `.form` (5)
- `.presentation` (6)
- `.dataView` (11)
- `.docs` (0)
- `.contracts` (1)
- `.docblock` (0)

### 3) Category -> kinds matrix

- `acp`: `capability(1)`, `feature(1)`, `command(7)`, `plain(5)`
- `agent`: `capability(1)`, `feature(1)`, `command(3)`, `event(4)`, `query(2)`, `form(1)`, `presentation(1)`, `dataView(1)`, `plain(12)`
- `app-config`: `capability(1)`, `feature(1)`, `contracts(1)`, `plain(9)`
- `capabilities`: `plain(7)`
- `context`: `capability(1)`, `feature(1)`, `command(1)`, `event(1)`, `query(2)`, `form(1)`, `presentation(1)`, `dataView(1)`, `plain(10)`
- `contract-registry`: `plain(3)`
- `control-plane`: `capability(5)`, `feature(1)`, `command(9)`, `event(10)`, `query(6)`, `plain(13)`
- `data-views`: `plain(8)`
- `database`: `capability(1)`, `feature(1)`, `query(4)`, `dataView(1)`, `plain(6)`
- `docs`: `capability(1)`, `feature(1)`, `command(2)`, `event(2)`, `query(2)`, `form(1)`, `presentation(2)`, `dataView(3)`, `plain(12)`
- `events`: `plain(1)`
- `examples`: `plain(6)`
- `experiments`: `plain(3)`
- `features`: `plain(6)`
- `forms`: `plain(2)`
- `harness`: `capability(4)`, `feature(1)`, `command(3)`, `event(8)`, `query(5)`, `presentation(1)`, `dataView(3)`, `plain(11)`
- `install`: `plain(1)`
- `jobs`: `plain(4)`
- `jsonschema`: `plain(1)`
- `knowledge`: `capability(1)`, `feature(1)`, `plain(12)`
- `llm`: `plain(4)`
- `markdown`: `plain(1)`
- `migrations`: `plain(1)`
- `model-registry`: `plain(1)`
- `onboarding-base`: `plain(1)`
- `openapi`: `plain(1)`
- `operations`: `plain(5)`
- `ownership`: `plain(1)`
- `policy`: `plain(8)`
- `presentations`: `plain(4)`
- `product-intent`: `plain(16)`
- `prompt`: `plain(1)`
- `promptRegistry`: `plain(1)`
- `provider-ranking`: `capability(1)`, `feature(1)`, `command(3)`, `event(3)`, `query(3)`, `form(2)`, `presentation(1)`, `dataView(2)`, `plain(10)`
- `regenerator`: `plain(7)`
- `registry`: `plain(1)`
- `registry-utils`: `plain(1)`
- `resources`: `plain(1)`
- `schema-to-markdown`: `plain(1)`
- `serialization`: `plain(3)`
- `telemetry`: `plain(4)`
- `tests`: `plain(3)`
- `themes`: `plain(1)`
- `translations`: `plain(7)`
- `types`: `plain(1)`
- `utils`: `plain(1)`
- `versioning`: `plain(4)`
- `visualizations`: `plain(4)`
- `workflow`: `plain(12)`
- `workspace-config`: `plain(3)`

### 4) Fully enumerated named contracts by category

#### acp

- Capabilities (1):
  - `acp/capabilities/acpTransport.capability`
- Features (1):
  - `acp/acp.feature`
- Commands (7):
  - `acp/commands/acpFsAccess.command`
  - `acp/commands/acpPromptTurn.command`
  - `acp/commands/acpSessionInit.command`
  - `acp/commands/acpSessionResume.command`
  - `acp/commands/acpSessionStop.command`
  - `acp/commands/acpTerminalExec.command`
  - `acp/commands/acpToolCalls.command`
- Plain exports (non-suffix artifacts): `5`

#### agent

- Capabilities (1):
  - `agent/capabilities/agentExecution.capability`
- Features (1):
  - `agent/agent.feature`
- Commands (3):
  - `agent/commands/agentApprovals.command`
  - `agent/commands/agentCancel.command`
  - `agent/commands/agentRun.command`
- Events (4):
  - `agent/events/agentApprovalRequested.event`
  - `agent/events/agentRunCompleted.event`
  - `agent/events/agentRunFailed.event`
  - `agent/events/agentRunStarted.event`
- Queries (2):
  - `agent/queries/agentArtifacts.query`
  - `agent/queries/agentStatus.query`
- Forms (1):
  - `agent/forms/agentRun.form`
- Presentations (1):
  - `agent/presentations/agentRunAudit.presentation`
- Data views (1):
  - `agent/views/agentRuns.dataView`
- Plain exports (non-suffix artifacts): `12`

#### app-config

- Capabilities (1):
  - `app-config/app-config.capability`
- Features (1):
  - `app-config/app-config.feature`
- Contracts artifacts (1):
  - `app-config/app-config.contracts`
- Plain exports (non-suffix artifacts): `9`

#### capabilities

- Plain exports (non-suffix artifacts): `13`

#### context

- Capabilities (1):
  - `context/capabilities/contextSystem.capability`
- Features (1):
  - `context/context.feature`
- Commands (1):
  - `context/commands/contextPackSnapshot.command`
- Events (1):
  - `context/events/contextSnapshotCreated.event`
- Queries (2):
  - `context/queries/contextPackDescribe.query`
  - `context/queries/contextPackSearch.query`
- Forms (1):
  - `context/forms/contextPackSearch.form`
- Presentations (1):
  - `context/presentations/contextSnapshot.presentation`
- Data views (1):
  - `context/views/contextSnapshots.dataView`
- Plain exports (non-suffix artifacts): `10`

#### contract-registry

- Plain exports (non-suffix artifacts): `3`

#### control-plane

- Capabilities (5):
  - `control-plane/capabilities/controlPlaneApproval.capability`
  - `control-plane/capabilities/controlPlaneAudit.capability`
  - `control-plane/capabilities/controlPlaneChannelRuntime.capability`
  - `control-plane/capabilities/controlPlaneCore.capability`
  - `control-plane/capabilities/controlPlaneSkillRegistry.capability`
- Features (1):
  - `control-plane/control-plane.feature`
- Commands (9):
  - `control-plane/commands/controlPlaneExecutionApprove.command`
  - `control-plane/commands/controlPlaneExecutionCancel.command`
  - `control-plane/commands/controlPlaneExecutionReject.command`
  - `control-plane/commands/controlPlaneExecutionStart.command`
  - `control-plane/commands/controlPlaneIntentSubmit.command`
  - `control-plane/commands/controlPlanePlanCompile.command`
  - `control-plane/commands/controlPlanePlanVerify.command`
  - `control-plane/commands/controlPlaneSkillDisable.command`
  - `control-plane/commands/controlPlaneSkillInstall.command`
- Events (10):
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
- Queries (6):
  - `control-plane/queries/controlPlaneExecutionGet.query`
  - `control-plane/queries/controlPlaneExecutionList.query`
  - `control-plane/queries/controlPlanePolicyExplain.query`
  - `control-plane/queries/controlPlaneSkillList.query`
  - `control-plane/queries/controlPlaneSkillVerify.query`
  - `control-plane/queries/controlPlaneTraceGet.query`
- Plain exports (non-suffix artifacts): `7`

#### data-views

- Plain exports (non-suffix artifacts): `8`

#### database

- Capabilities (1):
  - `database/capabilities/databaseContext.capability`
- Features (1):
  - `database/database.feature`
- Queries (4):
  - `database/queries/databaseDictionaryGet.query`
  - `database/queries/databaseMigrationsList.query`
  - `database/queries/databaseQueryReadonly.query`
  - `database/queries/databaseSchemaDescribe.query`
- Data views (1):
  - `database/views/databaseSchemas.dataView`
- Plain exports (non-suffix artifacts): `6`

#### docs

- Capabilities (1):
  - `docs/capabilities/documentationSystem.capability`
- Features (1):
  - `docs/docs.feature`
- Commands (2):
  - `docs/commands/docsGenerate.command`
  - `docs/commands/docsPublish.command`
- Events (2):
  - `docs/events/docsGenerated.event`
  - `docs/events/docsPublished.event`
- Queries (2):
  - `docs/queries/contractReference.query`
  - `docs/queries/docsIndex.query`
- Forms (1):
  - `docs/forms/docsSearch.form`
- Presentations (2):
  - `docs/presentations/docsLayout.presentation`
  - `docs/presentations/docsReferencePage.presentation`
- Data views (3):
  - `docs/views/contractReference.dataView`
  - `docs/views/docsIndex.dataView`
  - `docs/views/exampleCatalog.dataView`
- Plain exports (non-suffix artifacts): `12`

#### events

- Plain exports (non-suffix artifacts): `1`

#### examples

- Plain exports (non-suffix artifacts): `6`

#### experiments

- Plain exports (non-suffix artifacts): `3`

#### features

- Plain exports (non-suffix artifacts): `6`

#### forms

- Plain exports (non-suffix artifacts): `2`

#### harness

- Capabilities (4):
  - `harness/capabilities/harnessEvaluation.capability`
  - `harness/capabilities/harnessEvidence.capability`
  - `harness/capabilities/harnessExecution.capability`
  - `harness/capabilities/harnessTargeting.capability`
- Features (1):
  - `harness/harness.feature`
- Commands (3):
  - `harness/commands/harnessEvaluationRun.command`
  - `harness/commands/harnessRunCancel.command`
  - `harness/commands/harnessRunStart.command`
- Events (8):
  - `harness/events/harnessEvaluationCompleted.event`
  - `harness/events/harnessEvidenceCaptured.event`
  - `harness/events/harnessRunCompleted.event`
  - `harness/events/harnessRunFailed.event`
  - `harness/events/harnessRunStarted.event`
  - `harness/events/harnessStepBlocked.event`
  - `harness/events/harnessStepCompleted.event`
  - `harness/events/harnessStepStarted.event`
- Queries (5):
  - `harness/queries/harnessEvaluationGet.query`
  - `harness/queries/harnessEvidenceGet.query`
  - `harness/queries/harnessEvidenceList.query`
  - `harness/queries/harnessRunGet.query`
  - `harness/queries/harnessTargetResolve.query`
- Presentations (1):
  - `harness/presentations/harnessRunAudit.presentation`
- Data views (3):
  - `harness/views/harnessEvaluations.dataView`
  - `harness/views/harnessEvidence.dataView`
  - `harness/views/harnessRuns.dataView`
- Plain exports (non-suffix artifacts): `11`

#### install

- Plain exports (non-suffix artifacts): `1`

#### jobs

- Plain exports (non-suffix artifacts): `4`

#### jsonschema

- Plain exports (non-suffix artifacts): `1`

#### knowledge

- Capabilities (1):
  - `knowledge/knowledge.capability`
- Features (1):
  - `knowledge/knowledge.feature`
- Plain exports (non-suffix artifacts): `12`

#### llm

- Plain exports (non-suffix artifacts): `4`

#### markdown

- Plain exports (non-suffix artifacts): `1`

#### migrations

- Plain exports (non-suffix artifacts): `1`

#### model-registry

- Plain exports (non-suffix artifacts): `1`

#### onboarding-base

- Plain exports (non-suffix artifacts): `1`

#### openapi

- Plain exports (non-suffix artifacts): `1`

#### operations

- Plain exports (non-suffix artifacts): `5`

#### ownership

- Plain exports (non-suffix artifacts): `1`

#### policy

- Plain exports (non-suffix artifacts): `8`

#### presentations

- Plain exports (non-suffix artifacts): `4`

#### product-intent

- Plain exports (non-suffix artifacts): `16`

#### prompt

- Plain exports (non-suffix artifacts): `1`

#### promptRegistry

- Plain exports (non-suffix artifacts): `1`

#### provider-ranking

- Capabilities (1):
  - `provider-ranking/capabilities/providerRanking.capability`
- Features (1):
  - `provider-ranking/provider-ranking.feature`
- Commands (3):
  - `provider-ranking/commands/benchmarkIngest.command`
  - `provider-ranking/commands/benchmarkRunCustom.command`
  - `provider-ranking/commands/rankingRefresh.command`
- Events (3):
  - `provider-ranking/events/benchmarkCustomCompleted.event`
  - `provider-ranking/events/benchmarkIngested.event`
  - `provider-ranking/events/rankingUpdated.event`
- Queries (3):
  - `provider-ranking/queries/benchmarkResultsList.query`
  - `provider-ranking/queries/modelProfileGet.query`
  - `provider-ranking/queries/providerRankingGet.query`
- Forms (2):
  - `provider-ranking/forms/benchmarkIngest.form`
  - `provider-ranking/forms/benchmarkRunCustom.form`
- Presentations (1):
  - `provider-ranking/presentations/modelComparison.presentation`
- Data views (2):
  - `provider-ranking/views/benchmarkResults.dataView`
  - `provider-ranking/views/providerRankings.dataView`
- Plain exports (non-suffix artifacts): `10`

#### regenerator

- Plain exports (non-suffix artifacts): `7`

#### registry

- Plain exports (non-suffix artifacts): `1`

#### registry-utils

- Plain exports (non-suffix artifacts): `1`

#### resources

- Plain exports (non-suffix artifacts): `1`

#### schema-to-markdown

- Plain exports (non-suffix artifacts): `1`

#### serialization

- Plain exports (non-suffix artifacts): `3`

#### telemetry

- Plain exports (non-suffix artifacts): `4`

#### tests

- Plain exports (non-suffix artifacts): `3`

#### themes

- Plain exports (non-suffix artifacts): `1`

#### translations

- Plain exports (non-suffix artifacts): `7`

#### types

- Plain exports (non-suffix artifacts): `1`

#### utils

- Plain exports (non-suffix artifacts): `1`

#### versioning

- Plain exports (non-suffix artifacts): `4`

#### visualizations

- Plain exports (non-suffix artifacts): `4`

#### workflow

- Plain exports (non-suffix artifacts): `12`

#### workspace-config

- Plain exports (non-suffix artifacts): `3`

### 5) DocBlock coverage map (for AI context retrieval)

DocBlocks are authored as same-file exports in their owner modules and loaded through generated manifests, not standalone `*.docblock` package exports.


<!-- CONTRACT_INVENTORY:END -->

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
