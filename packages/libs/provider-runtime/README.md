# @contractspec/lib.provider-runtime

Website: https://contractspec.io

Builder provider-runtime helpers for runtime-target normalization, provider registration, routing policy upserts, execution-context preparation, receipt normalization, and comparison records.

## What It Provides

- Runtime-target and external-provider record factories.
- Routing-policy and execution-context normalization helpers.
- Provider-output normalization into receipts, sources, patch proposals, activity records, and mobile review cards.
- Comparison-run record factories shared by Builder runtime and compatibility integrations.

## Public Entry Points

- `.` resolves through `./src/index.ts`

## Notes

- This package is a compatibility surface. Prefer additive evolution.
- It carries provider/runtime control-plane logic that should remain reusable outside the Builder runtime package.
