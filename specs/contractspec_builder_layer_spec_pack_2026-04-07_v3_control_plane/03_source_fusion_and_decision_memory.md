# Source Fusion and Decision Memory

## Why this matters

Builder accepts messy, contradictory, multi-channel input.
Without deterministic fusion, the system becomes a guessing machine with receipts.

## Source fusion goals

Builder should decide:
- what was explicitly said,
- what was inferred,
- what supersedes what,
- which statements are approved,
- which statements conflict,
- what remains unresolved,
- which provider outputs are only proposals.

## Precedence model

Recommended precedence, highest first:
1. explicit approved policy and governance artifacts
2. explicit strong human approvals
3. approved Studio snapshots and reviewed Builder decisions
4. explicit user corrections newer than prior guidance
5. directly uploaded source documents
6. high-confidence transcript confirmations
7. ordinary chat statements
8. model/provider-generated proposals and inferred summaries

Notes:
- newer is not always stronger,
- policy beats preference when the two conflict,
- inferred statements never silently override explicit approved directives.

## Decision memory entities

### `DecisionRecord`
Stores one accepted, rejected, or unresolved decision.

Fields:
- `id`
- `workspaceId`
- `decisionType`
- `statement`
- `status`
- `sourceRefs[]`
- `approvalTicketId?`
- `supersedesDecisionId?`
- `confidence`
- `recordedAt`

### `ConflictRecord`
Stores incompatible claims or proposals.

Fields:
- `id`
- `workspaceId`
- `claimARef`
- `claimBRef`
- `severity`
- `resolutionState`
- `resolutionNotes?`

### `InferenceNote`
Stores a system inference that has not been promoted to decision truth.

Fields:
- `id`
- `workspaceId`
- `statement`
- `sourceRefs[]`
- `confidence`
- `requiresConfirmation`

## Reconciliation rules

### Chat vs document
If a user chats “use email login only” but the uploaded security policy requires SSO, surface a conflict.
Do not guess.

### Voice vs text
If voice transcript confidence is weak and text correction arrives later, the text correction wins unless the user explicitly re-confirms the voice interpretation.

### Provider output vs human guidance
If a coding provider proposes a schema or flow that contradicts human-approved blueprint fields, the proposal becomes a conflict or rejection, not a silent update.

### Telegram vs WhatsApp
Bound channel messages from the same participant can both feed the same workspace.
Identity binding and approval strength matter more than channel prestige.

## Decision compilation

Builder should compile source material into:
- requirements,
- constraints,
- policies,
- workflows,
- personas,
- integrations,
- approval intents,
- open questions,
- candidate diffs.

Every compiled item must be labeled as one of:
- explicit,
- approved,
- inferred,
- proposed-by-provider,
- conflicted,
- stale.

## Human-visible memory surfaces

Users must be able to inspect:
- why Builder believes something,
- which source produced it,
- whether it is approved,
- what conflicts exist,
- what changed after a provider run,
- what still needs confirmation.

## Required outputs

- `DecisionLedger`
- `ConflictLedger`
- `BlueprintCoverageMap`
- `SourceTimeline`
- `ProviderProposalRegister`
