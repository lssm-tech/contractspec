# @contractspec/lib.provider-spec

Website: https://contractspec.io

Typed provider-routing, runtime-target, execution-receipt, comparison, and patch-proposal contracts for the Builder control plane.

## What It Provides

- Runtime-mode, provider-kind, task-type, risk, and comparison enums.
- Runtime target, handshake, trust-profile, and lease contracts.
- External execution provider, routing policy, context bundle, receipt, and patch proposal types.
- Validation helpers for routing policies, receipts, and runtime target records.

## Public Entry Points

- `.` resolves through `./src/index.ts`
- `./types` resolves through `./src/types.ts`
- `./validation` resolves through `./src/validation.ts`

## Notes

- This package is a compatibility surface. Prefer additive evolution.
- Provider routing stays explicit policy, not hidden heuristics.
