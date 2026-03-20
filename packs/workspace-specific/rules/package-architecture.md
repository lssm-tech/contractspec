---
targets:
  - '*'
root: false
description: 'Governs package responsibilities, dependency direction, and UI layering across the ContractSpec monorepo.'
globs:
  - '**/*'
cursor:
  alwaysApply: true
  description: 'Governs package responsibilities, dependency direction, and UI layering across the ContractSpec monorepo.'
  globs:
    - '**/*'
---

# Package Architecture & Dependency Flow

"Put code in the lowest layer that can honestly own it. Libs define primitives, integrations connect them to real runtimes, modules shape feature domains, bundles compose broader product surfaces, and apps stay thin."

## Core Principles

- **Spec-first layering**: Contracts and shared execution primitives live in reusable lower layers before product shells and demos.
- **Downward dependency flow**: Higher layers may depend on lower layers; lower layers must not depend upward on product shells.
- **Thin apps**: Deployable apps wire transports, routing, and platform concerns around lower-layer behavior.
- **Explicit runtime bridges**: Provider, browser, sandbox, MCP, and other runtime-specific code belongs in integrations or app shells, not core libs.
- **Composable UI**: Shared UI primitives live in the design system and UI kits; product bundles and apps should compose them rather than rebuilding them ad hoc.

## Package Responsibilities

### 1. `packages/libs/` — Core Contracts, Runtimes, and Shared Primitives

**Purpose**: Shared foundations such as contracts, registries, runtimes, agent systems, schema helpers, design primitives, and cross-cutting utilities.

**Examples**:

```text
libs/
├── contracts-spec/        # Contract declarations, registries, capabilities
├── contracts-runtime-*/   # REST, GraphQL, MCP, and client runtime adapters
├── ai-agent/              # Agent runtime, sessions, tools, memory, telemetry
├── surface-runtime/       # Bundle/spec runtime, planners, patching, React support
├── harness/               # Evaluation, policy, evidence, replay core
├── schema/                # Shared schema model and validation primitives
├── design-system/         # Shared design tokens and components
├── ui-kit*/               # Cross-platform and platform-specific UI kits
└── observability/         # Logging, metrics, tracing, analytics helpers
```

**What goes here**:

- Public contracts, registries, and shared types
- Runtime primitives that must work across multiple higher-level packages
- Shared UI, schema, telemetry, and infrastructure helpers
- Low-level evaluation, orchestration, or policy engines

**What does not go here**:

- App routing, page shells, or deployment bootstraps
- Product-specific composition that only makes sense in one app or bundle
- Provider- or transport-specific glue when it depends on concrete runtimes

### 2. `packages/integrations/` — Concrete Runtime & Provider Bridges

**Purpose**: Bridges between generic libs and concrete execution environments, providers, and runtime targets.

**Examples**:

```text
integrations/
├── runtime/               # Runtime composition helpers
├── providers-impls/       # Concrete provider implementations
├── harness-runtime/       # Browser, sandbox, artifact, MCP harness adapters
└── example-generator/     # Example generation integration helpers
```

**What goes here**:

- Adapters that bind core libs to concrete runtimes or providers
- Runtime target resolution and environment-aware wrappers
- Optional heavier integrations that lower layers should not require directly

**What does not go here**:

- Foundational contracts and generic orchestration primitives
- App-specific transport or deployment code
- Product UI composition

### 3. `packages/modules/` — Domain & Feature Modules

**Purpose**: Reusable feature/domain packages that compose libs and integrations into coherent product surfaces.

**Examples**:

```text
modules/
├── ai-chat/               # Packaged chat feature surface
├── provider-ranking/      # Ranking orchestration and storage-facing surfaces
├── learning-journey/      # Learning journey features and track contracts
├── notifications/         # Notification templates, channels, contracts
└── workspace/             # Workspace-oriented module composition
```

**What goes here**:

- Feature-level orchestration and domain-focused public surfaces
- Capability, feature, entity, storage, and pipeline composition
- Module-level documentation and reusable entrypoints consumed by bundles/apps

**What does not go here**:

- Generic utilities that could live in libs
- Final app routing, web pages, or transport bootstraps
- One-off example/demo logic

### 4. `packages/bundles/` — Product Composition Layers

**Purpose**: Higher-level product composition that brings together modules, integrations, and libs for broad product surfaces.

**Examples**:

```text
bundles/
├── workspace/             # CLI/editor/repo workflow composition
├── library/               # Docs, templates, MCP, and reusable product surfaces
├── marketing/             # Marketing and website composition
├── lifecycle-managed/     # Lifecycle-managed composition
└── product-intent/        # Product-intent composition surfaces
```

**What goes here**:

- Product-facing orchestration across multiple modules and libs
- Reusable presentation composition for apps and websites
- Bundle-local service layers, composition registries, and high-level exports

**What does not go here**:

- App bootstraps, deployment wrappers, or route-only code
- Generic primitives that are reusable without product context

### 5. `packages/examples/` — Runnable & Importable Reference Implementations

**Purpose**: Concrete examples that demonstrate how the lower layers are composed in realistic scenarios.

**What goes here**:

- Feature demos, integration examples, mini-apps, and example registries
- Runnable examples used by docs, templates, and onboarding flows
- Example-only handlers, demo data, and UI composition

**What does not go here**:

- Foundational production primitives that other packages should depend on directly
- Cross-repo tooling or canonical product logic

### 6. `packages/apps/` and `packages/apps-registry/` — Deployable Entry Points

**Purpose**: Thin deployable shells such as CLIs, APIs, MCP servers, websites, mobile apps, and registry apps.

**Examples**:

```text
apps/
├── cli-contractspec/      # Main CLI
├── web-landing/           # Next.js marketing/docs/app shell
├── mobile-demo/           # Expo reference app
├── provider-ranking-mcp/  # MCP server for provider ranking
├── registry-packs/        # Agentpacks registry server
└── registry-server/       # ContractSpec registry server
```

**What goes here**:

- Routing, transport startup, framework bootstraps, and deployment wiring
- Shell-level composition of bundles/modules/libs
- App-only middleware, startup, and external delivery concerns

**What does not go here**:

- Shared domain rules that multiple apps need
- Generic provider/runtime bridges that belong in integrations
- Shared UI composition that belongs in bundles or libs

### 7. `packages/tools/` — Repository and Downstream Tooling

**Purpose**: Build, docs, config, generation, and agent-tooling packages used in this repo and by downstream consumers.

**Examples**:

```text
tools/
├── agentpacks/            # Pack-based agent config generation
├── biome-config/          # Typed lint-policy package and generated presets
├── docs-generator/        # Documentation generation tooling
├── create-contractspec-plugin/
└── bun/, tsdown/, typescript/
```

**What goes here**:

- CLI tooling, config generators, preset packages, repo automation helpers
- Generated-artifact pipelines and repository-wide build helpers

**What does not go here**:

- Product runtime behavior that belongs in libs/modules/bundles/apps

## Dependency Flow

**Default direction**:

```text
apps/apps-registry
        ↓
      bundles
        ↓
modules ← integrations
   ↓         ↓
        libs

examples may depend on libs, integrations, modules, and bundles
tools may support every layer, but runtime packages should not depend on apps
```

| From | To | Allowed? | Notes |
| --- | --- | --- | --- |
| apps / apps-registry | bundles, modules, integrations, libs | ✅ | Apps stay thin and compose lower layers. |
| bundles | modules, integrations, libs | ✅ | Bundles compose lower-level surfaces into broader product packages. |
| modules | integrations, libs | ✅ | Modules build feature/domain surfaces on reusable primitives. |
| integrations | libs | ✅ | Integrations wrap or bind generic primitives to concrete targets. |
| examples | bundles, modules, integrations, libs | ✅ | Examples are allowed to demonstrate the stack. |
| libs | modules, bundles, apps | ❌ | Foundational libs must not depend upward. |
| integrations | modules, bundles, apps | ❌ | Keep bridges reusable and downward-facing. |
| modules | bundles, apps | ❌ | Modules should stay reusable outside specific shells. |
| bundles | apps | ❌ | App shells own delivery concerns. |

## UI Layering

When working on UI, prefer the highest reusable layer that already exists:

1. **Product-specific reusable composition** in bundles or example-shared packages
2. **Design-system components** from `@contractspec/lib.design-system`
3. **UI kit components** from `@contractspec/lib.ui-kit`, `@contractspec/lib.ui-kit-web`, or React Native equivalents

Use raw platform elements only when you are explicitly building lower-level design-system or UI-kit primitives.

## Placement Heuristics

- If a package exports shared types, registries, or runtime primitives used across many features, it probably belongs in `libs/`.
- If the code mainly adapts core behavior to a concrete runtime, provider, browser, sandbox, or protocol target, it probably belongs in `integrations/`.
- If the package defines a reusable feature/domain surface with contracts, pipelines, entities, and storage/public entrypoints, it probably belongs in `modules/`.
- If the package composes multiple modules/libs into a broader product surface used by apps, it probably belongs in `bundles/`.
- If the code is mostly routing, transport startup, or shell composition, it belongs in an app.
- If the package exists to teach, demo, or validate the stack, it belongs in `examples/`.
- If it mainly generates config, presets, docs, or repo automation output, it belongs in `tools/`.
