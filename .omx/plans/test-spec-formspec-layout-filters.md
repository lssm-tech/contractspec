# Test Spec: FormSpec Responsive Layout And Scoped Filters

## Scope

This test spec covers the consensus plan in `.omx/plans/prd-formspec-layout-filters.md`.

## Contract Tests

Package: `@contractspec/lib.contracts-spec`

Required tests:

- `responsiveFormColumns(2)` returns `{ base: 1, md: 2 }`.
- `responsiveFormColumns(3, { breakpoint: "lg" })` returns `{ base: 1, lg: 3 }`.
- Raw `layout.columns: 2` remains accepted and unchanged by `defineFormSpec` / `normalizeFormSpec`.
- `DataViewBaseConfig.filterScope` accepts `initial`, `locked`, and `lockedChips`.
- `DataViewFilter` accepts additive `operator` and `valueMode`.
- Effective filter helpers prove:
  - locked filters are always present in effective clauses
  - initial filters seed user state only
  - user filters override non-locked dimensions
  - user filters cannot override locked dimensions
  - empty single/multi/range/composite values are pruned
  - composite clauses are pruned independently
  - sanitized payloads preserve `DataViewFilterValue.kind`

Suggested command:

```bash
bun run --cwd packages/libs/contracts-spec test
```

## Form Renderer Tests

Package: `@contractspec/lib.contracts-runtime-client-react`

Required tests:

- Legacy numeric `layout.columns: 2` still renders base `grid-cols-2`.
- Helper-generated `{ base: 1, md: 2 }` renders `grid-cols-1 md:grid-cols-2`.
- Explicit `{ base: 2, md: 4 }` still renders base mobile two-column plus desktop four-column classes.
- Group layout uses the same column class resolution as top-level layout.
- Field `colSpan` behavior remains unchanged.

Suggested command:

```bash
bun run --cwd packages/libs/contracts-runtime-client-react test
```

## Design-System Form Tests

Package: `@contractspec/lib.design-system`

Required tests:

- Shared FormSpec renderer still renders rich field showcase.
- Mobile-safe helper output appears in rendered class output when a helper-authored spec is used.
- Existing showcase layout assertions remain valid unless deliberately updated.

Suggested command:

```bash
bun run --cwd packages/libs/design-system test
```

## Presentation Runtime Tests

Packages:

- `@contractspec/lib.presentation-runtime-core`
- `@contractspec/lib.presentation-runtime-react`
- `@contractspec/lib.presentation-runtime-react-native`

Required tests:

- URL/restored user filters are sanitized against locked filters.
- Effective variables include locked filters.
- URL serialization omits locked filters.
- Hydration re-derives locked filters from contract scope.
- `clearAll` / reset removes only user-editable filters.
- React and React Native list coordination semantics match.

Suggested commands:

```bash
bun run --cwd packages/libs/presentation-runtime-core test
bun run --cwd packages/libs/presentation-runtime-react test
bun run --cwd packages/libs/presentation-runtime-react-native test
```

## DataView Renderer And URL Tests

Package: `@contractspec/lib.design-system`

Required tests:

- Editable user filter chips are removable.
- Visible locked chips are disabled/non-removable by default.
- `lockedChips: "hidden"` suppresses locked chips while preserving effective locked filters.
- Removing a user chip preserves locked filters.
- Clearing all chips preserves locked filters.
- Web and native `DataViewRenderer` behavior is paired.
- `useListUrlState` serializes only user-editable filters and round-trips them without losing locked scope.

Suggested command:

```bash
bun run --cwd packages/libs/design-system test
```

## Governance And Release Verification

Before implementation edits or risky shell execution:

```bash
bun packages/apps/cli-contractspec/src/cli.ts connect context
bun packages/apps/cli-contractspec/src/cli.ts connect plan
```

After implementation:

```bash
bun run --cwd packages/libs/contracts-spec typecheck
bun run --cwd packages/libs/contracts-runtime-client-react typecheck
bun run --cwd packages/libs/presentation-runtime-core typecheck
bun run --cwd packages/libs/presentation-runtime-react typecheck
bun run --cwd packages/libs/presentation-runtime-react-native typecheck
bun run --cwd packages/libs/design-system typecheck
bun run --cwd packages/libs/contracts-spec lint:check
bun run --cwd packages/libs/contracts-runtime-client-react lint:check
bun run --cwd packages/libs/presentation-runtime-core lint:check
bun run --cwd packages/libs/presentation-runtime-react lint:check
bun run --cwd packages/libs/presentation-runtime-react-native lint:check
bun run --cwd packages/libs/design-system lint:check
bun packages/apps/cli-contractspec/src/cli.ts connect verify
```

Release-surface checks:

- Add paired `.changeset/*.md` and `.changeset/*.release.yaml`.
- Run `bun run release:build` if changelog/docs surfaces depend on generated release artifacts.
- Run package docs generation only if docs surfaces are changed by implementation.

## Residual Risks

- The first implementation slice must avoid silently changing raw numeric `columns`.
- The `DataViewFilterValue` model should stay JSON-serializable.
- URL adapters must not accept locked constraints from user-controlled query params as authoritative.
- Web/native visual parity still requires manual or screenshot validation if chip styling changes materially.
