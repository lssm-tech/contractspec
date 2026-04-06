# Security and Governance

## Security stance

Connect is a local enforcement layer, not a data-extraction layer.

Local repo state and authoritative artifacts stay local unless explicit review-packet transport is enabled.

## Principles

1. Canonical contracts outrank inferred convention
2. Local config outranks ephemeral agent memory
3. Protected, immutable, and destructive paths must be explicit
4. Review-required and denied outcomes must be replayable
5. Connect verdicts must map back to underlying runtime state
6. Studio transport must never be required for local safety

## Protected file classes

The `connect.policy` section may classify paths as:

- `protectedPaths`
- `immutablePaths`
- `generatedPaths`

Connect should use these classes before any mutating action proceeds.

## Command policy model

Command policy is allow, review, deny:

- `allow`
- `review`
- `deny`

Examples:

- allow: targeted `bun run typecheck`, narrow `bun test`
- review: wide formatters, generator commands, repo-wide importers
- deny: force push, hard reset, broad delete

Unknown destructive commands must not silently pass.

## Review thresholds

The default threshold model should cover:

- protected path write → `require_review`
- unknown impact → `require_review`
- contract drift → `require_review`
- breaking change → `require_review`
- destructive command → `deny`

Repos may tighten these, but Connect should not default to silent risk.

## Approval model

Connect does not invent a new approval contract.

When approval is required, Connect should point back to existing runtime surfaces such as:

- `controlPlane.execution.approve`
- `controlPlane.execution.reject`
- `agent.approvals`

## Retention

Local retention should remain under repo control.

If Studio transport is enabled, synced review packets follow Studio retention there, but local artifacts remain local until explicitly removed.
