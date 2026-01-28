## Contracts: Specs, Registry, Handlers, Adapters

### What lives where

- `packages/lssm/libs/contracts` defines the contracts core (OperationSpecRegistry, OperationSpec, PresentationSpec, install helpers, REST/MCP adapters).
- `packages/lssm/libs/schema` defines the schema dictionary (`SchemaModel`, `FieldType`) used to describe I/O once and map to multiple targets (zod, GraphQL, JSON Schema).
- App adapters (e.g. GraphQL) live close to the app. Example: `packages/hcircle/apps/api-coliving/src/graphql/contracts-adapter.ts`.

### npm distribution

- `@contractspec/lib.contracts` (root) keeps the legacy \"everything\" surface for backward compatibility.
- `@contractspec/lib.contracts/client` exposes only browser-safe helpers (React renderers, client SDK, drivers). Import from this entry when bundling for the web or React Native to avoid dragging server adapters.
- `@contractspec/lib.contracts/server` covers HTTP/MCP adapters, registries, integrations, and other Node-only helpers.
- `@contractspec/lib.contracts/types` exports the runtime handler context utilities, while `@contractspec/lib.contracts/types/all` re-exports every type alias/interface across the package via `export type` so consumers can import a single module for typings without shipping runtime code.
- `@contractspec/lib.schema`, `@contractspec/lib.design-system`, `@contractspec/lib.ui-kit`, `@contractspec/lib.ui-kit-web`, `@contractspec/lib.accessibility`, and the presentation runtime packages are published to npm alongside contracts; prefer the scoped packages to keep tree-shaking intact.
- Bundlers with conditional exports should resolve subpaths first; keep root imports for server-only code paths.

### Core concepts

- **OperationSpec**: immutable description of an operation.
  - `meta`: `{ name, version, kind: 'query' | 'command' }`
  - `io`: `{ input: SchemaModel | zod schema, output: SchemaModel | zod schema }`
  - `policy`: `{ auth?: {...}, rateLimit?: {...}, flags?: string[] }`
  - `transport.gql.field?`: explicit GraphQL field name (otherwise derived via `defaultGqlField`).
- **OperationSpecRegistry**: registry of specs + handlers. Use `installOp(reg, spec, handler)` to attach a handler.
- **Handler**: `(ctx, input) => Promise<output>` implementing the operation.
- **CapabilitySpec**: canonical capability declaration stored in `src/capabilities.ts`. Tracks `meta` (`{ key, version, kind, title, description, domain, owners, tags, stability }`), `provides` surfaces (`operation`, `event`, `workflow`, `presentation`, `resource`), and `requires` which other capabilities must be present. Enforced during `installFeature`.
- **PolicySpec**: declarative policy rules (`src/policy/spec.ts`) covering ABAC/ReBAC, consent + rate limit requirements, field-level controls, and PII guidance. `PolicyEngine` evaluates refs, while `OPAPolicyAdapter` lets OPA override/augment runtime decisions.
- **TelemetrySpec**: analytics definitions (`src/telemetry/spec.ts`) describing event semantics, privacy level, retention, sampling, and anomaly detection. `TelemetryTracker` handles redaction/sampling, `TelemetryAnomalyMonitor` raises alerts, and specs integrate with contracts/workflows via `ctx.telemetry`.
- **TestSpec**: declarative scenario definitions in `src/tests/spec.ts`. `TestRunner` executes fixtures/actions/assertions against a `OperationSpecRegistry`, and the CLI (`contractspec test`) wraps the runner for automation.
- **ExperimentSpec**: experiment definitions (`src/experiments/spec.ts`) describing variants, allocation strategies, and success metrics. `ExperimentEvaluator` assigns variants (random/sticky/targeted) and integrates with Policy/Telemetry for safe experimentation.
- **AppBlueprintSpec / TenantAppConfig**: global blueprints and per-tenant overrides (`src/app-config/spec.ts`). `resolveAppConfig()` merges the two into a `ResolvedAppConfig`, while `composeAppConfig()` hydrates the merged view against registries and reports missing references for safe rollout.
- **RegeneratorService**: background daemon (`src/regenerator/service.ts`) that consumes telemetry/error/behavior signals, evaluates regeneration rules, and produces `SpecChangeProposal`s for Studio review.
- **DataViewSpec**: declarative data presentation layer in `src/data-views.ts`. Describes entity projections (`fields`, `filters`, `actions`) with `view.kind` (`list`, `table`, `detail`, `grid`), ties to query operations via `source.primary`, and exposes optional presentation-based empty/error states.
- **ThemeSpec**: design token + component variant definitions in `src/themes.ts`. Supports inheritance (`extends`), tenant/user overrides, and component-specific variant metadata for the design system.
- **MigrationSpec**: schema/data migration descriptors (`src/migrations.ts`) with ordered step plans, dependency tracking, and pre/post checks to support automated database/content migrations.
- **WorkflowSpec**: typed definition of multi-step workflows living in `src/workflow/spec.ts`. `WorkflowRegistry` stores versioned specs, and `validateWorkflowSpec()` (in `src/workflow/validation.ts`) checks graph integrity, step references, and reachability.

### Lifecycle

1. Define the spec (I/O via `SchemaModel` or zod) in a vertical lib (e.g. `contracts-coliving`).
2. Register it: `installOp(registry, spec, handler)` within the app/service.
3. Expose it via an adapter (REST, GraphQL, MCP). Each adapter maps the I/O to its transport and enforces policy.
4. Validate at runtime: parse `input` before executing, parse `output` before returning.

### Adapters

- **REST**: see `packages/lssm/libs/contracts/src/server/rest-*`. Binds routes, validates request/response, maps errors/policies.
- **MCP**: see `packages/lssm/libs/contracts/src/server/provider-mcp.ts` (standalone MCP server) and `packages/lssm/libs/contracts/src/server/rest-next-mcp.ts` (MCP over Next.js route). Provides tools/resources/prompts.
  - Tools + resources are registered from Zod schemas.
  - Resource templates are keyed by full `ResourceMeta.uriTemplate` (e.g. `docs://list`, `docs://doc/{id}`), so multiple templates can share a scheme (`docs://*`) without collisions.
- **GraphQL (Pothos)**: see `packages/lssm/libs/contracts/src/server/graphql-pothos.ts`. Adds Query/Mutation fields by transforming contract I/O to GraphQL types.

### GraphQL adapter behaviour (summary)

- Field naming: `spec.transport.gql.field` or `<name_with_dots>_v<version>`.
- Input/Output types from `SchemaModel` (preferred) or fallback zod introspection.
- Scalars: String/Int/Float/Boolean/Date/JSON; Objects/Arrays/Enums; unions for outputs; input unions => JSON.
- Policy: auth gate checks GraphQL context; optional feature flag gating.
- Complexity & tracing: attaches hints and records timings; log includes `{ specName, version }`.

#### Returns mapping and hydration

- `spec.transport.gql.returns` can declare the GraphQL return wrapper: e.g. `"Spot"` or `[Spot]`. If omitted, the adapter infers from `io.output` (SchemaModel) or `resourceRef.graphQLType`.
- Resource outputs: when `io.output` is a `resourceRef(...)` or `transport.gql.resource` is set, the adapter will optionally hydrate via a `ResourceRegistry` using `contracts-adapter-hydration.ts`:
  - Grammar is parsed with `parseReturns()`.
  - Entities are resolved via `hydrateResourceIfNeeded(resources, result, { template, varName, returns })` after handler execution.

### Resource outputs

- Declare resource outputs using `resourceRef(uriTemplate, opts)`.
- `opts.varName` (default `id`) selects the identifier field returned by the handler for URI substitution.
- `opts.graphQLType` is the GraphQL return type name (e.g., `Spot`) or list form (e.g., `[Spot]`).
- `opts.many: true` indicates the handler returns an array of resources. The handler type becomes an array of items that include the identifier field.

Example:

```ts
io: {
  input: ListThingsInput,
  output: resourceRef('myapp://thing/{id}', { graphQLType: '[Thing]', many: true }),
}
```

Handler return (simplified): `{ id: string | number }[]`.

### Errors

- Validation errors → transport 400/GraphQL UserInputError.
- Policy/auth errors → 401/403 or GraphQL ForbiddenError.
- Handler errors → mapped to transport error with safe message.

### Versioning & naming

- Keep `meta.version` monotonic. Clients should pin to a versioned field/key.
- Avoid renaming existing fields; add new fields with new versions.

### Ownership metadata (OwnerShipMeta)

All contracts, events, features, and presentations reference a shared ownership schema (source of truth in `packages/lssm/libs/contracts/src/ownership.ts`).

- Required fields: `title`, `description`, `domain`, `owners[]`, `tags[]`, `stability`.
- Curated enums: the library exports suggested constants for owners and tags; free-form strings are still allowed for forward-compatibility.
- Operations (`spec.ts`): `meta` requires `stability`, `owners`, and `tags` alongside `name`, `version`, `kind`, `description`, `goal`, and `context`.
- Presentations V2: `meta` is a partial of ownership plus `description`.
- Events: may specify `ownership` (recommended) for discoverability and docs.

### Quick start

```ts
// app bootstrap
const reg = new OperationSpecRegistry();
installOp(reg, BeginSignupSpec, beginSignupHandler);
registerContractsOnBuilder(gqlSchemaBuilder, reg); // GraphQL
// or: createRestRouter(reg) // REST
```
