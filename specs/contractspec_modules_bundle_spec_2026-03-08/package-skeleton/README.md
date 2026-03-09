# Package Skeleton for `@contractspec/lib.surface-runtime`

This is a starter scaffold, not a full implementation.

## What it demonstrates

- package boundary
- exports map
- basic types
- runtime entry points
- React renderer shell
- adapter shells for the selected UI libraries

## What it does not pretend to solve

- full plan resolution
- complete overlay merge semantics
- AI approval workflows
- real field renderer implementations
- production-quality SSR/hydration logic

That work belongs in the real package, not in a stunt scaffold.

## Suggested next steps

1. Make `spec/types.ts` the canonical bundle type source.
2. Implement patch validation and inverse-op generation first.
3. Implement `resolveBundle()` for one real PM route.
4. Wire `BundleRenderer` to render one actual surface from plan.
5. Add AI proposal flow only after the non-AI resolver is stable.
