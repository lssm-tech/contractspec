# AI Agent Guide — `@contractspec/lib.ui-kit`

Scope: `packages/libs/ui-kit/*`

Mission: keep `@contractspec/lib.ui-kit` a stable cross-platform component package for native-first and Expo-oriented surfaces. Most compatibility risk lives in the exported `./ui/*` subpaths, not in the root barrel.

## Public surface

Treat `./ui/*` as the real compatibility surface:

- forms and inputs
- overlays and menus
- navigation and linking
- data display and layout
- loading and empty states
- marketing, use-cases, organisms, and visualization
- hooks, utilities, and icons

Important source-accuracy note: the root entry does not currently expose the useful component surface.

## Change boundaries

- Exported subpaths and prop signatures are compatibility surface.
- Do not introduce web-only or native-only behavior without explicit platform handling.
- Keep `exports` and `publishConfig.exports` aligned.
- Keep README guidance focused on subpath-first usage.

## Package invariants

- Cross-platform component APIs must stay deliberate and predictable.
- Expo and React Native integration points such as `expo-router`, `nativewind`, and RN primitives are part of package behavior.
- `./ui/link` remains Expo-router-oriented. It is not the same contract as `@contractspec/lib.ui-link`.
- `@contractspec/lib.ui-kit-core` compatibility matters for class-merging behavior and low-level helper expectations.

## Editing guidance by area

### Forms and inputs

- Preserve prop ergonomics and platform behavior for input, textarea, select, form, and field components.
- Treat changes here as high-blast-radius because they affect many app surfaces.

### Overlays and menus

- Keep dialog, sheet, popover, dropdown, and context-menu behavior aligned with native-first expectations.
- Be careful with focus, dismissal, and gesture-driven behavior.

### Navigation and linking

- Keep navigation helpers clearly router-aware where intended.
- Do not blur the boundary between Expo-router behavior here and router-agnostic behavior in `ui-link`.

### Visualization and data display

- Preserve existing grouping and contracts for table, data-table, visualization, and marketing-related surfaces.
- Avoid silently introducing web-specific assumptions into native-first components.

### Hooks and utilities

- Keep utility behavior predictable.
- Avoid duplicating new helper layers unless multiple components already need them.

## Docs maintenance rules

- README should point consumers to `./ui/*` subpaths, not the root.
- AGENTS should call out platform constraints and high-blast-radius component groups.
- If new public subpath groups are added, document them explicitly.

## Verification checklist

- `bun run lint:check`
- `bun run typecheck`
- Confirm docs still reflect subpath-first usage and current source behavior.
