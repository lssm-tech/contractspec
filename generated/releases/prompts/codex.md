Apply the ContractSpec upgrade plan in this workspace using codex.

Target packages:
@contractspec/app.web-landing: unknown -> latest
@contractspec/bundle.library: unknown -> 3.10.2
@contractspec/bundle.marketing: unknown -> 3.8.26
@contractspec/example.knowledge-canon: unknown -> 3.8.5
@contractspec/lib.contracts-integrations: unknown -> 3.10.0
@contractspec/lib.contracts-spec: unknown -> 6.4.0
@contractspec/lib.knowledge: unknown -> 3.9.0
@contractspec/lib.personalization: unknown -> 6.2.0

Required steps:
- [assisted] Use adaptive experience primitives for transparent personalization: Layer behavior support and evidence-based suggestions on top of existing PreferenceDimensions without replacing authorization or business rules.
  - Keep `PreferenceDimensions` focused on software/tool interaction.
  - Use `BehaviorSupportDimensions` for action, recovery, reflection, and accountability support.
  - Represent observed behavior with `BehaviorSignalModel` and user-facing reasons.
  - Resolve `ResolvedAdaptiveExperience` at runtime instead of storing it as a hidden profile.
- [manual] Attach delta state before runtime sync: Use `ProviderDeltaSyncState` for provider cursors, leases, webhook expiry, dedupe, idempotency, replay, and tombstone state.
  - Pass provider cursor or watermark state into Gmail and Drive sync calls.
  - Persist returned delta state before acknowledging runtime sync work.
  - Skip or delete records marked with tombstones before re-indexing.
- [manual] Gate knowledge mutations before provider writes: Wrap external writes with `executeGovernedKnowledgeMutation(...)` so dry-runs, approvals, idempotency, audit evidence, and outbound-send gates are explicit.
  - Use `dryRun` for preview-only flows.
  - Provide `idempotencyKey` and `auditEvidence.evidenceRef` for non-dry-run mutations.
  - Require approval refs and an approved outbound-send gate before sending external messages.