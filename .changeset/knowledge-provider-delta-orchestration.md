---
"@contractspec/lib.contracts-integrations": minor
"@contractspec/lib.contracts-spec": minor
"@contractspec/lib.knowledge": minor
"@contractspec/bundle.library": patch
"@contractspec/bundle.marketing": patch
"@contractspec/app.web-landing": patch
"@contractspec/example.knowledge-canon": patch
---

Add provider-backed knowledge orchestration for Gmail and Google Drive.

Provider delta contracts now model leases, cursor and watermark versions, webhook channel and resource expiry, provider event IDs, dedupe and idempotency keys, replay checkpoints, and tombstones before runtime sync starts. `@contractspec/lib.knowledge` now persists checkpoint deltas for Gmail and Drive ingestion, manages Drive watch checkpoints, and gates external knowledge mutations with dry-runs, approval refs, idempotency, audit evidence, and outbound-send controls.

ContractSpec now exposes `knowledge.mutation.evaluateGovernance`, and the library docs, web docs, generated DocBlocks, release capsule, examples, and `/llms*` surfaces document the provider-backed knowledge adoption path.
