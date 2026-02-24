# PreferenceDimensions Reference

Use this reference when implementing or auditing preference-aware behavior.

## Canonical Sources

- Types: `packages/libs/contracts-contractspec-studio/src/preferences/types.ts`
- Schemas: `packages/libs/contracts-contractspec-studio/src/preferences/schemas.ts`
- Presets: `packages/libs/contracts-contractspec-studio/src/preferences/presets.ts`
- Resolver: `packages/libs/contracts-contractspec-studio/src/preferences/resolver.ts`
- Constraints: `packages/libs/contracts-contractspec-studio/src/preferences/constraints.ts`
- Numeric levels: `packages/libs/contracts-contractspec-studio/src/preferences/numeric-levels.ts`

## 7 Dimensions and Allowed Values

| Dimension   | Allowed values                                        |
| ----------- | ----------------------------------------------------- |
| `guidance`  | `none`, `hints`, `tooltips`, `walkthrough`, `wizard`  |
| `density`   | `minimal`, `compact`, `standard`, `detailed`, `dense` |
| `dataDepth` | `summary`, `standard`, `detailed`, `exhaustive`       |
| `control`   | `restricted`, `standard`, `advanced`, `full`          |
| `media`     | `text`, `visual`, `voice`, `hybrid`                   |
| `pace`      | `deliberate`, `balanced`, `rapid`                     |
| `narrative` | `top-down`, `bottom-up`, `adaptive`                   |

Composite shape:

```typescript
interface PreferenceDimensions {
  guidance: GuidanceLevel;
  density: DensityLevel;
  dataDepth: DataDepthLevel;
  control: ControlLevel;
  media: MediaChannel;
  pace: PaceLevel;
  narrative: NarrativeFlow;
}
```

## Resolver Contract (Do Not Break)

Resolution order:

1. mode -> preset (`MODE_PRESET_MAP`)
2. preset -> global overrides
3. global -> area overrides
4. apply mode constraints

All final values must be returned in `ResolvedPreferences` and any clamped values must appear in `constraintsApplied`.

## Current Mode Constraints

| Mode     | Dimension | Disallowed | Fallback   | Reason                                   |
| -------- | --------- | ---------- | ---------- | ---------------------------------------- |
| `guided` | `media`   | `voice`    | `hybrid`   | Voice requires Pro mode or higher        |
| `guided` | `control` | `full`     | `advanced` | Full control requires Pro mode or higher |

`pro` and `autopilot` currently have no preference constraints.

## Ordinal vs Categorical Rules

- Ordinal (numeric comparisons allowed): `guidance`, `density`, `dataDepth`, `control`, `pace`
- Categorical (use equality checks): `media`, `narrative`

Use numeric maps from `numeric-levels.ts`; do not duplicate ad hoc ordering.

## Where Preference Governance Must Be Enforced

- Contracts: `types.ts`, `schemas.ts`, `presets.ts`, `resolver.ts`, `constraints.ts`
- APIs: `packages/apps/web-application/src/app/api/preferences/`
- Persistence: workspace+user `globalOverrides` and `areaOverrides`
- UI providers/hooks: `packages/bundles/example-product/src/presentation/components/preferences/`
- Mode bridge: `packages/bundles/example-product/src/presentation/components/mode/providers/mode-provider/`
- Audit/analytics: preference change, reset, and constrained events

## Change Checklist (Dimension/Value Additions)

If you add or change any dimension or allowed value, update all of the following:

1. `types.ts` (`PreferenceDimensions`, value unions, keys)
2. `schemas.ts` (zod enums/object shape)
3. `presets.ts` (all preset objects)
4. `resolver.ts` and `constraints.ts` (fallback behavior)
5. `numeric-levels.ts` (if the dimension is ordinal)
6. Provider types/hooks and UI controls
7. API validation and serialization
8. Tests (schema, resolver, constraints, provider integration)
9. Documentation/spec references

## Anti-Patterns

- Using raw mode checks for preference-driven UI behavior
- Persisting values without schema validation
- Applying client-only constraints and skipping server-side constraint enforcement
- Returning clamped values without `constraintsApplied` explanation
- Re-declaring preference types in app/bundle code instead of importing contracts
