# Security and Governance

## Security stance

Connect must default to local-first operation and least privilege. The adapter is an enforcement point, not a data vacuum.

## Principles

1. Local source artifacts stay local by default
2. Only structured packets or evidence leave the machine when sync is enabled
3. Canon packs are read-only and versioned
4. Inferred conventions are never silently promoted to canonical policy
5. High-risk or unknown-impact actions require human review
6. Audit data must support replay
7. Retention and purge behavior must be explicit for synced artifacts

## Protected file classes

A repository may mark file groups as:

- immutable
- review-required
- generated-only
- secret-adjacent
- policy-owned

Connect should refuse direct agent mutation where these policies apply.

## Command policy model

Commands should be classified:

- safe
- scoped-risky
- destructive
- unknown

### Examples

- safe: focused test runs, linting, type checks
- scoped-risky: framework generators, migration creation, code formatters on limited paths
- destructive: mass delete, broad reset, force pushes, shell piping to remote execution
- unknown: anything not matched

Unknown and destructive commands should never silently pass.

## Escape hatches

Connect should support exceptions, but not as random inline comments sprinkled through source. Escape hatches must be structured:

- temporary override token
- reviewer identity
- expiry
- rationale
- scope

This keeps exceptions visible and auditable.

## Review thresholds

A default threshold model might be:

- contract drift: review
- breaking change: review or deny
- unknown-impact path: review
- destructive command: deny
- protected file write: review or deny
- low-risk scoped refactor with clean checks: permit

## Retention

Local audit retention should be configurable. Synced review artifacts should follow Studio retention and purge rules where available, but the local copy should remain under repository control unless explicitly removed.
