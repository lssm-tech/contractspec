# Rollout Plan

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.surface-runtime`
- **Repo Path:** `packages/libs/surface-runtime`


## Goal

Ship this package incrementally, with enough structure to learn from reality before it spreads across the product.

## Phase 0: Package scaffold

### Deliverables
- package directory
- exports map
- core types
- `defineModuleBundle`
- patch validator
- adapter boundaries
- basic docs

### Acceptance criteria
- bundle spec compiles
- example bundle typechecks
- no direct third-party UI imports outside adapters

## Phase 1: Resolver MVP

### Deliverables
- route -> surface selection
- layout selection
- data recipe resolution
- preference adaptation stub
- policy hooks
- `ResolvedSurfacePlan`

### Acceptance criteria
- one route can resolve into a stable surface plan
- fallbacks work
- audit/debug output exists

## Phase 2: React renderer MVP

### Deliverables
- `BundleProvider`
- `BundleRenderer`
- slot rendering
- panel groups via `react-resizable-panels`
- motion token mapping
- simple widget registry

### Acceptance criteria
- one workbench surface renders from plan only
- panel persistence works
- dense and compact variants are visually distinct

## Phase 3: PM issue workbench pilot

### Deliverables
- PM issue bundle spec
- entity field registry for current PM fields
- custom field support for relation/rollup/formula/people
- section rendering
- saved view application
- relation panel

### Acceptance criteria
- issue detail page no longer depends on bespoke page composition
- saved views alter rendering correctly
- field renderer fallbacks are graceful

## Phase 4: Assistant integration

### Deliverables
- AI SDK adapter
- assistant rail
- planner prompt compiler
- patch proposal validator
- accept/reject UI
- audit log events

### Acceptance criteria
- assistant can propose allowed layout and helper-node patches
- invalid patches are rejected cleanly
- accepted patches are undoable

## Phase 5: Durable customization

### Deliverables
- user overlay persistence
- workspace overlay persistence
- approval flow
- overlay merge diagnostics
- conflict resolution UI

### Acceptance criteria
- user can save personal layout
- admin can publish workspace layout
- full audit trail exists

## Phase 6: Customization mode

### Deliverables
- drag-and-drop editing mode
- panel mutation mode
- widget insertion palette
- extension point browser
- view preset editor

### Acceptance criteria
- users can safely rearrange mutable surfaces
- workspace admins can manage shared defaults

## Phase 7: Evaluation and hardening

### Deliverables
- golden-context harness
- performance dashboard
- AI patch evals
- safety dashboards
- missing renderer alerts

### Acceptance criteria
- regression tests cover key routes and preferences
- resolver latency stays within budget
- acceptance/rejection telemetry is visible

## Suggested pilot route

Use:
- `/operate/pm/issues/:issueId`
- or equivalent PM issue workbench route

### Why
It exercises:
- deep entity surfaces
- saved views
- dense layouts
- assistant help
- custom fields
- relation-heavy context
- cross-domain panels

## Rollout risks

### Risk 1: Too much abstraction too early
Mitigation: pilot a single route family first.

### Risk 2: AI patch scope too broad
Mitigation: start with assistant/helper slot patches only.

### Risk 3: Bundle specs become unreadable
Mitigation: keep surface specs modular and link to named layouts/widgets.

### Risk 4: Saved layouts become invalid after spec changes
Mitigation: version layouts and validate persisted patches against current spec.

### Risk 5: Performance collapse on dense surfaces
Mitigation: data depth clamps, lazy panels, plan size budget, instrumentation.

## Recommended budgets

### Resolver
- server: under 100ms p95 before data fetch
- client re-resolution: under 30ms p95 for preference/layout-only updates

### Initial plan size
- keep serialized initial plan modest
- avoid sending full raw datasets when a recipe binding key would do

### AI planning
- no planner call on first paint for baseline route load
- planner can run after initial render for enhancement

## Team sequencing

If you have to parallelize:
- one engineer on spec/runtime
- one on React renderer/adapters
- one on PM pilot surface + field registry
- one on AI patching + observability

But do not let four people invent four different local abstractions for the same thing. Humans do this constantly. Then they hold a meeting.
