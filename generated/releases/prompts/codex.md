Apply the ContractSpec upgrade plan in this workspace using codex.

Target packages:
@contractspec/app.web-landing: unknown -> latest
@contractspec/bundle.library: unknown -> 3.10.1
@contractspec/bundle.marketing: unknown -> 3.8.25
@contractspec/example.knowledge-canon: unknown -> 3.8.4
@contractspec/lib.contracts-integrations: unknown -> 3.9.0
@contractspec/lib.contracts-spec: unknown -> 6.3.0
@contractspec/lib.knowledge: unknown -> 3.8.4

Required steps:
- [manual] Attach delta state before runtime sync: Use `ProviderDeltaSyncState` for provider cursors, leases, webhook expiry, dedupe, idempotency, replay, and tombstone state.
  - Pass provider cursor or watermark state into Gmail and Drive sync calls.
  - Persist returned delta state before acknowledging runtime sync work.
  - Skip or delete records marked with tombstones before re-indexing.
- [manual] Gate knowledge mutations before provider writes: Wrap external writes with `executeGovernedKnowledgeMutation(...)` so dry-runs, approvals, idempotency, audit evidence, and outbound-send gates are explicit.
  - Use `dryRun` for preview-only flows.
  - Provide `idempotencyKey` and `auditEvidence.evidenceRef` for non-dry-run mutations.
  - Require approval refs and an approved outbound-send gate before sending external messages.