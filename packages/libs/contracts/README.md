## @lssm/lib.contracts — Unified Specs for Ops, Events, Presentations, and Features

Purpose: Provide a single, typed source of truth for backend operations, events, prompts/resources, and UI/data presentations. This enables consistent adapters (REST/GraphQL/MCP/UI), high‑quality docs, and agent-friendly automation across apps.

### Installation

```bash
npm install @lssm/lib.contracts @lssm/lib.schema
# or
bun add @lssm/lib.contracts @lssm/lib.schema
```

Import from the scoped entry points for leaner bundles:

- `@lssm/lib.contracts/client` – browser-safe helpers (`client/react`, render drivers, SDK).
- `@lssm/lib.contracts/server` – Node adapters (REST, GraphQL, MCP).
- `@lssm/lib.contracts/types` – runtime context types (`HandlerCtx`, `PolicyDecision`, etc.).
- `@lssm/lib.contracts/types/all` – type-only re-exports across the package (compiles to an empty JS module).

### Today (already implemented)

- **Operations (ContractSpec)**: versioned `command`/`query` definitions with `meta`, `io` (zod-backed via `@lssm/lib.schema`), `policy`, `sideEffects` (declared events), `transport` hints, and `acceptance` examples. See `src/spec.ts` and `src/registry.ts`.
- **Events (EventSpec)**: versioned event payloads validated at publish time and guarded from undeclared emission. See `src/events.ts` and runtime guard in `SpecRegistry.execute()`.
- **Adapters**:
  - REST: `server/rest-generic`, `server/rest-next-app`, `server/rest-next-pages`, `server/rest-elysia`.
  - MCP: `server/provider-mcp` (tools, resources, prompts), `server/rest-next-mcp` (MCP via Next route).
  - GraphQL: `server/graphql-pothos` to mount contract operations into a Pothos schema.
  - Docs: `markdown.specsToMarkdown(reg)` and `markdown.docsToMarkdown(reg, { presentations, features })` to render human docs.

### Next (this document proposes)

Add a first-class, typed presentation layer (V2 descriptors available today) and feature grouping so one module can declare:

- What it DOES (operations/queries),
- What it EMITS (events),
- How it is SHOWN or EXPORTED (presentations),
- How to INSTALL/REGISTER it as a coherent feature.

This improves reuse, observability, and AI agent operability across web apps, docs, and integrations.

---

## Presentation Categories

Three complementary presentation types can be declared and exported from the contracts library. They are transport-agnostic and do not bind to a specific app; host apps mount them using adapters. A normalized V2 descriptor exists in `presentations.v2.ts` with a transform engine and validators.

### 1) Web components (React first)

- **Goal**: Render real user stories with clean, simple, Atomic Design components. Mobile-friendly by default.
- **Adapter**: Host app provides a `componentMap` that resolves a `componentKey` to a concrete React component. This avoids cross-package JSX coupling.
- **Use cases**: Feature previews, onboarding stories, guided flows.

Shape (proposed):

```ts
type PresentationKind = 'web_component' | 'markdown' | 'data';

interface PresentationMeta {
  name: string; // e.g. "hcircle.weekly_pulse.quick_vote"
  version: number; // bump on breaking changes
  stability?: 'experimental' | 'beta' | 'stable' | 'deprecated';
  owners?: string[];
  tags?: string[]; // search, grouping
  description?: string;
}

interface WebComponentPresentation {
  kind: 'web_component';
  framework: 'react';
  /** Symbolic key resolved by host via componentMap */
  componentKey: string; // e.g. "userStory.weekly_pulse.quick_vote"
  /** zod-backed props schema from @lssm/lib.schema */
  props: import('@lssm/lib.schema').AnySchemaModel;
  /** Optional interaction analytics intents */
  analytics?: string[];
}
```

Host-side rendering contract (example):

```ts
// In the host app
const componentMap: Record<string, React.ComponentType<any>> = {
  'userStory.weekly_pulse.quick_vote': QuickVote,
  'userStory.weekly_pulse.happiness': HappinessLife,
};

function renderWebPresentation(p: WebComponentPresentation, data: any) {
  const C = componentMap[p.componentKey];
  if (!C) return <Fallback componentKey={p.componentKey} />;
  const parsed = p.props.getZod().parse(data);
  return <C {...parsed} />;
}
```

Guidelines:

- Use Atomic Design; keep components stateless where feasible.
- Ensure a11y (labels, roles, keyboard traversal) and small-screen ergonomics.
- Gate feature-flagged experiences in the host, aligning with `policy.flags` when relevant.

### 2) Markdown/MDX

- **Goal**: Make the platform and its features easily digestible by LLMs and human readers.
- **Adapter**: Expose as static strings (Markdown) or MDX sources. Optionally resolve via `ResourceRegistry` URIs so MCP clients can fetch them.
- **Use cases**: Feature guides, acceptance narratives, inline help.

Shape (proposed):

```ts
interface MarkdownPresentation {
  kind: 'markdown';
  /** Either inline content or a resource URI template */
  content?: string; // Markdown/MDX source
  resourceUri?: string; // e.g. "feature://{featureKey}/story/{storyKey}.md"
}
```

### 3) Structured raw data (JSON/XML)

- **Goal**: Enable external integrations, partial adoption, and customized setups without lock-in.
- **Adapter**: Expose via `ResourceRegistry` with stable URIs and MIME types; MCP resources map 1:1.
- **Use cases**: CSV/JSON/XML export, analytics snapshots, reference dictionaries.

Shape (proposed):

```ts
interface DataPresentation {
  kind: 'data';
  mimeType: 'application/json' | 'application/xml' | string;
  /** zod-backed schema for the payload structure */
  model: import('@lssm/lib.schema').AnySchemaModel;
}
```

Union and registry (proposed):

```ts
type PresentationSpec = {
  meta: PresentationMeta;
  policy?: { flags?: string[]; pii?: string[] };
  content: WebComponentPresentation | MarkdownPresentation | DataPresentation;
};

class PresentationRegistry {
  register(p: PresentationSpec): this {
    /* ... */ return this;
  }
  list(): PresentationSpec[] {
    /* ... */ return [];
  }
  get(name: string, version?: number): PresentationSpec | undefined {
    /* ... */ return undefined;
  }
}
```

---

## Feature Grouping

Group operations, events, and presentations into a feature/module spec that can be installed in one go.

Shape (proposed):

```ts
interface FeatureModuleMeta {
  key: string; // stable slug, e.g. "weekly_pulse"
  title: string;
  description?: string;
  domain?: string; // bounded context, e.g. "hcircle.harmony"
  owners?: string[];
  tags?: string[]; // e.g. ["connect", "save_time"]
}

interface FeatureModuleSpec {
  meta: FeatureModuleMeta;
  operations?: Array<{ name: string; version: number }>; // ContractSpec
  events?: Array<{ name: string; version: number }>; // EventSpec
  presentations?: Array<{ name: string; version: number }>; // PresentationSpec
}

class FeatureRegistry {
  register(f: FeatureModuleSpec): this {
    /* ... */ return this;
  }
  list(): FeatureModuleSpec[] {
    /* ... */ return [];
  }
}

// Optional installer to wire everything in one call
function installFeature(
  feature: FeatureModuleSpec,
  deps: {
    ops: import('./src/registry').SpecRegistry;
    presentations: PresentationRegistry;
    resources: import('./src/resources').ResourceRegistry;
  }
) {
  /* register ops/events/presentations/resources */
}
```

Why group?

- Single place to discover/enable a capability
- Consistent docs generation and MCP exposure
- Better alignment with product modules (see `hcircle` module registry)

---

## Mapping coliving modules → Presentations

Reference: `packages/hcircle/apps/web-coliving/src/components/modules/{types.ts,registry.ts}` defines modules like `weekly_pulse`, `incident_hygiene`, `groceries`, with user stories and preview components.

Examples (conceptual):

```ts
// Web component presentations (user stories)
const WeeklyPulseQuickVote: PresentationSpec = {
  meta: {
    name: 'hcircle.weekly_pulse.quick_vote',
    version: 1,
    tags: ['connect', 'harmony'],
    description: '3-tap check-in for house alignment',
  },
  content: {
    kind: 'web_component',
    framework: 'react',
    componentKey: 'userStory.weekly_pulse.quick_vote',
    props: /* SchemaModel for props */ undefined as any,
  },
};

// Markdown/MDX guide
const WeeklyPulseGuide: PresentationSpec = {
  meta: { name: 'hcircle.weekly_pulse.guide', version: 1 },
  content: {
    kind: 'markdown',
    resourceUri: 'feature://weekly_pulse/story/guide.md',
  },
};

// Data export (JSON)
const GroceriesBudgetExport: PresentationSpec = {
  meta: { name: 'hcircle.groceries.budget_export', version: 1 },
  content: {
    kind: 'data',
    mimeType: 'application/json',
    model: /* SchemaModel for export shape */ undefined as any,
  },
};
```

In the feature group:

```ts
const WeeklyPulseFeature: FeatureModuleSpec = {
  meta: {
    key: 'weekly_pulse',
    title: 'Weekly Pulse',
    tags: ['harmony', 'connect'],
  },
  operations: [{ name: 'pulse.submitQuickVote', version: 1 }],
  events: [{ name: 'pulse.vote_recorded', version: 1 }],
  presentations: [
    { name: 'hcircle.weekly_pulse.quick_vote', version: 1 },
    { name: 'hcircle.weekly_pulse.guide', version: 1 },
  ],
};
```

---

## Adapters and Exposure

- **REST**: already provided; driven by `SpecRegistry`. Presentations are not REST endpoints directly, but their data forms can be exposed as `ResourceRegistry` entries.
- **GraphQL (Pothos)**: provided in `src/server/graphql-pothos.ts`. Auto-maps operations into Query/Mutation fields. Presentations are better exposed as resources (URIs) consumed by prompts/LLMs.
- **MCP**: `createMcpServer` exposes commands (tools), resources, and prompts. Presentations map naturally:
  - `web_component` → discoverable metadata (name, tags) for UI agents.
  - `markdown` → resources (URIs) returned by prompts.
  - `data` → resources with explicit MIME types.
- **Docs**: extend `specsToMarkdown` to include presentations and feature groups so dev portals stay in sync. See `docs/tech/contracts/presentations-v2.md` for the unified V2 model and engine.

---

## Versioning & Stability (recommended)

- Bump `version` on any breaking change to shape or behavior of the spec.
- Mark `stability` to guide adopters: `experimental` → `beta` → `stable` → `deprecated`.
- Keep event payloads and data exports backward compatible where feasible. For UI, prefer additive props; otherwise, bump version and keep both entries during transition.

---

## Adapters Planning (next steps)

- React adapter: resolve `componentKey` → component map in host, validate props with SchemaModel, capture analytics intents.
- Markdown adapter: expose `markdown` presentations via `ResourceRegistry` + MCP resources; optionally render in app help.
- Data adapter: expose `data` presentations via `ResourceRegistry` with explicit MIME types (JSON/XML) and stable URIs.

---

## Authoring Guidelines

- **Atomic Design** for web components; keep complexity low and interactions obvious.
- **Accessibility**: labels, roles, focus order, and reduced motion options.
- **i18n**: UI strings belong in app i18n namespaces; contracts carry keys and defaults, not hard-coded text.
- **Feature flags**: gate risky or staged presentations via `policy.flags` + host checks.
- **Docs as source**: when specs change, update `docs/` in the same change.

---

## How to Add a New Feature

1. Define operations/events in code using `defineCommand`, `defineQuery`, and `defineEvent`.
2. Declare presentations (at least one) in a `PresentationRegistry` and link to the feature.
3. Register a `FeatureModuleSpec` that references ops/events/presentations.
4. Mount adapters in the host app(s): REST/GraphQL/MCP/UI.
5. Update docs via the markdown generator and/or bespoke docs in `docs/`.

### Quick start

```ts
import { SpecRegistry, installOp } from '@lssm/lib.contracts';
import { makeNextAppHandler } from '@lssm/lib.contracts/server/rest-next-app';

const reg = new SpecRegistry();
installOp(reg, BeginSignupSpec, beginSignupHandler);

export const { GET, POST } = {
  GET: (req: Request) =>
    makeNextAppHandler(reg, () => ({ actor: 'anonymous' }))(req),
  POST: (req: Request) =>
    makeNextAppHandler(reg, () => ({ actor: 'anonymous' }))(req),
};
```

---

## Exports (current)

See `src/index.ts` for public exports:

- Ops/events/specs/registries
- REST/Next/Elysia/MCP adapters
- Markdown generator, prompt registry, resources

Planned additions:

- `PresentationSpec`, `PresentationRegistry`
- `FeatureModuleSpec`, `FeatureRegistry`, `installFeature`
- Extended docs generator to include presentations/features

---

## Notes

- Keep adapters and registries modular and swappable (hexagonal). Domain logic must remain testable in isolation.
- Prefer `@lssm/lib.schema` models to avoid zod schema drift across adapters.
- When multiple apps consume the same presentation, rely on the `componentKey` indirection rather than importing components across packages.
