# Phased Roadmap

## Phase 0. Spec hardening

Deliverables:

- finalize artifact model
- finalize adapter API
- finalize verifier stages
- define success metrics and sample repos

Exit criteria:

- V1 scope is frozen
- local artifact schemas are stable enough to implement

## Phase 1. Bootstrap and install

Deliverables:

- `npx @contractspec/connect init`
- `contractspec connect install claude`
- config and overlay scaffolding
- local storage layout

Exit criteria:

- developer can install Connect in one command
- adapter hooks are placed correctly
- repository can load config without Studio

## Phase 2. Impact index

Deliverables:

- file → contract → surface mapping
- incremental refresh
- unknown-impact path detection
- integration with imported and generated manifests

Exit criteria:

- Connect can answer impacted contracts and surfaces for a proposed edit

## Phase 3. Typed context packs

Deliverables:

- context builder
- provenance and trust levels
- canon pack ingestion
- task-scoped context filtering

Exit criteria:

- adapters can request minimal trusted context for a task or tool call

## Phase 4. Plan packets and verification

Deliverables:

- `contractspec connect plan --stdin`
- plan packet schema
- plan risk scoring
- approval and check attachment

Exit criteria:

- risky or incomplete plans are caught before write actions

## Phase 5. Pre-write and pre-command gate

Deliverables:

- normalized action model
- verifier pipeline
- path boundary checks
- drift and breaking-change checks
- command risk engine
- verdict synthesis

Exit criteria:

- Connect can block or rewrite unsafe file edits and shell commands

## Phase 6. Local audit and replay

Deliverables:

- `audit.ndjson`
- decision ids
- replay command
- regression evaluation support

Exit criteria:

- blocked or permitted actions can be reproduced from evidence

## Phase 7. Studio review bridge

Deliverables:

- local review packet format
- Studio sync integration
- deep links to review queues
- preserved lineage between local decision and Studio review

Exit criteria:

- `require_review` decisions become governed review items

## Phase 8. Shared canon packs

Deliverables:

- signed pack format
- local pack cache
- sync command
- policy precedence rules

Exit criteria:

- org-level engineering canon can be consumed read-only across repos

## Phase 9. Handoff, remediation, and outcome loop

Deliverables:

- generation of handoff packs
- remediation pack generation
- outcome check references

Exit criteria:

- reviewed changes can move from local decision to managed follow-up artifacts

## Phase 10. Managed lanes and schedules

Deliverables:

- Mission Control integration
- scheduled review windows
- caps and thresholds
- multi-agent routing support

Exit criteria:

- Connect can feed managed agent lanes without weakening local safety

## Recommended V1 cut

For an actual first release, stop at Phase 7.

Phases 1 through 7 provide the proof:
- one-command installation
- contract-aware planning
- pre-write enforcement
- local audit and replay
- governed escalation into Studio
