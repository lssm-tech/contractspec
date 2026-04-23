# Context Snapshot: FormSpec Layout And Locked Filters

## Task Statement

Improve FormSpec and related rendering/runtime surfaces, focused on:

- form layout responsiveness and cross-platform capability, including the current issue where mobile can still render multiple fields per line
- filtering, especially initial and locked filters, so the same contracts can drive generic list/search screens and restricted embedded listings such as posts for one category

## Desired Outcome

A consensus implementation plan that preserves the public ContractSpec compatibility surface while adding clear, testable primitives for responsive form layout and reusable constrained list/search filters across web and native renderers.

## Known Facts And Evidence

- `packages/libs/contracts-spec/src/forms/forms.ts` already defines `FormLayoutSpec.columns`, `FieldLayoutSpec.colSpan`, `FieldOrientation`, group layout inheritance, and `normalizeFormSpec`.
- `packages/libs/contracts-runtime-client-react/src/form-render.impl.tsx` renders FormSpec layouts by converting `columns` and `colSpan` to Tailwind-style grid classes.
- Current renderer behavior maps numeric `layout.columns: 2` to unprefixed `grid-cols-2`, which applies at the base/mobile breakpoint. That matches the reported issue where mobile can show multiple fields per line.
- Object-shaped columns already support explicit responsive keys such as `{ base: 1, md: 2 }`.
- `packages/libs/design-system/src/renderers/form-contract.tsx` uses the shared `createFormRenderer` with design-system controls. Native support relies on platform aliasing and paired native design-system primitives.
- `packages/libs/design-system/src/components/forms/controls/Field.tsx` and `.native.tsx` deliberately accept and ignore `layout` props at the control boundary; layout classes are currently composed by the renderer.
- `packages/libs/contracts-spec/src/data-views/types.ts` defines `DataViewFilter` as `{ key, label, field, type, options? }` and `DataViewBaseConfig.filters?: DataViewFilter[]`.
- `packages/libs/design-system/src/components/data-view/DataViewRenderer.tsx` and `.native.tsx` accept loose `filters?: Record<string, unknown>` and render active chips from all filter entries, with no contract notion of initial, hidden, locked, or user-removable filters.
- `packages/libs/presentation-runtime-core/src/index.ts` defines generic `ListState<TFilters>` with `q`, `page`, `limit`, `sort`, and `filters`.
- `packages/libs/presentation-runtime-react/src/index.ts` and `packages/libs/presentation-runtime-react-native/src/index.ts` coordinate filters with RHF and URL-like state but do not distinguish user filters from fixed scope constraints.
- `packages/libs/design-system/src/hooks/useListUrlState.ts` serializes all filters into a single `f` query param and clears all filters indiscriminately.
- Relevant package guidance treats `@contractspec/lib.contracts-spec`, `@contractspec/lib.contracts-runtime-client-react`, `@contractspec/lib.presentation-runtime-*`, and `@contractspec/lib.design-system` as public/high-blast-radius compatibility surfaces.

## Constraints

- Spec-first: contract source changes must lead implementation changes.
- Public type additions should be backward compatible; avoid breaking exported shapes.
- No new dependencies unless explicitly requested.
- Keep web/native compatibility behind existing design-system and presentation-runtime boundaries.
- Pair behavior changes with focused tests for contracts, runtime rendering, design-system rendering, URL/list state, and native parity where applicable.
- Existing worktree is dirty with unrelated changes; do not revert or overwrite unrelated files.

## Unknowns And Open Questions

- Whether numeric `columns: 2` should remain base/mobile two-column for backward compatibility or be reinterpreted as desktop-friendly shorthand. A compatibility-preserving plan should prefer adding explicit defaults/helpers over silently changing existing semantics without migration.
- Whether locked filters should be visible as non-removable chips, hidden entirely, or configurable per surface.
- Whether filter constraints belong purely in `DataViewSpec.view`, in source operation variables, or as reusable list-state metadata shared by DataView and ad hoc list screens.
- How much implementation should include CLI scaffolding/templates and generated docs in the first slice.

## Likely Codebase Touchpoints

- `packages/libs/contracts-spec/src/forms/forms.ts`
- `packages/libs/contracts-spec/src/forms/forms.test.ts`
- `packages/libs/contracts-spec/src/data-views/types.ts`
- `packages/libs/contracts-spec/src/data-views/spec.test.ts`
- `packages/libs/contracts-runtime-client-react/src/form-render.impl.tsx`
- `packages/libs/contracts-runtime-client-react/src/form-render.impl.test.tsx`
- `packages/libs/design-system/src/renderers/form-contract.test.tsx`
- `packages/libs/design-system/src/components/data-view/DataViewRenderer.tsx`
- `packages/libs/design-system/src/components/data-view/DataViewRenderer.native.tsx`
- `packages/libs/design-system/src/components/data-view/DataViewRenderer.test.tsx`
- `packages/libs/design-system/src/hooks/useListUrlState.ts`
- `packages/libs/presentation-runtime-core/src/index.ts`
- `packages/libs/presentation-runtime-react/src/index.ts`
- `packages/libs/presentation-runtime-react-native/src/index.ts`
- package READMEs and `/docs/libraries/cross-platform-ui` / DataView/FormSpec docs if public authoring semantics change
- `.changeset/*.md` and `.changeset/*.release.yaml` for release-facing docs if implementation proceeds
