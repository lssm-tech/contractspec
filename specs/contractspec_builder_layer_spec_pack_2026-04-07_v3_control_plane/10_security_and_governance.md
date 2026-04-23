# Security and Governance

## Core stance

Builder is a governed system.
Channel convenience must never outrank approval integrity.

## Trust boundaries

There are four independent trust domains:
1. human/channel identity
2. Builder + Studio control plane
3. external execution providers
4. runtime targets

They must not collapse into one vague trust blob.

## Human and channel security

Required controls:
- explicit workspace binding,
- participant binding and revocation,
- duplicate webhook protection,
- replay protection,
- timestamp validation where possible,
- approval-strength mapping by channel and action class.

Mobile users can be first-class.
They are not implicitly high-trust.

## Provider security

External providers must be isolated by:
- scoped context bundles,
- scoped write permissions,
- ephemeral credentials when possible,
- output normalization,
- receipt capture,
- post-run verification.

Provider output is proposal material until accepted.

## Harness browser security

Browser verification may exercise authenticated app paths, but auth must be referenced, not copied:
- storage-state, browser-profile, session-name, and headers-env refs are allowed,
- scenario specs and replay bundles must not contain raw credentials, cookies, or bearer tokens,
- browser targets must enforce allowlisted domains,
- visual and DOM evidence must be treated as audit artifacts with the same retention policy as other harness evidence.

## Runtime target security

### Managed
- hosted secret vaulting,
- tenancy isolation,
- audited provider access,
- managed update cadence.

### Local
- explicit runtime registration,
- runtime trust profile,
- local secret ownership,
- visible sync and relay settings.

### Hybrid
- explicit local/managed data boundary,
- explicit artifact and evidence egress policy,
- visible degraded mode behavior.

## Policy classes

Builder should separate policy by action class:
- source ingestion
- blueprint mutation
- provider delegation
- patch proposal acceptance
- preview publication
- export
- runtime registration and modification
- connector activation

## Approval policy

Examples:
- low-risk copy tweak: bound channel ack may be enough
- medium-risk workflow or connector change: stronger approval or mobile review session
- high-risk export or auth weakening: Studio signed or admin signed only

## Mandatory audit artifacts

- source provenance
- decision ledger
- provider receipts
- patch proposal history
- approval tickets
- harness results
- runtime target history
- export bundles

## Kill switches and incident controls

Minimum controls:
- revoke a participant binding,
- disable a provider,
- quarantine a runtime target,
- freeze export,
- downgrade a workspace to review-only,
- require re-approval after suspicious changes.

## Privacy note

Local runtime and managed runtime should be transparent choices.
Users must know:
- where data is processed,
- where provider calls occur,
- what leaves local runtime,
- what is retained for replay.
