# Generation, Preview, and Export

## Purpose

Builder turns fused intent and provider outputs into:
- a structured blueprint,
- generated app/workspace artifacts,
- previews,
- export bundles tied to runtime targets.

## Generation pipeline

1. ingest and fuse sources
2. build or refine blueprint
3. create Builder plan
4. delegate selected tasks to providers
5. normalize patch proposals and artifacts
6. run harness checks
7. compile preview
8. collect approval
9. create export bundle

## Generated artifact classes

- `BlueprintSnapshot`
- `PatchProposalBundle`
- `PreviewBundle`
- `RuntimeProfileBundle`
- `ExportBundle`
- `EvidenceBundle`

## Preview requirements

Preview must support:
- responsive web preview,
- screenshot evidence,
- deterministic Playwright verification and optional agent-browser visual evidence,
- mobile preview evidence,
- channel-specific simulation where needed,
- runtime-mode simulation if behavior differs by target.

## Preview evidence

Every preview should expose:
- blueprint version,
- provider runs used,
- harness suite outcomes,
- browser/visual evidence refs and redacted auth-profile refs when authenticated flows were exercised,
- notable assumptions,
- runtime target used for preview,
- unsupported surfaces or degraded behavior.

## Export modes

### Managed export
Produces:
- managed deployment bundle,
- provider and connector manifest,
- policy manifest,
- audit / receipt bundle.

### Local export
Produces:
- local runtime package or workspace bundle,
- runtime registration config,
- local provider requirements,
- audit / receipt bundle.

### Hybrid export
Produces:
- split manifests for hosted vs local responsibilities,
- sync policy bundle,
- bridge configuration.

## Export rules

- no final export from an unverified high-risk mobile interaction,
- no export without runtime compatibility results,
- no export without provider receipts for delegated work,
- no export when unresolved critical conflicts remain.

## User expectation

Export should feel like:
- a reviewed release candidate,

not:
- a lucky side effect of a chaotic conversation.
