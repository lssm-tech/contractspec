# UI Composition and Adapters

- **Created:** 2026-03-08
- **Status:** Proposal
- **Package:** `@contractspec/lib.modules-bundle`
- **Repo Path:** `packages/libs/modules-bundle`


## Goal

Describe how the selected UI libraries fit together without turning the codebase into an import-path hostage situation.

## Core stance

Use each library for the thing it is best at, and only through a **local adapter layer**.

Do not let third-party APIs leak all over the runtime.

## Division of responsibility

### BlockNote

Use for:
- rich document surfaces
- AI-assisted editable summaries
- meeting notes
- issue descriptions
- structured block-based inspection and authoring
- custom block schemas for domain entities
- slash-command insertion of entity and action blocks

Do not use it as the whole application layout engine.

### dnd-kit ecosystem

Use for:
- reordering widgets within slots
- dragging field sections
- moving panels between mutable slots
- board and kanban interactions
- customization mode layout editing

Do not use it for general application resize behavior.

### Floating UI

Use for:
- contextual menus
- inline inspectors
- hover cards
- action popovers
- assistant suggestions anchored to selected text or selected nodes
- command palette positioning
- anchored toolbars

Do not build bespoke popover math yourself. That way lies ugly bugs.

### Motion

Use for:
- layout transitions
- shared element transitions
- inserting/removing surface nodes
- gesture feedback
- panel reveal/collapse motion
- assistant response microinteractions

Do not use Motion where simple CSS transitions are enough. Especially in `rapid` pace mode.

### react-resizable-panels

Use for:
- split-pane workbench layouts
- inspector + main + assistant patterns
- persistent panel size memory
- power-user multi-pane surfaces

Do not force it into pixel-perfect page builders. It is percentage-first for good reason.

### Vercel AI SDK

Use for:
- streaming assistant responses
- tool calling
- structured planner output
- multi-step assistant flows
- chat-thread state
- message part rendering
- server/client AI boundary

Do not use it as permission logic or policy logic. It is an orchestration and streaming layer, not your constitution.

## Adapter interfaces

### BlockNote adapter

```ts
export interface BlockNoteBundleAdapter {
  supportsNode(kind: BundleNodeKind): boolean;
  createSchema(registry: FieldRendererRegistry): unknown;
  renderNode(node: SurfaceNode, ctx: RenderContext): JSX.Element;
  serialize(node: SurfaceNode): Promise<unknown>;
  deserialize(input: unknown): Promise<SurfaceNode>;
}
```

### dnd-kit adapter

```ts
export interface DragDropBundleAdapter {
  enableSurfaceEditing(args: {
    mutableSlots: string[];
    onPatch: (ops: SurfacePatchOp[]) => void;
  }): void;
}
```

### Floating UI adapter

```ts
export interface FloatingBundleAdapter {
  renderAnchoredMenu(args: {
    anchorId: string;
    items: ActionSpec[];
  }): JSX.Element;
}
```

### Motion adapter

```ts
export interface MotionBundleAdapter {
  getTokens(pace: PreferenceDimensions["pace"]): {
    durationMs: number;
    enableEntrance: boolean;
    layout: boolean;
  };
}
```

### Panels adapter

```ts
export interface PanelLayoutAdapter {
  renderPanelGroup(region: PanelGroupRegion, ctx: RenderContext): JSX.Element;
  restoreLayout(persistKey: string): Promise<number[] | null>;
  saveLayout(persistKey: string, sizes: number[]): Promise<void>;
}
```

### AI SDK adapter

```ts
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
```

## Recommended UI composition patterns

### Pattern 1: Workbench

```text
┌──────── header ────────┐
│ issue title / actions  │
├──── left ─┬── main ─┬── right ─┤
│ views     │ editor  │ inspector│
│ filters   │ table   │ assistant│
└───────────┴──────────┴──────────┘
```

Use:
- `react-resizable-panels` for columns
- Motion for open/close transitions
- Floating UI for inline actions
- dnd-kit only in customization mode

### Pattern 2: Rich entity page

```text
summary
evidence
custom fields
relations
activity
assistant
```

Use:
- narrative dimension to reorder summary/evidence
- BlockNote for longform content
- field registry for structured sections
- Floating UI for field-level help and actions

### Pattern 3: Board / timeline / list switcher

Use:
- the same entity binding
- different layout blueprints
- saved view presets
- dnd-kit for board interactions
- panels only if the view is in a workbench shell

## Accessibility rules

### Drag and drop

- keyboard support must exist
- screen reader announcements must be present
- handles must be explicit
- drag overlays should not hide state from assistive tech

### Floating elements

- focus traps only where appropriate
- anchored content must have escape routes
- hover-only disclosure is not enough

### Motion

- respect reduced motion
- rapid pace disables gratuitous entrance animations
- do not rely on motion alone to communicate state

### Panels

- resize handles must be keyboard focusable where possible
- inspector collapse/expand must remain discoverable without drag

## Important pushback: isolate library churn

The dnd-kit ecosystem appears to have both older and newer package/documentation lines in circulation. Treat it as an ecosystem, not a raw import contract.

Likewise, Motion usage has evolved from older package identities to the current `motion` package and `motion/react` imports.

If the bundle package depends on those APIs directly everywhere, you are volunteering to let third-party package churn define your internal architecture. That is not strategy. That is asking for a migraine.

## What the renderer should own

The bundle React renderer should own:
- recursive node rendering
- slot rendering
- panel groups
- command palette shell
- assistant rail
- focus restoration
- motion tokens from pace
- wiring to overlay and patch persistence

The adapters should own the third-party library specifics.

## Final rule

The runtime knows about **specs and plans**.

The adapters know about **libraries**.

Keep those layers separate or this whole design collapses into a tangle of clever imports and regret.
