# Harness and Readiness Gates

## Why harness matters here

The whole point of Builder is not to trust any single provider run.
Harness is the layer that turns delegated work into something you can justify.

## Builder-specific harness suites

### 1. Blueprint consistency suite
Checks:
- domain and workflow consistency,
- no orphaned required surfaces,
- policy-linked constraints are represented.

### 2. Source coverage suite
Checks:
- each major blueprint area has evidence,
- inferred items are clearly marked,
- critical items are not backed only by low-confidence STT.

### 3. Provider receipt integrity suite
Checks:
- every delegated run has a receipt,
- context hashes match,
- output hashes are present,
- provider/model fields are populated where available.

### 4. Patch proposal verification suite
Checks:
- diff structure is sane,
- changed areas match the declared task,
- no out-of-scope writes,
- required tests or assertions exist.

### 5. Mobile parity suite
Checks:
- each required mobile flow has a supported path,
- blocked mobile features are surfaced,
- deep-link fallback exists where needed,
- evidence and approval surfaces are accessible from mobile.

### 6. Runtime compatibility suite
Checks:
- managed compatibility,
- local compatibility,
- hybrid compatibility,
- runtime-specific blockers are visible.

### 6a. Full-app browser verification suite
Checks:
- deterministic Playwright scenarios execute functional paths,
- optional agent-browser scenarios capture visual/computer-use evidence,
- authenticated flows use named storage-state/profile/session/header refs,
- screenshots, DOM snapshots, accessibility snapshots, console output, and replay bundles are retained without raw secrets.

### 7. Channel replay suite
Checks:
- Telegram / WhatsApp events replay deterministically,
- edits/deletes are handled consistently,
- duplicate delivery does not duplicate mutations.

### 8. STT confidence suite
Checks:
- transcript confidence thresholds,
- risky directives require confirmation,
- language mismatch is surfaced.

### 9. Export reproducibility suite
Checks:
- same blueprint + same policy + same runtime target produce consistent export artifacts,
- major diff changes are explained.

## Readiness report

`BuilderReadinessReport` should expose:
- `overallStatus`
- `managedReady`
- `localReady`
- `hybridReady`
- `mobileParityStatus`
- `blockingIssues[]`
- `warnings[]`
- `providerSummary`
- `runtimeSummary`
- `requiredApprovals[]`
- `recommendedNextAction`
- `evidenceBundleRef`

## Blocking rules

Export must be blocked when:
- required mobile parity for the selected app class is not met,
- runtime compatibility is missing,
- provider receipt integrity fails,
- high-risk unresolved conflicts remain,
- policy suite fails,
- high-risk STT-derived instruction remains unconfirmed,
- required approval strength is missing.
- authenticated browser evidence embeds raw credentials, cookies, or bearer tokens.

## UX requirement

The readiness screen must answer:
- what is ready,
- what is not,
- for which runtime mode,
- on which channel surfaces,
- because of which evidence.
