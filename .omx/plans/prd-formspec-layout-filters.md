# PRD: FormSpec Responsive Layout And Scoped Filters

## Status

Consensus approved on 2026-04-23.

Planner, architect, and critic agreed this should be implemented as additive contract work first, followed by renderer/runtime integration. No implementation has started in this plan artifact.

## Problem

FormSpec has responsive layout primitives, but numeric `layout.columns` currently maps to base grid classes in the React form renderer. That means contracts using `columns: 2` can render two fields per row on mobile. Separately, DataView/list filters are represented as loose active filter maps in rendering/runtime layers, so generic list contracts cannot reliably be reused as scoped listings with non-removable constraints such as "posts in this category".

## Goals

- Preserve existing public FormSpec semantics.
- Add an explicit mobile-safe layout authoring helper.
- Make initial and locked filters first-class contract state.
- Keep URL state limited to user-editable filters.
- Render locked filters consistently across web and native.
- Provide regression tests before implementation claims completion.

## Non-Goals

- Do not reinterpret `layout.columns: 2` as desktop-only shorthand.
- Do not solve locked filters only in renderer props or operation-variable code.
- Do not make locked filters hidden-only by default.
- Do not add dependencies.

## Decision

Implement two additive contract surfaces:

1. `responsiveFormColumns(...)` in `@contractspec/lib.contracts-spec/forms`.
   - Returns plain `ResponsiveColumns` contract data.
   - Default output for `responsiveFormColumns(2)` should be `{ base: 1, md: 2 }`.
   - Existing numeric `columns: 2` remains base/mobile two-column behavior.

2. `DataViewBaseConfig.filterScope?: DataViewFilterScope` in `@contractspec/lib.contracts-spec/data-views`.
   - `initial` seeds editable filter state.
   - `locked` is always applied, cannot be removed, and is not URL-persisted.
   - `lockedChips` defaults to `"visible-disabled"`.

## Contract Shape

```ts
export type DataViewFilterScalar = string | number | boolean;
export type DataViewFilterComparable = string | number;

export type DataViewFilterOperator =
  | "eq"
  | "neq"
  | "contains"
  | "in"
  | "notIn"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "isNull"
  | "isNotNull";

export type DataViewFilterValue =
  | { kind: "single"; value: DataViewFilterScalar }
  | { kind: "multi"; values: DataViewFilterScalar[] }
  | {
      kind: "range";
      from?: DataViewFilterComparable;
      to?: DataViewFilterComparable;
      includeFrom?: boolean;
      includeTo?: boolean;
    }
  | {
      kind: "composite";
      mode: "and" | "or";
      clauses: DataViewFilterClause[];
    };

export interface DataViewFilterClause {
  filterKey: string;
  field: string;
  operator: DataViewFilterOperator;
  value?: DataViewFilterValue;
}

export type DataViewFilterSet = Record<string, DataViewFilterValue | undefined>;

export interface DataViewFilterScope {
  initial?: DataViewFilterSet;
  locked?: DataViewFilterSet;
  lockedChips?: "visible-disabled" | "hidden";
}
```

Extend `DataViewFilter` additively with:

```ts
operator?: DataViewFilterOperator;
valueMode?: "single" | "multi" | "range" | "composite";
```

Attach `filterScope?: DataViewFilterScope` to `DataViewBaseConfig`.

## Precedence

- User filters start from `filterScope.initial`, then apply URL/restored user edits.
- Locked filters come only from `filterScope.locked`.
- URL serialization writes only user filters.
- Effective filters are sanitized/pruned user clauses plus locked clauses.
- Locked filters win conflicts.
- `single` and `multi` conflict by `field + operator`.
- `range` conflicts by bound direction:
  - `from` normalizes to `gte` or `gt`
  - `to` normalizes to `lte` or `lt`
  - `from + to` normalizes to `between`
  - locked `between` prunes user `gt/gte/lt/lte/between` on the same field
  - locked lower bounds prune user lower-bound clauses on the same field
  - locked upper bounds prune user upper-bound clauses on the same field
- `composite` clauses are normalized and pruned independently.
- Empty values are removed during sanitization.
- Sanitized payloads preserve `DataViewFilterValue.kind`.

## Rejected Alternatives

- Reinterpret numeric `columns` as `{ base: 1, md: n }`: rejected because it silently changes a public rendering contract.
- Put locked constraints only into operation variables: rejected because URL state, chips, and native renderers would keep inventing separate behavior.
- Make locked chips hidden-only by default: rejected because constrained listings should be explainable by default.

## Implementation Phases

1. Contracts first:
   - `packages/libs/contracts-spec/src/forms/forms.ts`
   - `packages/libs/contracts-spec/src/forms/index.ts`
   - `packages/libs/contracts-spec/src/forms/forms.test.ts`
   - `packages/libs/contracts-spec/src/data-views/types.ts`
   - `packages/libs/contracts-spec/src/data-views/index.ts`
   - `packages/libs/contracts-spec/src/data-views/*.test.ts`

2. Form renderer:
   - `packages/libs/contracts-runtime-client-react/src/form-render.impl.tsx`
   - `packages/libs/contracts-runtime-client-react/src/form-render.impl.test.tsx`
   - `packages/libs/design-system/src/renderers/form-contract.test.tsx`

3. Runtime state:
   - `packages/libs/presentation-runtime-core/src/index.ts`
   - `packages/libs/presentation-runtime-react/src/index.ts`
   - `packages/libs/presentation-runtime-react-native/src/index.ts`
   - focused runtime tests for effective filters, clear/reset, and URL hydration

4. Design-system rendering and URL state:
   - `packages/libs/design-system/src/hooks/useListUrlState.ts`
   - `packages/libs/design-system/src/components/data-view/DataViewRenderer.tsx`
   - `packages/libs/design-system/src/components/data-view/DataViewRenderer.native.tsx`
   - `packages/libs/design-system/src/components/data-view/DataViewRenderer.test.tsx`

5. Docs and release:
   - nearest package READMEs
   - cross-platform UI and DataView/FormSpec docs if public semantics are documented there
   - paired `.changeset/*.md` and `.changeset/*.release.yaml`
   - ContractSpec Connect review/evidence artifacts before risky edits or shell execution

## Execution Guidance

Ralph path: use one executor for contract additions first, then renderer/runtime integration, with verifier passes after form rendering and after filter rendering.

Team path: use one owner for contracts first, then parallelize form renderer, presentation runtime, design-system renderer/URL state, and docs/release evidence. Do not parallelize contract shape decisions.

## Done Criteria

- Contract types and helpers are additive.
- Existing `layout.columns: 2` behavior has a regression test.
- `responsiveFormColumns(2)` has a mobile-safe output test.
- DataView filter-scope resolution has contract-level tests.
- URL state excludes locked filters from persisted user state.
- Clear/reset preserves locked filters.
- Web and native DataView renderers show locked filters as disabled/non-removable chips by default.
- Docs and release capsules reflect the public contract changes.
