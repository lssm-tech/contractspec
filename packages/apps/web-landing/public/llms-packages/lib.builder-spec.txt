# @contractspec/lib.builder-spec

Website: https://contractspec.io

Typed Builder control-plane contracts, capabilities, operations, events, and validation for governed omnichannel authoring.

## What It Provides

- Builder workspace, conversation, source, directive, blueprint, plan, preview, readiness, and export types.
- Full Builder command/query/event surface aligned with the Builder layer spec pack.
- Capability specs for chat, voice, ingestion, fusion, planning, preview, harness, and export workflows.
- Validation helpers for runtime and host layers.

## Public Entry Points

- `.` resolves through `./src/index.ts`
- `./capabilities` resolves through `./src/capabilities/index.ts`
- `./commands` resolves through `./src/commands/index.ts`
- `./events` resolves through `./src/events/index.ts`
- `./queries` resolves through `./src/queries/index.ts`
- `./types` resolves through `./src/types/index.ts`
- `./validation` resolves through `./src/validation/index.ts`

## Notes

- This package is a compatibility surface. Additive evolution is preferred.
- Builder orchestration reuses execution-lane identifiers and harness evidence references instead of introducing a second runtime taxonomy.
- Generated-app runtime channels are out of scope here; this package models the Builder control plane only.
