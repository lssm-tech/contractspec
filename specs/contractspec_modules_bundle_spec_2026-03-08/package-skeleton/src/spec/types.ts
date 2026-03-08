export interface PreferenceDimensions {
  guidance: "none" | "hints" | "tooltips" | "walkthrough" | "wizard";
  density: "minimal" | "compact" | "standard" | "detailed" | "dense";
  dataDepth: "summary" | "standard" | "detailed" | "exhaustive";
  control: "restricted" | "standard" | "advanced" | "full";
  media: "text" | "visual" | "voice" | "hybrid";
  pace: "deliberate" | "balanced" | "rapid";
  narrative: "top-down" | "bottom-up" | "adaptive";
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
  preferences: PreferenceDimensions;
  capabilities: string[];
  featureFlags?: string[];
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

export interface BundleMeta {
  key: string;
  version: string;
  title: string;
  description?: string;
  owners?: string[];
  tags?: string[];
  stability?: "experimental" | "beta" | "stable";
}

export interface ModuleBundleSpec<C extends BundleContext = BundleContext> {
  meta: BundleMeta;
  /** Required features (e.g. ai-chat, metering) from contracts-spec defineFeature. */
  requires?: { key: string; version: string }[];
  routes: BundleRouteSpec<C>[];
  surfaces: Record<string, SurfaceSpec<C>>;
  ai?: BundleAiSpec<C>;
}

export interface BundleRouteSpec<C extends BundleContext = BundleContext> {
  routeId: string;
  path: string;
  defaultSurface: string;
  candidateSurfaces?: string[];
  when?: (ctx: C) => boolean;
}

export interface SurfaceSpec<C extends BundleContext = BundleContext> {
  surfaceId: string;
  kind: "overview" | "list" | "detail" | "editor" | "workbench" | "assistant";
  title: string;
  slots: SlotSpec[];
  layouts: LayoutBlueprintSpec<C>[];
  data: DataRecipeSpec<C>[];
  ai?: SurfaceAiSpec<C>;
  verification: SurfaceVerificationSpec;
}

export interface SlotSpec {
  slotId: string;
  role: "header" | "primary" | "secondary" | "assistant" | "inspector" | "footer" | "floating" | "command";
  accepts: BundleNodeKind[];
  cardinality: "one" | "many";
  mutableByAi?: boolean;
  mutableByUser?: boolean;
}

export interface LayoutBlueprintSpec<C extends BundleContext = BundleContext> {
  layoutId: string;
  title?: string;
  when?: (ctx: C) => boolean;
  root: RegionNode;
}

export type RegionNode =
  | PanelGroupRegion
  | StackRegion
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
  when?: (ctx: C) => boolean;
  requestedDepth?: C["preferences"]["dataDepth"];
  hydrateInto?: string;
  cacheTtlMs?: number;
}

export interface BundleAiSpec<C extends BundleContext = BundleContext> {
  plannerId: string;
  allowedPatchOps: SurfacePatchOp["op"][];
  plannerPrompt: string;
  maxPatchOpsPerTurn?: number;
  canAskFollowUp?: boolean;
  contextualTools?: string[];
  when?: (ctx: C) => boolean;
}

export interface SurfaceAiSpec<C extends BundleContext = BundleContext> {
  assistantSlotId?: string;
  allowLayoutPatches?: boolean;
  allowSlotInsertion?: boolean;
  allowedNodeKinds?: BundleNodeKind[];
  allowedSlots?: string[];
  plannerOverrides?: Partial<BundleAiSpec<C>>;
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
      op: "set-focus";
      targetId: string;
    };
