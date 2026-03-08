# Core Bundle Spec

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.modules-bundle`
- **Repo Path:** `packages/libs/modules-bundle`


## Goal

Define the canonical TypeScript shape for a bundle.

A bundle is the smallest ContractSpec unit that can describe an AI-native product surface end-to-end:
- routes
- data
- layout
- entity renderers
- actions
- chat/assistant
- personalization
- extension points
- policy constraints
- telemetry hooks

## Core idea

A bundle spec resolves into a **surface plan**.

A surface plan is:
- renderable
- auditable
- diffable
- patchable
- persistable

That makes it a much safer runtime unit than arbitrary component trees.

## Canonical types

```ts
export type BundleScope = "system" | "workspace" | "team" | "user" | "session";
export type SurfaceKind =
  | "overview"
  | "list"
  | "detail"
  | "editor"
  | "workbench"
  | "assistant"
  | "board"
  | "timeline"
  | "canvas";

export interface BundleMeta {
  key: string;
  version: string;
  title: string;
  description?: string;
  owners?: string[];
  tags?: string[];
  stability?: "experimental" | "beta" | "stable";
}

export interface BundleContext {
  tenantId: string;
  workspaceId?: string;
  actorId?: string;
  route: string;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  device: "desktop" | "tablet" | "mobile";
  mode?: "guided" | "pro" | "autopilot";
  locale?: string;
  timezone?: string;
  entity?: {
    type: string;
    id: string;
  };
  conversation?: {
    threadId?: string;
    assistantId?: string;
    activeIntent?: string;
  };
  preferences: PreferenceDimensions;
  capabilities: string[];
  featureFlags?: string[];
}

export interface PreferenceDimensions {
  guidance: "none" | "hints" | "tooltips" | "walkthrough" | "wizard";
  density: "minimal" | "compact" | "standard" | "detailed" | "dense";
  dataDepth: "summary" | "standard" | "detailed" | "exhaustive";
  control: "restricted" | "standard" | "advanced" | "full";
  media: "text" | "visual" | "voice" | "hybrid";
  pace: "deliberate" | "balanced" | "rapid";
  narrative: "top-down" | "bottom-up" | "adaptive";
}

export interface ModuleBundleSpec<C extends BundleContext = BundleContext> {
  meta: BundleMeta;
  routes: BundleRouteSpec<C>[];
  surfaces: Record<string, SurfaceSpec<C>>;
  entities?: EntitySurfaceRegistrySpec;
  presets?: BundlePresetSpec[];
  ai?: BundleAiSpec<C>;
  extensions?: BundleExtensionPointSpec[];
  telemetry?: BundleTelemetrySpec;
  governance?: BundleGovernanceSpec;
}

export interface BundleRouteSpec<C extends BundleContext = BundleContext> {
  routeId: string;
  path: string;
  defaultSurface: string;
  candidateSurfaces?: string[];
  when?: BundlePredicate<C>;
}

export interface SurfaceSpec<C extends BundleContext = BundleContext> {
  surfaceId: string;
  kind: SurfaceKind;
  title: string;
  when?: BundlePredicate<C>;
  priority?: number;
  slots: SlotSpec[];
  layouts: LayoutBlueprintSpec<C>[];
  data: DataRecipeSpec<C>[];
  actions?: ActionSpec[];
  commands?: CommandSpec[];
  ai?: SurfaceAiSpec<C>;
  verification: SurfaceVerificationSpec;
}

export interface SlotSpec {
  slotId: string;
  role:
    | "header"
    | "primary"
    | "secondary"
    | "assistant"
    | "inspector"
    | "footer"
    | "floating"
    | "command";
  accepts: BundleNodeKind[];
  cardinality: "one" | "many";
  mutableByAi?: boolean;
  mutableByUser?: boolean;
}

export type BundleNodeKind =
  | "metric-strip"
  | "data-view"
  | "entity-card"
  | "entity-section"
  | "entity-field"
  | "rich-doc"
  | "chat-thread"
  | "assistant-panel"
  | "action-bar"
  | "timeline"
  | "board"
  | "table"
  | "calendar"
  | "form"
  | "chart"
  | "relation-graph"
  | "custom-widget";

export interface LayoutBlueprintSpec<C extends BundleContext = BundleContext> {
  layoutId: string;
  title?: string;
  when?: BundlePredicate<C>;
  root: RegionNode;
}

export type RegionNode =
  | PanelGroupRegion
  | StackRegion
  | TabsRegion
  | FloatingRegion
  | SlotRegion;

export interface PanelGroupRegion {
  type: "panel-group";
  direction: "horizontal" | "vertical";
  persistKey?: string;
  children: RegionNode[];
}

export interface StackRegion {
  type: "stack";
  direction: "vertical" | "horizontal";
  gap?: "none" | "xs" | "sm" | "md" | "lg";
  children: RegionNode[];
}

export interface TabsRegion {
  type: "tabs";
  tabs: {
    key: string;
    title: string;
    child: RegionNode;
  }[];
}

export interface FloatingRegion {
  type: "floating";
  anchorSlotId: string;
  child: RegionNode;
}

export interface SlotRegion {
  type: "slot";
  slotId: string;
}

export interface DataRecipeSpec<C extends BundleContext = BundleContext> {
  recipeId: string;
  source:
    | { kind: "operation"; key: string }
    | { kind: "data-view"; key: string }
    | { kind: "entity"; entityType: string };
  when?: BundlePredicate<C>;
  requestedDepth?: C["preferences"]["dataDepth"];
  hydrateInto?: string;
  cacheTtlMs?: number;
}

export interface ActionSpec {
  actionId: string;
  title: string;
  operationKey?: string;
  intent?: string;
  placement?: "header" | "inline" | "context" | "assistant";
  requiresCapabilities?: string[];
}

export interface CommandSpec {
  commandId: string;
  title: string;
  intent: string;
  shortcut?: string[];
}

export interface BundlePresetSpec {
  presetId: string;
  title: string;
  description?: string;
  preferencePatch: Partial<PreferenceDimensions>;
  defaultLayoutIdBySurface?: Record<string, string>;
}

export interface BundleAiSpec<C extends BundleContext = BundleContext> {
  plannerId: string;
  allowedPatchOps: SurfacePatchOp["op"][];
  plannerPrompt: string;
  maxPatchOpsPerTurn?: number;
  canAskFollowUp?: boolean;
  contextualTools?: string[];
  when?: BundlePredicate<C>;
}

export interface SurfaceAiSpec<C extends BundleContext = BundleContext> {
  assistantSlotId?: string;
  allowLayoutPatches?: boolean;
  allowSlotInsertion?: boolean;
  allowedNodeKinds?: BundleNodeKind[];
  allowedSlots?: string[];
  plannerOverrides?: Partial<BundleAiSpec<C>>;
}

export interface BundleExtensionPointSpec {
  extensionPointId: string;
  title: string;
  accepts:
    | "widget"
    | "field-renderer"
    | "action"
    | "command"
    | "surface-patch";
  trust: "core" | "workspace" | "signed-plugin" | "ephemeral-ai";
}

export interface BundleTelemetrySpec {
  namespace: string;
  emitSurfaceResolved?: boolean;
  emitPatchApplied?: boolean;
  emitIntentMatched?: boolean;
  emitPreferenceAdaptation?: boolean;
}

export interface BundleGovernanceSpec {
  requireApprovalForWorkspacePatches?: boolean;
  requireApprovalForAiPatches?: boolean;
  retainAuditDays?: number;
}

export interface SurfaceVerificationSpec {
  dimensions: {
    guidance: string;
    density: string;
    dataDepth: string;
    control: string;
    media: string;
    pace: string;
    narrative: string;
  };
}

export type BundlePredicate<C extends BundleContext = BundleContext> =
  (ctx: C) => boolean;
```

## Surface patch grammar

```ts
export type SurfacePatchOp =
  | {
      op: "insert-node";
      slotId: string;
      node: SurfaceNode;
      index?: number;
    }
  | {
      op: "replace-node";
      nodeId: string;
      node: SurfaceNode;
    }
  | {
      op: "remove-node";
      nodeId: string;
    }
  | {
      op: "move-node";
      nodeId: string;
      toSlotId: string;
      index?: number;
    }
  | {
      op: "resize-panel";
      persistKey: string;
      sizes: number[];
    }
  | {
      op: "set-layout";
      layoutId: string;
    }
  | {
      op: "reveal-field";
      fieldId: string;
    }
  | {
      op: "hide-field";
      fieldId: string;
    }
  | {
      op: "promote-action";
      actionId: string;
      placement: "header" | "inline" | "context" | "assistant";
    }
  | {
      op: "set-focus";
      targetId: string;
    };
```

## Surface node grammar

```ts
export interface SurfaceNode {
  nodeId: string;
  kind: BundleNodeKind;
  title?: string;
  props?: Record<string, unknown>;
  children?: SurfaceNode[];
  sourceBinding?: {
    recipeId?: string;
    entityType?: string;
    fieldId?: string;
  };
}
```

## Spec rules

### Rule 1
Every surface must declare a verification block for all 7 preference dimensions.

### Rule 2
Every AI-enabled surface must declare:
- allowed slots
- allowed node kinds
- allowed patch ops

### Rule 3
Every custom widget must have a declared trust tier.

### Rule 4
Every patch op must be reversible.

### Rule 5
No surface may require AI to be usable. AI is additive, not mandatory.

## Recommendation

Keep the spec small and composable. Resist the urge to put every last layout behavior into the type system on day one.

The job of the spec is to make the system legible and safe, not to reenact the entire DOM in TypeScript because apparently we enjoy suffering.
