# Acceptance Scenarios

## 1. Safe scoped refactor

Input:

- agent proposes a small change in a non-protected runtime file
- workspace impact resolves known contracts and surfaces
- targeted Bun smoke checks pass

Expected result:

- `PlanPacket.verificationStatus = "approved"`
- `PatchVerdict.verdict = "permit"`
- runtime mapping is non-blocked and approval is not required

## 2. Protected path mutation

Input:

- agent proposes edits under `packages/libs/contracts-spec/**`
- repo config marks the path as protected

Expected result:

- `PatchVerdict.verdict = "require_review"` or `deny`, depending on threshold
- evidence includes affected contracts and required approvals
- local `ReviewPacket` is emitted

## 3. Unknown-impact path

Input:

- agent proposes a mutation on a path with no confident impact mapping
- config threshold for unknown impact is review

Expected result:

- `PatchVerdict.verdict = "require_review"`
- remediation asks for scope clarification or additional spec linkage
- replay refs point back to trace and policy explanation

## 4. Contract drift or breaking change

Input:

- workspace impact detects drift or a breaking API change
- impacted contracts are known

Expected result:

- `PatchVerdict.verdict = "require_review"` or `deny`
- failed checks explicitly call out drift or breaking change
- remediation includes spec alignment and targeted regeneration or validation

## 5. CLI acceptance

Input:

- operator runs `contractspec connect plan --task task-1 --stdin`
- operator runs `contractspec connect verify --task task-1 --tool acp.fs.access --stdin`
- operator reuses `contractspec impact --baseline origin/main` and `contractspec control-plane trace replay`

Expected result:

- Connect DTOs are emitted by the main CLI
- latest artifacts are updated under `.contractspec/connect/`
- replay delegates to existing trace surfaces rather than a second replay stack

## 6. Replay and evaluation acceptance

Input:

- prior decision id exists locally
- corresponding trace refs and review artifacts exist
- operator runs `contractspec connect eval <decision-id> --registry ./harness-registry.ts --scenario connect.safe-refactor`
- operator can also run `contractspec harness eval --registry ./harness-registry.ts --scenario connect.safe-refactor --browser-engine both`

Expected result:

- Connect can reconstruct the local decision envelope
- local decision snapshots resolve from `.contractspec/connect/decisions/<decisionId>/`
- trace refs resolve through existing control-plane services
- harness-style evaluation can be attached without a Connect-specific evaluator
- Playwright and agent-browser browser evidence use the shared harness runtime and preserve auth refs without embedding secrets

## 7. Adapter acceptance

Input:

- Cursor plugin mode
- Codex wrapper mode
- Claude Code rule mode

Expected result:

- adapters remain plugin-first for V1
- approval-required actions are surfaced consistently
- OSS mode stays usable without Studio
