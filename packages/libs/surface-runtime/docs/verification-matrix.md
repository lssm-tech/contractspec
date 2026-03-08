# Verification Matrix (14_verification_matrix)

Every surface must declare `verification.dimensions` for all 7 preference dimensions. This ensures personalization is first-class, not an afterthought.

## Required columns

| Column | Description |
|--------|-------------|
| bundle key | Bundle identifier |
| route / context | Route path or context |
| surface id | Surface identifier |
| guidance | How guidance dimension affects this surface |
| density | How density dimension affects this surface |
| dataDepth | How data depth dimension affects this surface |
| control | How control dimension affects this surface |
| media | How media dimension affects this surface |
| pace | How pace dimension affects this surface |
| narrative | How narrative dimension affects this surface |
| notes / constraints | Capability gates, unavailable values |

## Pilot: PM issue workbench

| Bundle | Route | Surface | Guidance | Density | Data Depth | Control | Media | Pace | Narrative |
|--------|-------|---------|----------|---------|------------|---------|-------|------|-----------|
| `pm.workbench` | `/operate/pm/issues/:issueId` | `issue-workbench` | Inline hints or walkthrough rail when walkthrough+ | Compact to dense 3-pane layouts; minimal single-pane | Summary through detailed relation hydration | Advanced commands gated by capability | Text summary, visual relation graph, hybrid assistant | Motion tokens and confirmation depth from pace | Summary-first or evidence-first reorder |

## Review questions

When reviewing a new bundle or surface, ask:

1. **What does `density=dense` actually do here?** — Layout change? Panel count? Table density?
2. **What changes when `control=full`?** — New tabs? Raw config? Batch ops?
3. **Is `narrative=bottom-up` visible in the ordering?** — Evidence before conclusion?
4. **What happens when `dataDepth=exhaustive` is requested but not allowed?** — Downgrade? Error?
5. **How is `pace=rapid` expressed beyond "faster animations"?** — Fewer confirmations? Batch defaults?
6. **If `media=voice`, what is rendered differently?** — TTS? Voice input? Audio summaries?
7. **If `guidance=wizard`, does the surface actually become more guided?** — Step indicators? Ceremony?

If the answers are fuzzy, the surface is not ready.

## Automated checks

- **Check 1:** Every surface has all 7 dimension descriptions (enforced by `defineModuleBundle`).
- **Check 2:** Every dimension description is non-empty and at least 10 characters (enforced by `defineModuleBundle`).
- **Check 3:** Capability-gated dimensions should explicitly mention "gated" or "capability" in the description.
- **Check 4:** If a surface disables a dimension effect, the description must say why (e.g. "voice unavailable", "exhaustive clamped").

## Snapshot coverage

For pilot surfaces, snapshot tests cover:

- Density variants: minimal, compact, standard, dense
- Guidance variants: none, hints, wizard
- Narrative variants: top-down, bottom-up

See `src/spec/verification-snapshot.test.ts` and `src/spec/__snapshots__/`.
