---
"@contractspec/lib.knowledge": minor
"@contractspec/example.knowledge-canon": minor
---

Complete the knowledge OSS surface with stricter guardrails and an easier runtime path.

`@contractspec/lib.knowledge` now exposes a higher-level `KnowledgeRuntime` helper for the common ingest -> retrieve -> answer flow, adds per-query overrides on `KnowledgeQueryService`, and makes typed retrieval filters (`locale`, `category`) real rather than documentation-only. The access guard now enforces `automationWritable` and denies missing workflow/agent bindings when scoped allow-lists exist, which aligns runtime behavior with the contracts-spec knowledge semantics. The package also gains deeper regression coverage over previously untested public primitives.

`@contractspec/example.knowledge-canon` now demonstrates a real `lib.knowledge` retrieval path instead of a placeholder TODO, so OSS consumers have a concrete example package they can reuse.
