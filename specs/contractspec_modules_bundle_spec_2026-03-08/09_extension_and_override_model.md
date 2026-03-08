# Extension and Override Model

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.surface-runtime`
- **Repo Path:** `packages/libs/surface-runtime`


## Goal

Let the system be deeply extensible without losing coherence, safety, or auditability.

## Overlay alignment

Align with `@contractspec/lib.overlay-engine`: SignedOverlaySpec, OverlayTargetRef, OverlayRenderableField. Use overlay-engine merger, runtime, signer APIs for durable overrides.

## Extension types

The surface runtime package should support at least these extension families:

- widgets
- field renderers
- actions
- commands
- surface patches
- assistant skills / planner augmentations
- layout blueprints

## Trust tiers

Every extension must declare a trust tier.

### Core
Owned by the application or ContractSpec maintainers.

### Workspace
Created inside the workspace by trusted admins/builders.

### Signed plugin
Distributed package or bundle extension with provenance and signature checks.

### Ephemeral AI
Temporary proposal from an assistant. Never durable by default.

## Widget registry

```ts
export interface WidgetRegistryEntry {
  widgetKey: string;
  title: string;
  nodeKind: "custom-widget";
  render: string;
  configure?: string;
  trust: "core" | "workspace" | "signed-plugin";
  requiresCapabilities?: string[];
  supportedSlots?: string[];
}
```

Widgets should never be registered by raw runtime strings from the assistant. Registration is a code/package concern, not a prompt concern.

## Field renderer registry

This is one of the most important extension points because it lets you add:
- domain-specific field kinds
- alternate summary renderers
- custom table cells
- special inspectors

Example:
- `customer-impact-score`
- `ops-incident-severity`
- `design-review-state`

## Command registry

A modern AI-native app still needs a serious command model.

Commands should support:
- keyboard shortcuts
- palette search
- entity-scoped commands
- assistant-suggested commands
- policy-aware enable/disable states

## Override model

There are two kinds of overrides.

### 1. Structural overrides

Examples:
- add a widget to a slot
- hide a field in a layout
- switch default layout
- promote an action
- change panel sizes

### 2. Behavioral overrides

Examples:
- change default data depth for a route
- alter default sort/group
- change onboarding verbosity
- adjust assistant prompt policy for a surface

## Persistence strategy

### Session patches
Fast, reversible, local.

### User overlays
Durable per-user customizations.

### Workspace overlays
Durable team/shared customizations with approval.

### System overlays
Used for hotfixes, defaults, and centrally managed policy-driven UI changes.

## Recommended merge order

```text
base bundle
-> system overlays
-> workspace overlays
-> user overlays
-> session patches
-> AI proposals (not yet committed)
```

## Why overlays are the right base

ContractSpec already has an overlay engine with typed, signed, auditable modifications. Reusing that model for UI customizations is much better than inventing a parallel persistence story.

## Extension review workflow

Workspace or plugin extensions should pass through:

1. schema validation
2. trust validation
3. capability validation
4. UI verification checks
5. telemetry namespace assignment
6. optional approval

## Example extension point declarations

```ts
extensions: [
  {
    extensionPointId: "pm.issue.right-rail.widgets",
    title: "PM Issue Right Rail Widgets",
    accepts: "widget",
    trust: "signed-plugin",
  },
  {
    extensionPointId: "pm.issue.field-renderers",
    title: "PM Issue Field Renderers",
    accepts: "field-renderer",
    trust: "workspace",
  },
]
```

## AI proposal promotion flow

A useful flow is:

- AI suggests a new right-rail metric card.
- Proposal becomes a session patch.
- User accepts.
- Runtime asks whether to keep it just for this session, save to personal layout, or propose for workspace layout.
- Workspace promotion requires approval.

This flow feels magical without being reckless.

## Avoid these traps

### Trap 1: Free-form JSON widgets
That becomes an untyped low-code engine with no clear safety boundary.

### Trap 2: Plugin code in the planner prompt
Do not dump plugin implementation details into prompts unless strictly needed.

### Trap 3: Per-route custom persistence formats
Use one overlay-compatible persistence grammar.

### Trap 4: Hidden extensions
Extensions must be discoverable in diagnostics and telemetry.

## Recommended APIs

```ts
export interface BundleExtensionRegistry {
  registerWidget(entry: WidgetRegistryEntry): void;
  registerFieldRenderer(kind: string, entry: FieldRendererSpec): void;
  registerAction(entry: ActionSpec): void;
  registerCommand(entry: CommandSpec): void;
}

export interface BundleOverrideStore {
  list(scope: BundleScope, targetKey: string): Promise<unknown[]>;
  save(scope: BundleScope, targetKey: string, patch: SurfacePatchOp[]): Promise<void>;
  remove(overrideId: string): Promise<void>;
}
```

## Final rule

Extensibility should increase surface power without increasing surface chaos.

If an extension cannot be explained, validated, diffed, and removed cleanly, it is not a real extension model. It is just hidden complexity wearing a nice hat.
