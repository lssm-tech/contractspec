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
- Typed success/failure/result contracts (`ContractResult`, `ContractSuccess`, `ContractProblem`, `ContractSpecError`) via `@contractspec/lib.contracts-spec/results`.
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
- `ContractResult`: canonical success/failure envelope used by operation, workflow, job, API, MCP, GraphQL, and React runtimes while preserving raw-response compatibility for adapters.
- `defineEvent` + `EventRegistry`: typed event contracts and lookup.
- `defineResourceTemplate` + `ResourceRegistry`: URI-template-based resource contracts.
- `FormRegistry`: contract-first form declarations consumed by UI runtimes, including readonly, email, password, autocomplete, address, phone, date, time, datetime, grouped array authoring, semantic legends/descriptions, grid layout hints, progressive `layout.flow` sections/steps, mobile-safe `responsiveFormColumns(...)`, and text/textarea/email input-group addons through `@contractspec/lib.contracts-spec/forms`.
- `installOp`: one-call helper to register + bind operation handlers.
- `makeEmit`: typed helper for declared event emission in handlers.

FormSpec autocomplete fields support local option filtering or
resolver-backed search through `resolverKey`, dependency paths, debounce, and
minimum-query metadata. The contract stays transport-neutral: host renderers
provide the resolver/fetcher, and value submission is controlled by
`valueMapping` (`scalar`, `object`, or `pick`).

## Typed Results

`@contractspec/lib.contracts-spec/results` is the canonical success/failure
surface for operations, workflows, jobs, API adapters, MCP tools, GraphQL
resolvers, and React clients.

Handlers can keep returning raw output for ordinary `OK` results. Use
`contractOk`, `contractAccepted`, `contractQueued`, `contractNoContent`,
`contractPartial`, and `contractFail` when an operation needs explicit status,
headers, retry metadata, warnings, partial problems, or typed error args.

```ts
import {
  contractAccepted,
  createContractError,
  defineResultCatalog,
  failure,
  standardErrors,
  standardSuccess,
  success,
} from "@contractspec/lib.contracts-spec/results";

const results = defineResultCatalog({
  success: {
    ...standardSuccess.pick("OK", "CREATED"),
    QUEUED_FOR_REVIEW: success.queued<{ reviewId: string }>(),
  },
  errors: {
    ...standardErrors.pick("UNAUTHENTICATED", "FORBIDDEN"),
    INTENT_NOT_FOUND: failure.notFound<{ intentId: string }>({
      description: "The referenced intent does not exist.",
      gqlCode: "INTENT_NOT_FOUND",
    }),
  },
});
```

`OperationSpecRegistry.executeResult(...)` returns a `ContractResult`.
Legacy `execute(...)` remains compatible: it unwraps success data and throws
`ContractSpecError` on failure. Custom success and failure codes should be
declared in `spec.results` or `io.success`/`io.errors`; undeclared custom
failure codes normalize to `INTERNAL_ERROR`.

Adapter defaults:

- REST/Fetch keeps raw success bodies by default and emits failures as
  `application/problem+json`; set `resultEnvelope: true` for `{ ok, data }`
  success envelopes.
- Next.js can use the injected `NextResponse.json(...)` helper from the REST
  runtime.
- NestJS support is exposed as duck-typed exception filter/interceptor helpers
  without adding `@nestjs/common` as a hard dependency.
- GraphQL keeps field success payloads unchanged by default; enable
  `resultExtensions` to collect success metadata, while failures use
  `extensions.contractspec.problem`.
- MCP tools return normal content for success and `isError: true` with a safe
  problem payload for failures.
- React runtime helpers normalize REST, GraphQL, MCP, workflow, job, and legacy
  error shapes into a `ContractResult`.

Migration note: prefer `ContractSpecError`, `createContractError`, and
`contractFail` over `@contractspec/lib.error/AppError`. `@contractspec/lib.error`
is kept as a compatibility bridge.

## Validation And Authoring Entry Points

Recent authoring and setup flows use package-level validation APIs directly instead of relying on ad hoc template or registry assumptions.

- `@contractspec/lib.contracts-spec/app-config/validation`
  - `validateBlueprint`
  - `validateTenantConfig`
  - `validateResolvedConfig`
  - `assertBlueprintValid`
  - `assertTenantConfigValid`
  - `assertResolvedConfigValid`
- `@contractspec/lib.contracts-spec/features/validation`
  - `validateFeatureSpec`
  - `assertFeatureSpecValid`
  - `validateFeatureTargetsV2`
- `@contractspec/lib.contracts-spec/themes.validation`
  - `validateThemeSpec`
  - `assertThemeSpecValid`

These entrypoints are the current public surface for workspace setup, CLI scaffolding, CI, and docs to verify `app-config`, `feature`, and `theme` authoring consistently.

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

## Workspace Config Notes

`@contractspec/lib.contracts-spec/workspace-config` now includes first-class setup support for:

- `connect` configuration
- `connect.adoption` configuration for local catalog paths, workspace scan rules, family toggles, and verdict thresholds
- `builder` configuration with `runtimeMode: "managed" | "local" | "hybrid"`
- canonical Builder bootstrap presets:
  - `managed_mvp`
  - `local_daemon_mvp`
  - `hybrid_mvp`
- Builder API fields:
  - `builder.api.baseUrl`
  - `builder.api.controlPlaneTokenEnvVar`
- Builder local runtime fields:
  - `builder.localRuntime.runtimeId`
  - `builder.localRuntime.grantedTo`
  - `builder.localRuntime.providerIds`
- Published typed entrypoints:
  - `@contractspec/lib.contracts-spec/workspace-config`
  - `@contractspec/lib.contracts-spec/workspace-config/contractsrc-schema`
  - `@contractspec/lib.contracts-spec/workspace-config/contractsrc-types`

Those settings are consumed by the shared setup layer used by the CLI, VS Code extension, and JetBrains plugin.

## Current Authoring Workflow

- Use `defineTheme(...)` plus `contractspec create theme` for first-class theme scaffolding; keep `tokens` as the default/light-compatible bag and add `modes.dark.tokens` for dark-mode overlays.
- Theme color tokens may carry `format` metadata such as `oklch`, with CSS color strings passed through to design-system bridges.
- Route `app-config`, `feature`, and `theme` checks through the package-level validators above when building setup, editor, or CI automation.
- Use `connect.adoption` and the broader authoring-target discovery flows when the CLI or editors should prefer existing workspace or ContractSpec surfaces before scaffolding new code.

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
- `harness-scenario`, `harness-suite`: focused reference [`@contractspec/example.harness-lab`](../../examples/harness-lab/README.md) covering sandbox, Playwright, agent-browser, auth refs, and visual evidence; product/business proof [`@contractspec/example.agent-console`](../../examples/agent-console/README.md)
- `knowledge`, `knowledge-space`, lightweight `app-config`: [`@contractspec/example.knowledge-canon`](../../examples/knowledge-canon/README.md)
- `integration`, `workflow`, integration-oriented `app-config`: [`@contractspec/example.integration-stripe`](../../examples/integration-stripe/README.md)
- `policy`, `form`, `translation`: [`@contractspec/example.locale-jurisdiction-gate`](../../examples/locale-jurisdiction-gate/README.md)
- `product-intent`: [`@contractspec/example.product-intent`](../../examples/product-intent/README.md)
- `experiment`, `theme`: [`@contractspec/example.personalization`](../../examples/personalization/README.md)
- `job`: [`@contractspec/example.openbanking-powens`](../../examples/openbanking-powens/README.md)
- `migration`: [`@contractspec/example.versioned-knowledge-base`](../../examples/versioned-knowledge-base/README.md)
- `telemetry`: [`@contractspec/example.pocket-family-office`](../../examples/pocket-family-office/README.md)

## Data table contract example

The canonical data-table example lives in
[`@contractspec/example.data-grid-showcase`](../../examples/data-grid-showcase/README.md)
and starts with a declarative `DataViewSpec` in this package:

DataView filters now distinguish user-editable filters from scoped constraints.
Use `view.filterScope.initial` to seed removable filters and
`view.filterScope.locked` for constraints that always apply but are not
serialized into URL state. Locked filters render as disabled chips by default
so embedded views, such as a category-scoped posts list, stay explainable while
reusing the same base DataView contract.

```ts
import { defineDataView } from '@contractspec/lib.contracts-spec/data-views';
import { ListDataGridShowcaseRowsQuery } from '@contractspec/example.data-grid-showcase/contracts/data-grid-showcase.operation';

export const DataGridShowcaseDataView = defineDataView({
  meta: {
    key: 'examples.data-grid-showcase.table',
    version: '1.0.0',
    entity: 'account',
    title: 'Data Grid Showcase Table',
    description:
      'Declarative DataViewSpec for the ContractSpec table showcase.',
    domain: 'examples',
    owners: ['@platform.core'],
    tags: ['examples', 'table', 'data-grid'],
    stability: 'experimental',
  },
  source: {
    primary: {
      key: ListDataGridShowcaseRowsQuery.meta.key,
      version: ListDataGridShowcaseRowsQuery.meta.version,
    },
  },
  view: {
    kind: 'table',
    executionMode: 'client',
    selection: 'multiple',
    columnVisibility: true,
    columnResizing: true,
    columnPinning: true,
    rowExpansion: {
      fields: ['notes', 'renewalDate', 'lastActivityAt'],
    },
    initialState: {
      pageSize: 4,
      hiddenColumns: ['notes'],
      pinnedColumns: {
        left: ['account'],
      },
      sorting: [{ field: 'arr', desc: true }],
    },
    fields: [
      { key: 'account', label: 'Account', dataPath: 'account', sortable: true },
      { key: 'owner', label: 'Owner', dataPath: 'owner', sortable: true },
      { key: 'status', label: 'Status', dataPath: 'status', sortable: true },
      { key: 'notes', label: 'Notes', dataPath: 'notes' },
    ],
  },
});
```

See the live example in `/docs/examples/data-grid-showcase` and the browser sandbox in `/sandbox?template=data-grid-showcase`.

## Full contract inventory (explicit map)

<!-- CONTRACT_INVENTORY:START -->

The package currently exposes **397 total exports** in `package.json`, including the root `.` barrel and **396 subpath exports**. This summary is kept here for high-context navigation and AI grounding.

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

### 2) Export/file artifact kinds (suffix-based, subpaths only)

These are the concrete contract artifact kinds visible in package exports:

- `.capability` (17)
- `.feature` (10)
- `.command` (34)
- `.event` (28)
- `.query` (26)
- `.form` (6)
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
- `control-plane`: `capability(5)`, `feature(1)`, `command(15)`, `event(10)`, `query(8)`, `plain(16)`
- `data-views`: `plain(8)`
- `database`: `capability(1)`, `feature(1)`, `query(4)`, `dataView(1)`, `plain(6)`
- `docs`: `capability(1)`, `feature(1)`, `command(2)`, `event(2)`, `query(2)`, `form(1)`, `presentation(2)`, `dataView(3)`, `plain(15)`
- `events`: `plain(1)`
- `examples`: `plain(6)`
- `experiments`: `plain(3)`
- `features`: `plain(6)`
- `forms`: `form(1)`, `plain(2)`
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
- `release`: `plain(1)`
- `resources`: `plain(1)`
- `schema-to-markdown`: `plain(1)`
- `serialization`: `plain(3)`
- `telemetry`: `plain(4)`
- `tests`: `plain(3)`
- `themes`: `plain(1)`
- `themes.validation`: `plain(1)`
- `translations`: `plain(7)`
- `types`: `plain(1)`
- `utils`: `plain(1)`
- `versioning`: `plain(7)`
- `visualizations`: `plain(4)`
- `workflow`: `plain(14)`
- `workspace-config`: `plain(3)`

### 4) DocBlock coverage map (for AI context retrieval)

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
