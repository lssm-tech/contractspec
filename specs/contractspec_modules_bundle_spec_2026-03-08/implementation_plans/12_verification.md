# Implementation Plan: Verification Matrix

- **Spec:** 14_verification_matrix.md
- **Status:** Done
- **Package:** `@contractspec/lib.surface-runtime`

## Why this exists

Enforces that every surface documents behavior for all 7 preference dimensions. Ensures personalization is first-class, not an afterthought. Enables verification checks and snapshot coverage.

## Objectives

1. Require SurfaceVerificationSpec on every SurfaceSpec.
2. Implement verification checks: non-empty descriptions, capability-gated dimensions.
3. Add snapshot coverage for key surfaces and preference combinations.
4. Document "what does each dimension change in this surface?" for review.

## Non-goals (v1)

- Automated verification of runtime behavior (manual review first).
- Full snapshot matrix for all surfaces (pilot surfaces first).

## Codebase alignment

- SurfaceVerificationSpec in 03_core_bundle_spec.md.
- 7 dimensions from 01_preference_dimensions.md.
- Verification block required by Rule 1 in 03.

## Workstreams

### WS1 — Verification requirement

- [x] Ensure SurfaceVerificationSpec is required in ModuleBundleSpec.
- [x] Add validator: every surface has verification.dimensions with all 7 keys.
- [x] Add validator: each dimension has non-empty string description (min 10 chars).
- [x] Reject bundle specs with missing or empty verification.

### WS2 — Snapshot coverage

- [x] Define snapshot format for surface + preference combination.
- [x] Add snapshots for pilot route (issue-workbench) at key preference points.
- [x] Add snapshots for density variants (minimal, compact, dense).
- [x] Add snapshots for guidance variants (none, hints, wizard).

### WS3 — Review and docs

- [x] Document verification review questions per surface.
- [x] Add verification matrix table to docs (surface × dimension × behavior).
- [x] Ensure PM workbench pilot has complete verification block.

## Dependencies

- 01_core_bundle (SurfaceVerificationSpec).
- 06_entity_surfaces (PM workbench surfaces).
- 03_personalization (dimension mapping).

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Verification becomes boilerplate | Enforce in validator; reject invalid specs. |
| Snapshots drift | Version format; review in PR. |
