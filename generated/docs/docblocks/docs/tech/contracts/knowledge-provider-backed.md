# Provider-backed knowledge

Provider-backed knowledge starts from the same `KnowledgeSpaceSpec` and
`KnowledgeSourceConfig` surfaces, then adds explicit provider delta and
mutation governance evidence before runtime sync begins.

Gmail and Google Drive ingestion should persist `ProviderDeltaSyncState` per
source so leases, cursors, webhook channel expiry, provider event IDs,
dedupe/idempotency keys, replay checkpoints, and tombstones survive retries.

External mutations should route through
`knowledge.mutation.evaluateGovernance` or
`@contractspec/lib.knowledge/governance` so dry-runs, approval refs,
idempotency keys, audit evidence, and outbound-send gates are recorded before
provider writes happen.