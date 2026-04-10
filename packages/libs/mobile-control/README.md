# @contractspec/lib.mobile-control

Website: https://contractspec.io

Typed Builder mobile-control primitives for review cards, parity aggregation, and channel-safe deep-link actions.

## What It Provides

- Mobile parity aggregation for Builder blueprints and review workflows.
- Mobile review card factories shared by Builder runtime and UI surfaces.
- Default card actions that preserve a card/deep-link inspection path for critical review flows.

## Public Entry Points

- `.` resolves through `./src/index.ts`

## Notes

- This package is a compatibility surface. Prefer additive evolution.
- It exists to keep mobile-specific control-plane behavior reusable without duplicating Builder runtime logic.
