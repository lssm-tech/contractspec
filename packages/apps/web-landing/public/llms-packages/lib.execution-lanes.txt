# @contractspec/lib.execution-lanes

Website: https://contractspec.io

Typed execution-lane contracts, registries, runtimes, evidence gating, and backend adapter ports for ContractSpec.

## What It Provides

- Lane contracts for `clarify`, `plan.consensus`, `complete.persistent`, and `team.coordinated`.
- Typed handoff artifacts including clarification artifacts, plan packs, completion records, team snapshots, and lane runtime state.
- Runtime primitives for consensus planning, persistent completion loops, coordinated team runs, lane selection, evidence gating, and in-memory persistence.
- Backend-neutral adapter ports for in-process, subagent, tmux, queue, and workflow-engine execution.

## Public Entry Points

- `.` resolves through `./src/index.ts`
- `./types` resolves through `./src/types/index.ts`
- `./defaults` resolves through `./src/defaults/index.ts`
- `./interop` resolves through `./src/interop/index.ts`

## Notes

- The package stays runtime- and backend-neutral; storage-backed operator persistence belongs in integration and app layers.
- Evidence normalization and replay references align with `@contractspec/lib.harness`; this package does not introduce a second proof model.
- Role semantics live in typed role profiles, not prompt prose.
- Canonical artifact and evidence identifiers use spec-style snake_case names; readers normalize older hyphenated aliases for persisted compatibility.
- Command semantics for `/clarify`, `/plan`, `/plan --consensus`, `/complete`, and `/team` live in the typed `./interop` surface rather than in prompt prose alone.
