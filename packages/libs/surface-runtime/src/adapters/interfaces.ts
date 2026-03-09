/**
 * Adapter interfaces for third-party UI libraries.
 * No direct imports of BlockNote, dnd-kit, Floating UI, Motion, etc. outside adapters/.
 * Aligns with 06_ui_composition_and_adapters.md.
 */

import type { ComponentType, ReactElement } from 'react';
import type { FieldRendererRegistry } from '../runtime/field-renderer-registry';
import type { ResolvedSurfacePlan } from '../runtime/resolve-bundle';
import type {
  ActionSpec,
  BundleNodeKind,
  PanelGroupRegion,
  PreferenceDimensions,
  RegionNode,
  SurfaceNode,
  SurfacePatchOp,
  SurfacePatchProposal,
} from '../spec/types';

/** Context passed to renderers. */
export interface RenderContext {
  plan: ResolvedSurfacePlan;
  bindings: Record<string, unknown>;
  preferences: PreferenceDimensions;
}

/** Field renderer registry for entity surfaces. See runtime/field-renderer-registry. */
export type { FieldRendererRegistry };

/** BlockNote adapter for rich document surfaces. Stub in Phase 2. */
export interface BlockNoteBundleAdapter {
  supportsNode(kind: BundleNodeKind): boolean;
  createSchema(registry: FieldRendererRegistry): unknown;
  renderNode(node: SurfaceNode, ctx: RenderContext): ReactElement;
  serialize(node: SurfaceNode): Promise<unknown>;
  deserialize(input: unknown): Promise<SurfaceNode>;
}

/** dnd-kit adapter for drag-and-drop. Stub in Phase 2; full impl in Phase 6. */
export interface DragDropBundleAdapter {
  enableSurfaceEditing(args: {
    mutableSlots: string[];
    onPatch: (ops: SurfacePatchOp[]) => void;
  }): void;
  /** When provided, wrap children for DnD when customization mode is on. */
  DndWrapper?: ComponentType<{
    children: React.ReactNode;
    mutableSlots: string[];
    onPatch: (ops: SurfacePatchOp[]) => void;
  }>;
}

/** Floating UI adapter for anchored menus and popovers. Stub in Phase 2. */
export interface FloatingBundleAdapter {
  renderAnchoredMenu(args: {
    anchorId: string;
    items: ActionSpec[];
  }): ReactElement;
}

/** Motion tokens derived from pace preference. */
export interface MotionTokens {
  durationMs: number;
  enableEntrance: boolean;
  layout: boolean;
}

/** Motion adapter for layout transitions. Maps pace to tokens. */
export interface MotionBundleAdapter {
  getTokens(pace: PreferenceDimensions['pace']): MotionTokens;
}

/** Renders a child region. Passed to panel adapter to avoid adapter→renderer cycle. */
export type RenderRegionFn = (
  region: RegionNode,
  ctx: RenderContext
) => ReactElement;

/** Panels adapter for split-pane workbench layouts. */
export interface PanelLayoutAdapter {
  renderPanelGroup(
    region: PanelGroupRegion,
    ctx: RenderContext,
    renderChild: RenderRegionFn
  ): ReactElement;
  restoreLayout(persistKey: string): Promise<number[] | null>;
  saveLayout(persistKey: string, sizes: number[]): Promise<void>;
}

/** AI SDK adapter for planner/chat integration. Stub in Phase 2. */
export interface AiSdkBundleAdapter {
  startThread(args: {
    plannerId: string;
    systemPrompt: string;
    tools: Record<string, unknown>;
  }): unknown;

  requestPatches(args: {
    currentPlan: ResolvedSurfacePlan;
    userMessage: string;
  }): Promise<SurfacePatchProposal[]>;
}
